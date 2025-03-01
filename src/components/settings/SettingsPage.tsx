import React, { useState, useEffect } from "react";
import { Category } from "../../types";
import { getBudgetData, resetData } from "../../utils/storage";
import CategorySettings from "./CategorySettings";
import DataSettings from "./DataSettings";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import Button from "../ui/Button";
import { ArrowRight } from "lucide-react";

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const handleResetData = () => {
    if (
      window.confirm(
        "האם אתה בטוח שברצונך לאפס את כל הנתונים? פעולה זו אינה ניתנת לביטול."
      )
    ) {
      resetData();
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={onBack} className="ml-4">
          <ArrowRight size={16} className="ml-1" /> חזרה
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">הגדרות</h1>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories">קטגוריות</TabsTrigger>
          <TabsTrigger value="data">ניהול נתונים</TabsTrigger>
          <TabsTrigger value="general">כללי</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">ניהול קטגוריות</h2>
            </CardHeader>
            <CardContent>
              <CategorySettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">ניהול נתונים</h2>
            </CardHeader>
            <CardContent>
              <DataSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">הגדרות כלליות</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">איפוס יישום</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    פעולה זו תמחק את כל הנתונים שלך ותאפס את היישום למצב ברירת
                    המחדל. לא ניתן לבטל פעולה זו.
                  </p>
                  <Button variant="danger" onClick={handleResetData}>
                    איפוס כל הנתונים
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
