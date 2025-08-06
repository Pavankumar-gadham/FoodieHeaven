export interface Recipe {
  id?: number;
  image: string;
  title: string;
  description: string;
  category: number;
  category_name?: string;
  preparation_time: number;
  cooking_time: number;
  rating: number;
  process: string;
  created_by?: any;
  price: number;
  created_at:number
}
