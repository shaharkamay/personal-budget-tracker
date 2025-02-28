import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
  selectedTab: string;
  setSelectedTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className = '' }) => {
  const [selectedTab, setSelectedTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '' }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  
  const { selectedTab, setSelectedTab } = context;
  const isSelected = selectedTab === value;
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => setSelectedTab(value)}
      className={`
        px-3 py-1.5 text-sm font-medium transition-all
        ${isSelected 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900'
        }
        rounded-md ${className}
      `}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  
  const { selectedTab } = context;
  
  if (selectedTab !== value) {
    return null;
  }
  
  return <div className={className}>{children}</div>;
};