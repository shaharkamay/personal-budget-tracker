// src/models/entry.ts
export interface Entry {
    date: string;
    category: string;
    amount: number;
    description: string;
    rowIndex?: number;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }