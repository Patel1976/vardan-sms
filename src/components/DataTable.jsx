
import React from 'react';
import DataTableWithFilters from './DataTableWithFilters';

// This is a wrapper component to maintain backward compatibility
const DataTable = (props) => {
  return <DataTableWithFilters {...props} />;
};

export default DataTable;
