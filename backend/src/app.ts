import express from "express";
import pool from "../db";

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM categorias_test WHERE id = 1");
    res.json(result.rows); 
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
