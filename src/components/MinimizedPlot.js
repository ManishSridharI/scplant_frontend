import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { useAuth } from '../Auth';
import { Paper, Typography } from "@mui/material";

const MinimizedPlot = ({ plotType, title, type, filesId }) => {
  const { user, csrfToken } = useAuth(); 
  const [plotData, setPlotData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedVisualization, setSelectedVisualization] = useState(
    localStorage.getItem("selectedVisualization") || "UMAP"
  );

  // Determine API endpoint based on plot type
  const apiEndpoints = {
    dimplot: "/api/jobs/api/dim_plot/",
    dotplot: "/api/jobs/api/dot_plot/",
  };

  // Fetch minimized plot data once on component mount
  useEffect(() => {
    const fetchMinimizedPlot = async () => {
      try {
        const response = await fetch(apiEndpoints[plotType], {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // Include CSRF token
          },
          credentials: 'include',
          body: JSON.stringify({
              job_annotate_and_plot_id: filesId,
              method: selectedVisualization,
              marker: 'Top 5'
          })
      });
        if (!response.ok) {
          throw new Error(`Failed to fetch ${plotType}: ${response.statusText}`);
        }

        const { data } = await response.json();
        setPlotData(data);
      } catch (err) {
        console.error(`Error fetching ${plotType}:`, err);
        setError(err.message);
      }
    };

    fetchMinimizedPlot(filesId, selectedVisualization);
  }, [plotType, filesId, selectedVisualization]);

  return (
    <Paper
      elevation={3}
      sx={{
        overflow: "hidden",
        borderRadius: 2,
        p: 2,
        cursor: "pointer",
        transition: "0.3s",
        "&:hover": { backgroundColor: "blue.100" },
        height: "35vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>

      {error ? (
        <Typography color="error" align="center">
          Error: {error}
        </Typography>
      ) : plotData ? (
        <Plot
          data={plotData}
          layout={{ showlegend: false, margin: { l: 10, r: 10, t: 10, b: 10 } }}
          style={{ width: "100%", height: "100%" }}
          config={{ responsive: true, displayModeBar: false }}
        />
      ) : (
        <Typography color="gray" align="center">
          Loading {plotType}...
        </Typography>
      )}
    </Paper>
  );
};

export default MinimizedPlot;