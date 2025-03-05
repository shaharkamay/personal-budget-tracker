// src/controllers/categoriesController.ts
import { Request, Response } from 'express';
import { CategoriesService } from '../services/categories';
import { Category } from '../models/category';
import { ApiResponse } from '../models/api';

export class CategoriesController {
  /**
   * Get all categories
   */
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoriesService.getCategories();
      const response: ApiResponse<Category[]> = {
        success: true,
        data: categories
      };
      res.json(response);
    } catch (error) {
      console.error('Controller error fetching categories:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Add a new category
   */
  static async addCategory(req: Request, res: Response): Promise<void> {
    try {
      const category: Category = req.body;
      
      // Validate category
      if (!category.name || !category.color || category.budgetLimit === undefined) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Missing required fields'
        };
        res.status(400).json(response);
        return;
      }
      
      const updatedRange = await CategoriesService.addCategory(category);
      const response: ApiResponse<null> = {
        success: true,
        message: `Category added successfully to ${updatedRange}`
      };
      res.status(201).json(response);
    } catch (error) {
      console.error('Controller error adding category:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Update an existing category
   */
  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = req.params.id;
      const category: Category = req.body;
      
      // Validate category
      if (!category.name || !category.color || category.budgetLimit === undefined) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Missing required fields'
        };
        res.status(400).json(response);
        return;
      }
      
      const updatedRange = await CategoriesService.updateCategory(categoryId, category);
      const response: ApiResponse<null> = {
        success: true,
        message: `Category updated successfully at ${updatedRange}`
      };
      res.json(response);
    } catch (error) {
      console.error('Controller error updating category:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Delete a category
   */
  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = req.params.id;
      
      await CategoriesService.deleteCategory(categoryId);
      const response: ApiResponse<null> = {
        success: true,
        message: 'Category deleted successfully'
      };
      res.json(response);
    } catch (error) {
      console.error('Controller error deleting category:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }
}