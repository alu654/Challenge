export interface TreeNode {
    id: string;
    name: string;
    description: string;
    children: TreeNode[];
    categoria_superior_id?: string; 
    toggled?: boolean;
    isEvaluator: boolean;
  }
  
  export interface Categoria {
    id: string;
    nombre: string;
    descripcion?: string | null; 
    categoria_superior_id: string | null;
    isEvaluator?: boolean; 
  }

export interface DataItem {
  id: string;
  nombre: string;
  descripcion: string | null;
  categoria_superior_id: string | null;
  es_evaluador?: number; 
}


  