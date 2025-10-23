import { Box, Paper, Stack } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FilterContext } from '../../components/FilterContext';
import { PageHeader } from '../../components/PageHeader';
import { DataView } from './-components/DataView';
import { DataViewHeader } from './-components/DataViewHeader';
import { FiltersPanel } from './-components/FiltersPanel';
import { PreviewPanel } from './-components/PreviewPanel';
import { FilterConfig } from '../../types/filters.types';

export const Route = createFileRoute('/explore-data/')({
  component: DataExplorer,
});

// CUSTOMIZE: the filter definitions
const filterConfigs: FilterConfig[] = [
  {
    field: 'title',
    label: 'Project Title',
    operator: 'contains',
    filterComponent: 'TextField',
  },
  {
    field: 'owner',
    label: 'Project Owner',
    operator: 'contains',
    filterComponent: 'TextField',
  },
  {
    field: 'is_public',
    label: 'Public Status',
    operator: 'equals-one-of',
    filterComponent: 'CheckboxList',
    filterProps: {
      options: [
        {
          label: 'Public',
          value: true,
        },
        {
          label: 'Private',
          value: false,
        },
      ],
    },
  },
  {
    field: 'is_approved',
    label: 'Approval Status',
    operator: 'equals-one-of',
    filterComponent: 'CheckboxList',
    filterProps: {
      options: [
        {
          label: 'Approved',
          value: true,
        },
        {
          label: 'Not Approved',
          value: false,
        },
      ],
    },
  },
  {
    field: 'stats.columns',
    label: 'Number of Columns',
    operator: 'between-inclusive',
    filterComponent: 'RangeSlider',
    filterProps: {
      min: 0,
      max: 800,
    },
  },
  {
    field: 'stats.contributions',
    label: 'Number of Contributions',
    operator: 'between-inclusive',
    filterComponent: 'RangeSlider',
    filterProps: {
      min: 0,
      max: 1200000,
    },
  },
  {
    field: 'stats.structures',
    label: 'Number of Structures',
    operator: 'between-inclusive',
    filterComponent: 'RangeSlider',
    filterProps: {
      min: 0,
      max: 600000,
    },
  },
  {
    field: 'stats.attachments',
    label: 'Number of Attachments',
    operator: 'between-inclusive',
    filterComponent: 'RangeSlider',
    filterProps: {
      min: 0,
      max: 100000,
    },
  },
];

/**
 * Main explorer page in the explore-data Task Flow.
 * This page includes the page header, filters panel,
 * main table, and the table row preview panel.
 */
function DataExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewItem, setPreviewItem] = useState<any>();
  const [showFiltersPanel, setShowFiltersPanel] = useState(true);

  const handleCloseFilters = () => {
    setShowFiltersPanel(false);
  };

  const handleToggleFilters = () => {
    setShowFiltersPanel(!showFiltersPanel);
  };

  const handleClosePreview = () => {
    setPreviewItem(null);
  };

  return (
    <FilterContext>
      <Box>
        <PageHeader
          // CUSTOMIZE: the page title
          pageTitle="Explorer Data App"
          // CUSTOMIZE: the page description
          description="Testing Material Project Contribution Explorer"
          sx={{
            marginBottom: 1,
            padding: 2,
          }}
        />
        <Box>
          <Stack direction="row">
            {showFiltersPanel && (
              <Box
                sx={{
                  width: '350px',
                }}
              >
                <FiltersPanel
                  filterConfigs={filterConfigs}
                  onClose={handleCloseFilters}
                />
              </Box>
            )}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                minHeight: '600px',
                minWidth: 0,
              }}
            >
              <DataViewHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onToggleFiltersPanel={handleToggleFilters}
              />
              <DataView
                filterConfigs={filterConfigs}
                searchTerm={searchTerm}
                setPreviewItem={setPreviewItem}
              />
            </Paper>
            {previewItem && (
              <Box
                sx={{
                  minWidth: '400px',
                }}
              >
                <PreviewPanel
                  previewItem={previewItem}
                  onClose={handleClosePreview}
                />
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </FilterContext>
  );
}
