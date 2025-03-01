import React, { useState } from "react";
import { Category } from "../../types";
import {
  addCategory,
  updateCategory,
  deleteCategory,
  getBudgetData,
} from "../../utils/storage";
import { getRandomColor } from "../../utils/calculations";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Plus, Trash2, Edit } from "lucide-react";

const CategorySettings: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(
    () => getBudgetData().categories
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryLimit, setNewCategoryLimit] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const limit = parseFloat(newCategoryLimit) || 0;

    const newCategory = addCategory({
      name: newCategoryName.trim(),
      color: getRandomColor(),
      budgetLimit: limit,
    });

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setNewCategoryLimit("");
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return;

    updateCategory(editingCategory);

    setCategories(
      categories.map((cat) =>
        cat.id === editingCategory.id ? editingCategory : cat
      )
    );

    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    if (
      window.confirm(
        "האם אתה בטוח שברצונך למחוק קטגוריה זו? כל ההוצאות המשויכות יימחקו גם כן."
      )
    ) {
      deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">הוסף קטגוריה חדשה</h3>
        <div className="flex flex-wrap gap-2">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="שם קטגוריה חדש"
            className="flex-1"
          />

          <Input
            type="number"
            min="0"
            step="0.01"
            value={newCategoryLimit}
            onChange={(e) => setNewCategoryLimit(e.target.value)}
            placeholder="מגבלת תקציב (אופציונלי)"
            className="w-32"
          />

          <Button
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
            className="whitespace-nowrap"
          >
            <Plus size={16} className="ml-1" /> הוסף
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium mb-2">קטגוריות קיימות</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              {editingCategory && editingCategory.id === category.id ? (
                <div className="flex flex-wrap flex-1 gap-2">
                  <Input
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                    placeholder="שם קטגוריה"
                    className="flex-1"
                  />

                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingCategory.budgetLimit.toString()}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        budgetLimit: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="מגבלת תקציב"
                    className="w-32"
                  />

                  <Button
                    variant="secondary"
                    onClick={() => setEditingCategory(null)}
                  >
                    ביטול
                  </Button>
                  <Button onClick={handleUpdateCategory}>שמור</Button>
                </div>
              ) : (
                // <div className="flex-1 flex space-x-2">

                //   <Input
                //     value={editingCategory.name}
                //     onChange={(e) =>
                //       setEditingCategory({
                //         ...editingCategory,
                //         name: e.target.value,
                //       })
                //     }
                //     className="flex-1"
                //   />
                //   <Input
                //     type="number"
                //     min="0"
                //     step="0.01"
                //     value={editingCategory.budgetLimit.toString()}
                //     onChange={(e) =>
                //       setEditingCategory({
                //         ...editingCategory,
                //         budgetLimit: parseFloat(e.target.value) || 0,
                //       })
                //     }
                //     className="w-32 mx-2"
                //     placeholder="מגבלת תקציב"
                //   />

                //   <Button
                //     variant="secondary"
                //     onClick={() => setEditingCategory(null)}
                //     className="mr-2"
                //   >
                //     ביטול
                //   </Button>
                //   <Button onClick={handleUpdateCategory} className="mr-2">
                //     שמור
                //   </Button>
                // </div>
                <>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full ml-3"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-gray-500 hover:text-red-500 mx-1"
                    >
                      <Trash2 size={16} />
                    </button>

                    <button
                      onClick={() => setEditingCategory(category)}
                      className="text-gray-500 hover:text-blue-500 mx-1"
                    >
                      <Edit size={16} />
                    </button>

                    <span className="text-sm text-gray-500 mr-2">
                      {category.budgetLimit > 0
                        ? `תקציב: ${category.budgetLimit.toFixed(2)} ₪`
                        : "ללא מגבלת תקציב"}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}

          {categories.length === 0 && (
            <p className="text-gray-500 text-sm italic">
              עדיין לא הוגדרו קטגוריות.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySettings;
