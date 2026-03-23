import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface Breadcrumb {
  label: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actionButton?: React.ReactNode;
}

export default function PageHeader({ title, description, breadcrumbs, actionButton }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center text-sm font-medium text-gray-500 mb-2 space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <span 
                  className={`hover:text-gray-900 transition-colors ${crumb.onClick ? 'cursor-pointer' : ''}`}
                  onClick={crumb.onClick}
                >
                  {crumb.label}
                </span>
                {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400" />}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actionButton && (
        <div className="flex-shrink-0">
          {actionButton}
        </div>
      )}
    </div>
  );
}
