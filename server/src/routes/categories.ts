// src/routes/categoriesRoutes.ts
import { Router } from 'express';
import { CategoriesController } from '../controllers/categories';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/categories - Get all categories
router.get('/', CategoriesController.getCategories);

// POST /api/categories - Add a new category
router.post('/', CategoriesController.addCategory);

// PUT /api/categories/:id - Update a category
router.put('/:id', CategoriesController.updateCategory);

// DELETE /api/categories/:id - Delete a category
router.delete('/:id', CategoriesController.deleteCategory);

export default router;