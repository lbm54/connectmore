"use client";

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Category } from '@/features/organizers/models/categories_tags';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <Tabs value={activeCategory} onValueChange={onCategoryChange} className="hidden md:block w-full">
      <div className="overflow-x-auto">
        <TabsList className="h-14 p-1 bg-surface-800 border border-surface-700 rounded-lg shadow-lg">
          <TabsTrigger 
            value="all" 
            className="relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-surface-700 text-surface-300 data-[state=active]:border-0"
          >
            All Events
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id.toString()}
              className="relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:gradient-secondary data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-surface-700 text-surface-300 data-[state=active]:border-0"
            >
              {category.category_name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}