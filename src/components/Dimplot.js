import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { useAuth } from "../Auth";
import { Box, Button, Menu, MenuItem, Typography, Paper } from "@mui/material";


const Dimplot = ({ type, filesId }) => {
  const { user, csrfToken } = useAuth();
  const [plotData, setPlotData] = useState(null);
  const [plotLayout, setPlotLayout] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedVisualization, setSelectedVisualization] = useState(
    localStorage.getItem("selectedVisualization") || "UMAP"
  );
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchDimplot = async (filesId, visualization) => {
    try {
      const response = await fetch("/api/jobs/api/dim_plot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          job_annotate_and_plot_id: filesId,
          method: visualization,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Dimplot: ${response.statusText}`);
      }

      const { data, layout, columns } = await response.json();
      setPlotData(data);
      setPlotLayout(layout);
      setColumns(columns);
      localStorage.setItem("selectedVisualization", visualization);
    } catch (err) {
      console.error("Error fetching Dimplot:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchDimplot(filesId, selectedVisualization);
  }, [filesId, selectedVisualization]);

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Controls */}
      <Paper sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, mb: 2 }}>
        {/* Buttons for Visualization */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {["UMAP", "T-SNE"].map((method) => (
            <Button
              key={method}
              variant={selectedVisualization === method ? "contained" : "outlined"}
              color="primary"
              onClick={() => setSelectedVisualization(method)}
            >
              {method}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Plot Rendering */}
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : plotData && plotLayout ? (
        <Box sx={{ width: "100%", height: "calc(100% - 60px)", overflow: "hidden" }}>
          <Plot
            data={plotData}
            layout={{
              ...plotLayout,
              legend: { ...plotLayout.legend, y: 0.1 },
            }}
            style={{ width: "100%", height: "100%" }}
            config={{ responsive: true }}
            useResizeHandler
          />
        </Box>
      ) : (
        <Typography color="gray">Loading Dimplot...</Typography>
      )}
    </Box>
  );
};

export default Dimplot;
