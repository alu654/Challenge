import express from "express";
import cors from "cors";
import pool from "../db";
import "dotenv/config"

const app = express();
const port = process.env.APP_PORT;

app.use(cors());
app.use(express.json()); 

app.get("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM categorias_test");
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

app.post('/categorias', async (req, res) => {
  const { nombre, descripcion, categoria_superior_id, es_evaluador, estatus_id } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const idRes = await client.query('SELECT MAX(id) FROM categorias_test');
    const maxId = idRes.rows[0].max || 0; 
    const newId = maxId + 1;


    const insertQuery = `
      INSERT INTO categorias_test(id, nombre, descripcion, categoria_superior_id, es_evaluador, estatus_id) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const insertRes = await client.query(insertQuery, [newId, nombre, descripcion, categoria_superior_id, es_evaluador, estatus_id]);

    await client.query('COMMIT');
    res.json(insertRes.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error executing query', error.stack);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

app.put("/category/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, parent_category_id } = req.body;

  const client = await pool.connect();
  try {
    const result = await client.query(
      "UPDATE categorias_test SET nombre = $1, descripcion = $2, categoria_superior_id = $3 WHERE id = $4 RETURNING *",
      [name, description, parent_category_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});


app.delete("/category/:id", async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect();
  try {
    await client.query("DELETE FROM categorias_test WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});


app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
