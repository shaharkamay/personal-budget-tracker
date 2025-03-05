// src/services/categoriesService.ts
import { sheets, SPREADSHEET_ID } from "../config/sheets";
import { Category } from "../models/category";

const CATEGORIES_SHEET_NAME = "Categories";

export class CategoriesService {
  /**
   * Fetch all categories from the spreadsheet
   */
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${CATEGORIES_SHEET_NAME}!A2:D`,
      });

      const rows = response.data.values || [];
      return rows.map((row, index) => ({
        name: row[0],
        color: row[1],
        budgetLimit: parseFloat(row[2]) || 0,
        id: (index + 2).toString(), // Using row number as ID
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  /**
   * Add a new category to the spreadsheet
   */
  static async addCategory(category: Category): Promise<string> {
    try {
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `!A13:D13`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [[category.name, category.color, category.budgetLimit]],
        },
      });

      return response.data.updates?.updatedRange || "Category added";
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  }

  /**
   * Update an existing category in the spreadsheet
   */
  static async updateCategory(
    categoryId: string,
    category: Category
  ): Promise<string> {
    try {
      const rowNumber = parseInt(categoryId);

      if (isNaN(rowNumber)) {
        throw new Error("Invalid category ID");
      }

      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${CATEGORIES_SHEET_NAME}!A${rowNumber}:C${rowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[category.name, category.color, category.budgetLimit]],
        },
      });

      return response.data.updatedRange || "Category updated";
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  /**
   * Delete a category from the spreadsheet
   */
  static async deleteCategory(categoryId: string): Promise<void> {
    try {
      const rowNumber = parseInt(categoryId);

      if (isNaN(rowNumber)) {
        throw new Error("Invalid category ID");
      }

      // Get the sheet ID first
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });

      const sheet = spreadsheet.data.sheets?.find(
        (s) => s.properties?.title === CATEGORIES_SHEET_NAME
      );

      if (!sheet || !sheet.properties?.sheetId) {
        throw new Error(`Sheet "${CATEGORIES_SHEET_NAME}" not found`);
      }

      const sheetId = sheet.properties.sheetId;

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: sheetId,
                  dimension: "ROWS",
                  startIndex: rowNumber - 1, // 0-indexed in the API
                  endIndex: rowNumber, // exclusive
                },
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}
