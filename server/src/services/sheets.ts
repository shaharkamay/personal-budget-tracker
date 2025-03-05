// src/services/sheetsService.ts
import { sheets, SPREADSHEET_ID, ENTRIES_SHEET_NAME } from '../config/sheets';
import { Entry } from '../models/entry';

export class SheetsService {
  /**
   * Fetch all entries from the spreadsheet
   */
  static async getEntries(): Promise<Entry[]> {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${ENTRIES_SHEET_NAME}!A2:D`,
        });
        console.log('moshe')

      const rows = response.data.values || [];
      return rows.map((row, index) => ({
        date: row[0],
        category: row[1],
        amount: parseFloat(row[2]),
        description: row[3],
        rowIndex: index
      }));
    } catch (error) {
      console.error('Error fetching entries:', error);
      throw error;
    }
  }

  /**
   * Add a new entry to the spreadsheet
   */
  static async addEntry(entry: Entry): Promise<string> {
    try {
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${ENTRIES_SHEET_NAME}!A:D`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [[entry.date, entry.category, entry.amount, entry.description]]
        }
      });

      
      const appendResponse = response as unknown as { data: { updates?: { updatedRange: string } } };
      return appendResponse.data.updates?.updatedRange || 'Entry added';
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    }
  }

  /**
   * Update an existing entry in the spreadsheet
   */
  static async updateEntry(rowIndex: number, entry: Entry): Promise<string> {
    try {
      const rowNumber = rowIndex + 2; // +2 for header row and 1-indexing
      
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${ENTRIES_SHEET_NAME}!A${rowNumber}:D${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[entry.date, entry.category, entry.amount, entry.description]]
        }
      });

      return response.data.updatedRange || 'Entry updated';
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    }
  }

  /**
   * Delete an entry from the spreadsheet
   */
  static async deleteEntry(rowIndex: number): Promise<void> {
    try {
      // Get the sheet ID first
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID
      });
      
      const sheet = spreadsheet.data.sheets?.find(s => 
        s.properties?.title === ENTRIES_SHEET_NAME
      );
      
      if (!sheet || !sheet.properties?.sheetId) {
        throw new Error(`Sheet "${ENTRIES_SHEET_NAME}" not found`);
      }
      
      const sheetId = sheet.properties.sheetId;
      const rowNumber = rowIndex + 2; // +2 for header row and 1-indexing
      
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: sheetId,
                  dimension: 'ROWS',
                  startIndex: rowNumber - 1, // 0-indexed in the API
                  endIndex: rowNumber // exclusive
                }
              }
            }
          ]
        }
      });
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  }
}