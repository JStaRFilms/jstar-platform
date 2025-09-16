
'use client';

import { useState } from 'react';

export const usePortfolioFilter = (initialFilter: string) => {
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return {
    activeFilter,
    handleFilterChange,
  };
};
