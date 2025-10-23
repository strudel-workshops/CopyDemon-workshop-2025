import { Alert, Box, LinearProgress, Skeleton, Link } from '@mui/material';
import { GridPaginationModel } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { useFilters } from '../../../components/FilterContext';
import { SciDataGrid } from '../../../components/SciDataGrid';
import { ContributionsCell } from './ContributionsCell';
import { filterData } from '../../../utils/filters.utils';
import { useListQuery } from '../../../hooks/useListQuery';
import { FilterConfig } from '../../../types/filters.types';

interface DataViewProps {
  filterConfigs: FilterConfig[];
  searchTerm: string;
  setPreviewItem: React.Dispatch<React.SetStateAction<any>>;
}
/**
 * Query the data rows and render as an interactive table
 */
export const DataView: React.FC<DataViewProps> = ({
  filterConfigs,
  searchTerm,
  setPreviewItem,
}) => {
  const { activeFilters } = useFilters();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [offset, setOffest] = useState(page * pageSize);
  // CUSTOMIZE: the unique ID field for the data source
  const dataIdField = 'owner';
  // CUSTOMIZE: query mode, 'client' or 'server'
  // const queryMode = 'server';
  const queryMode = 'client';
  let { isPending, isFetching, isError, data, error } = useListQuery({
    activeFilters,
    // CUSTOMIZE: the table data source
    // dataSource: 'dummy-data/exoplanets.csv',
    dataSource: 'dummy-data/explor.json',
    // dataSource: 'https://contribs-api.materialsproject.org/projects
    filterConfigs,
    offset,
    page,
    pageSize,
    queryMode,
    staticParams: null,
  });

  const handleRowClick = (rowData: any) => {
    setPreviewItem(rowData.row);
  };

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    // Reset page to first when the page size changes
    const newPage = model.pageSize !== pageSize ? 0 : model.page;
    const newPageSize = model.pageSize;
    const newOffset = newPage * newPageSize;
    setPage(newPage);
    setPageSize(newPageSize);
    setOffest(newOffset);
  };

  // Show a loading skeleton while the initial query is pending
  if (isPending) {
    const emptyRows = new Array(pageSize).fill(null);
    const indexedRows = emptyRows.map((row, i) => i);
    return (
      <Box
        sx={{
          padding: 2,
        }}
      >
        {indexedRows.map((row) => (
          <Skeleton key={row} height={50} />
        ))}
      </Box>
    );
  }

  // Show an error message if the query fails
  if (isError) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  // Show the data when the query completes
  return (
    <>
      {isFetching && <LinearProgress variant="indeterminate" />}
      <SciDataGrid
        rows={filterData(data, activeFilters, filterConfigs, searchTerm)}
        pagination
        paginationMode={queryMode}
        onPaginationModelChange={handlePaginationModelChange}
        getRowId={(row) => row[dataIdField]}
        // CUSTOMIZE: the table columns
        columns={[
          {
            field: 'name',
            headerName: 'ID as name',
            type: 'string',
            width: 100,
            renderCell: (params) => (
              <Link
                href={`http://localhost:8081/contribs/projects/${params.value}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                {params.value}
              </Link>
            ),
          },
          {
            field: 'title',
            headerName: 'Title',
            width: 400,
          },
          {
            field: 'is_public',
            headerName: 'Public',
            width: 150,
            type: 'boolean',
          },
          {
            field: 'is_approved',
            headerName: 'Approved',
            width: 150,
            type: 'boolean',
          },
          {
            field: 'stats.columns',
            headerName: 'Columns',
            width: 150,
            type: 'number',
            valueGetter: (value, row) => {
              return row.stats?.columns;
            },
          },
          {
            field: 'stats.contributions',
            headerName: 'Contributions',
            width: 150,
            type: 'number',
            valueGetter: (value, row) => {
              return row.stats?.contributions;
            },
            renderCell: (params) => (
              // <ContributionsCell value={params.value} />
              <ContributionsCell
                value={params.value}
                all={data}
                current={params}
              />
            ),
          },
          {
            field: 'stats.tables',
            headerName: 'Tables',
            width: 150,
            type: 'number',
            valueGetter: (value, row) => {
              return row.stats?.tables;
            },
          },
          {
            field: 'stats.structures',
            headerName: 'Structures',
            width: 150,
            type: 'number',
            valueGetter: (value, row) => {
              return row.stats?.structures;
            },
          },
          {
            field: 'stats.attachments',
            headerName: 'Attachments',
            width: 150,
            type: 'number',
            valueGetter: (value, row) => {
              return row.stats?.attachments;
            },
          },
        ]}
        disableColumnSelector
        autoHeight
        initialState={{
          pagination: { paginationModel: { page, pageSize } },
        }}
        onRowClick={handleRowClick}
      />
    </>
  );
};
