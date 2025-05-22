
import React, { useState, useEffect } from 'react';
import {
  Table,
  Form,
  Row,
  Col,
  Button,
  InputGroup,
  Pagination
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faSortAmountDown,
  faChevronLeft,
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';

const DataTableWithFilters = ({
  columns,
  data,
  pagination = true,
  itemsPerPageOptions = [10, 25, 50, 100],
  filters = [],
  actions,
  noDataMessage = "No data available",
  className = "",
  filterLayout = "inline",
  showSearch = true
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter data based on search term and filters
  const filteredData = data.filter(item => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = columns.some(col => {
        const value = item[col.field];
        return value && value.toString().toLowerCase().includes(searchLower);
      });
      if (!matchesSearch) return false;
    }

    // Custom filters
    for (const [key, value] of Object.entries(filterValues)) {
      if (value && item[key] !== value) {
        return false;
      }
    }

    return true;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset to first page when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterValues, itemsPerPage]);

  // Page change handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Create pagination items
  const paginationItems = [];
  const maxPaginationItems = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPaginationItems / 2));
  let endPage = Math.min(totalPages, startPage + maxPaginationItems - 1);

  if (endPage - startPage + 1 < maxPaginationItems) {
    startPage = Math.max(1, endPage - maxPaginationItems + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilterValues({});
    setSearchTerm('');
  };

  // Render filter section
  const renderFilters = () => {
    if (filters.length === 0) return null;

    return (
      <div className={`data-table-filters ${showFilters || filterLayout === "inline" ? '' : 'd-none'}`}>
        <Row className="g-3">
          {filters.map((filter, index) => (
            <Col md={filter.width || 6} lg={filter.width || 4} key={index}>
              <Form.Group>
                <Form.Label>{filter.label}</Form.Label>
                <Form.Select
                  onChange={(e) => handleFilterChange(filter.field, e.target.value)}
                  value={filterValues[filter.field] || ''}
                  className="shadow-sm"
                >
                  <option value="">All {filter.label}s</option>
                  {filter.options.map((opt, i) => (
                    <option key={i} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          ))}

          <Col xs={12} className="d-flex justify-content-end">
            <Button
              variant="outline-secondary"
              className="me-2"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>

            {filterLayout !== "inline" && (
              <Button
                variant="outline-primary"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            )}
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div className={`data-table-wrapper ${className}`}>
      {/* Search and Filter Controls */}
      <div className="data-table-actions">
        <Row className="align-items-center">
          {/* Search Input */}
          {showSearch && (
            <Col md={6} className="mb-2 mb-md-0">
              <div className="search-input-container">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="shadow-sm"
                />
              </div>
            </Col>
          )}

          <Col md={6} className="d-flex justify-content-start">
            {filters.length > 0 && filterLayout !== "inline" && (
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FontAwesomeIcon icon={faFilter} className="me-1" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            )}

            {actions && (
              <div>
                {actions}
              </div>
            )}
          </Col>
        </Row>

        {/* Filter Panel */}
        {renderFilters()}
      </div>

      {/* Data Table */}
      <div className="table-responsive">
        <Table hover responsive className="align-middle">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={column.className || ''}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className={column.className || ''}>
                      {column.render
                        ? column.render(item[column.field], item, rowIndex)
                        : item[column.field]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  {noDataMessage}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination and Page Size Controls */}
      {pagination && filteredData.length > 0 && (
        <div className="data-table-footer">
          <div className="items-per-page">
            <Form.Select
              size="sm"
              className="per-page-selector shadow-sm"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
              }}
              style={{ width: 'auto', display: 'inline-block' }}
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </Form.Select>
          </div>

          <Pagination size="sm" className="mb-0">
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </Pagination.First>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </Pagination.Prev>

            {startPage > 1 && (
              <>
                <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
                {startPage > 2 && <Pagination.Ellipsis />}
              </>
            )}

            {paginationItems}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <Pagination.Ellipsis />}
                <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </Pagination.Item>
              </>
            )}

            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </Pagination.Next>
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </Pagination.Last>
          </Pagination>

          <div className="showing-entries">
            Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTableWithFilters;
