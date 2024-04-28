import { DataItem } from './types';

export async function fetchData(): Promise<DataItem[]> {
  const response = await fetch('http://localhost:3000/');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data: DataItem[] = await response.json();
  return data.map(item => ({
    id: item.id.toString(),
    nombre: item.nombre,
    descripcion: item.descripcion || '',
    categoria_superior_id: item.categoria_superior_id,
    isEvaluator: Number(item.es_evaluador) === 1,
  }));
}
