import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsLayoutProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  children?: React.ReactNode;
}

export default function TabsLayout({ tabs, activeTab, onChange, children }: TabsLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`
                  whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.icon && <span className="mr-2 h-4 w-4">{tab.icon}</span>}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 py-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
