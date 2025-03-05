// src/controllers/entries.ts
import { Request, Response } from 'express';
import { SheetsService } from '../services/sheets';
import { Entry, ApiResponse } from '../models/entry';

export class EntriesController {
  /**
   * Get all entries
   */
  static async getEntries(req: Request, res: Response): Promise<void> {
    try {
      const entries = await SheetsService.getEntries();
      const response: ApiResponse<Entry[]> = {
        success: true,
        data: entries
      };
      res.json(response);
    } catch (error) {
      console.error('Controller error fetching entries:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Add a new entry
   */
  static async addEntry(req: Request, res: Response): Promise<void> {
    try {
      const entry: Entry = req.body;
      
      // Validate entry
      if (!entry.date || !entry.category || entry.amount === undefined || !entry.description) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Missing required fields'
        };
        res.status(400).json(response);
        return;
      }
      
      const updatedRange = await SheetsService.addEntry(entry);
      const response: ApiResponse<null> = {
        success: true,
        message: `Entry added successfully to ${updatedRange}`
      };
      res.status(201).json(response);
    } catch (error) {
      console.error('Controller error adding entry:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Update an existing entry
   */
  static async updateEntry(req: Request, res: Response): Promise<void> {
    try {
      const rowIndex = parseInt(req.params.rowIndex);
      const entry: Entry = req.body;
      
      // Validate entry and rowIndex
      if (isNaN(rowIndex) || rowIndex < 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid row index'
        };
        res.status(400).json(response);
        return;
      }
      
      if (!entry.date || !entry.category || entry.amount === undefined || !entry.description) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Missing required fields'
        };
        res.status(400).json(response);
        return;
      }
      
      const updatedRange = await SheetsService.updateEntry(rowIndex, entry);
      const response: ApiResponse<null> = {
        success: true,
        message: `Entry updated successfully at ${updatedRange}`
      };
      res.json(response);
    } catch (error) {
      console.error('Controller error updating entry:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Delete an entry
   */
  static async deleteEntry(req: Request, res: Response): Promise<void> {
    try {
      const rowIndex = parseInt(req.params.rowIndex);
      
      // Validate rowIndex
      if (isNaN(rowIndex) || rowIndex < 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid row index'
        };
        res.status(400).json(response);
        return;
      }
      
      await SheetsService.deleteEntry(rowIndex);
      const response: ApiResponse<null> = {
        success: true,
        message: 'Entry deleted successfully'
      };
      res.json(response);
    } catch (error) {
      console.error('Controller error deleting entry:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }
}