export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    categories: string[];
  }
  
  export interface Category {
    id: string;
    name: string;
  }