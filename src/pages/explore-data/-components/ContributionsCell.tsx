import { Box, Popover } from '@mui/material';
import { useState, useRef, useMemo } from 'react';
import Plot from 'react-plotly.js';

interface ContributionsCellProps {
  value: number;
  all: any;
  current: any;
}

/**
 * Cell component that displays a Plotly chart in a popover on hover
 */
export const ContributionsCell: React.FC<ContributionsCellProps> = ({
  value,
  all,
  current,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Memoize the x and y values to prevent recalculation
  const xValue = useMemo(() => all.map((el: any) => el.title), [all]);
  const yValue = useMemo(
    () =>
      all.map((el: any) => {
        return el.stats.contributions;
      }),
    [all]
  );

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setHoveredBarIndex(null);
  };

  const open = Boolean(anchorEl);

  // Memoize bar colors to prevent unnecessary recalculations
  const barColors = useMemo(() => {
    return xValue.map((title: any, index: number) => {
      // Make the bar red if its title matches the current row's title
      if (title === current.title) {
        return 'red';
      }
      // Optionally highlight hovered bars in a different color
      if (hoveredBarIndex === index) {
        return '#ff6b6b'; // Lighter red for hover on other bars
      }
      return '#1f77b4'; // Default Plotly blue
    });
  }, [xValue, hoveredBarIndex, current.title]);

  // Memoize chart data to prevent Plot component from re-rendering unnecessarily
  const chartData = useMemo(
    () => [
      {
        x: xValue,
        y: yValue,
        type: 'bar' as const,
        marker: {
          color: barColors,
        },
      },
    ],
    [xValue, yValue, barColors]
  );

  return (
    <Box sx={{ height: '100%' }}>
      <Box
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        {value}
      </Box>
      <Popover
        id="contributions-chart-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Box
          ref={chartRef}
          sx={{
            padding: 2,
            pointerEvents: 'auto',
          }}
        >
          <Plot
            data={chartData}
            layout={{
              width: 500,
              height: 500,
              title: 'Contributions Chart',
              margin: { t: 40, r: 20, b: 40, l: 40 },
            }}
            config={{
              displayModeBar: false,
            }}
            onHover={(data) => {
              if (data.points && data.points.length > 0) {
                setHoveredBarIndex(data.points[0].pointIndex);
              }
            }}
            onUnhover={() => {
              setHoveredBarIndex(null);
            }}
          />
        </Box>
      </Popover>
    </Box>
  );
};
