import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { getBudgetData, resetData } from '../../utils/storage';
import CategorySettings from './CategorySettings';
import DataSettings from './DataSettings';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import Button from '../ui/Button';
import { ArrowLeft } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    const data = getBudgetData();
    setCategories(data.categories);
  }, []);
  
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetData();
      window.location.reload();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={onBack} className="mr-4">
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>
      
      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Manage Categories</h2>
            </CardHeader>
            <CardContent>
              <CategorySettings categories={categories} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Data Management</h2>
            </CardHeader>
            <CardContent>
              <DataSettings />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">General Settings</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">Reset Application</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    This will delete all your data and reset the application to its default state.
                    This action cannot be undone.
                  </p>
                  <Button variant="danger" onClick={handleResetData}>
                    Reset All Data
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