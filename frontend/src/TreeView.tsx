import React, { useState, useEffect } from 'react';
import './arbol.css';
import { fetchData } from './api';
import { TreeNode as TreeNodeType, Categoria } from './types';
import TreeNode from './TreeNode';

const TreeView: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchData()
      .then(categorias => {
        const estructuraArbol = construirEstructuraArbol(categorias);
        setTreeData(estructuraArbol);
      })
      .catch(err => {
        console.error('Error fetching data: ', err);
        setError('Failed to fetch data');
      });
  }, []);

  const construirEstructuraArbol = (categorias: Categoria[]): TreeNodeType[] => {
    const nodos: { [key: string]: TreeNodeType } = {}; 
  
    categorias.forEach(cat => {
      nodos[cat.id] = {
        id: cat.id,
        name: cat.nombre,
        description: cat.descripcion || '',
        children: [],
        categoria_superior_id: cat.categoria_superior_id || undefined,
        isEvaluator: cat.isEvaluator !== undefined ? cat.isEvaluator : false, 
      };
    });
  
    categorias.forEach(cat => {
      if (cat.categoria_superior_id && nodos[cat.categoria_superior_id]) {
        nodos[cat.categoria_superior_id].children.push(nodos[cat.id]);
      }
    });
  
    return Object.values(nodos).filter(nodo => !nodo.categoria_superior_id);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/category/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      setTreeData(prevTreeData => {
        const updatedTreeData = prevTreeData.filter(node => node.id !== id);
        return updatedTreeData;
      });
      console.log('Categoría eliminada con éxito:', id);
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
    }
  };

  const handleEdit = async (id: string, name: string, description: string) => {
    try {
      const response = await fetch(`http://localhost:3000/category/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      const updatedCategory = await response.json();
      console.log('Updated category data:', updatedCategory); 

      setTreeData(prevTreeData => prevTreeData.map(node => node.id === id ? { ...node, name, description } : node));
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <div className="tree-container">
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <ul className="tree-root">
          {treeData.map(node => (
            <TreeNode key={node.id} node={node} level={0} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TreeView;
