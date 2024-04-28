import React, { useState } from 'react';
import { IconButton, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { TreeNode as TreeNodeType } from './types';

interface TreeNodeProps {
  node: TreeNodeType;
  level: number;
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string, description: string) => void;  
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, onDelete, onEdit }) => {
  const [toggled, setToggled] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState(node.name);
  const [editedDescription, setEditedDescription] = useState(node.description);

  const handleToggle = () => {
    setToggled(!toggled);
  };

  const handleDelete = () => {
    onDelete(node.id);
  };

  const toggleEditing = () => {
    setEditing(!editing);
    if (editing) { 
      onEdit(node.id, editedName, editedDescription);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDescription(event.target.value);
  };

  const hasChildren = node.children.length > 0;
  const evaluatorClass = node.isEvaluator ? 'evaluator' : '';
  const evaluatorTextClass = node.isEvaluator ? 'evaluator-text' : '';

  return (
    <li className={`tree-node ${!hasChildren ? 'leaf' : ''} ${evaluatorClass}`}>
      <div
        className="tree-node-content"
        style={{ paddingLeft: `${20 * level}px` }}
        onClick={() => hasChildren && handleToggle()}
      >
        {hasChildren && (
          <span className={`toggle-icon ${toggled ? 'icon-expanded' : 'icon-collapsed'}`}></span>
        )}
        {editing ? (
          <TextField
            value={editedName}
            onChange={handleNameChange}
            onBlur={toggleEditing}
            autoFocus
          />
        ) : (
          <span className={`node-name ${evaluatorTextClass}`} onDoubleClick={toggleEditing}>{node.name}</span>
        )}
        {editing ? (
          <TextField
            value={editedDescription}
            onChange={handleDescriptionChange}
            onBlur={toggleEditing}
          />
        ) : (
          node.description && <div className="node-description" onDoubleClick={toggleEditing}>{node.description}</div>
        )}
        <IconButton aria-label="Edit" onClick={toggleEditing}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="Delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </div>
      {toggled && hasChildren && (
        <ul className="tree-children">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} level={level + 1} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
