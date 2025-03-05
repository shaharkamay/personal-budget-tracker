// src/config/sheets.ts
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.SPREADSHEET_ID) {
  throw new Error('Missing required environment variables for Google Sheets API');
}

// Set up Google Sheets authentication
const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

export const sheets = google.sheets({ version: 'v4', auth });
export const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
export const ENTRIES_SHEET_NAME = 'פברואר 2025';