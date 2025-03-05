// src/routes/entriesRoutes.ts
import { Router } from 'express';
import { EntriesController } from '../controllers/entries';

const router = Router();

// GET /api/entries - Get all entries
router.get('/', EntriesController.getEntries);

// POST /api/entries - Add a new entry
router.post('/', EntriesController.addEntry);

// PUT /api/entries/:rowIndex - Update an entry
router.put('/:rowIndex', EntriesController.updateEntry);

// DELETE /api/entries/:rowIndex - Delete an entry
router.delete('/:rowIndex', EntriesController.deleteEntry);

export default router;