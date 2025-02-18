import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { useAuth } from "../Auth";
import { Box, Button, Menu, MenuItem, Typography, Paper, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DotPlot = ({ type, filesId }) => {
  const { csrfToken } = useAuth();
  const [plotData, setPlotData] = useState(null);
  const [plotLayout, setPlotLayout] = useState(null);
  const [celltypes, setCellTypes] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(localStorage.getItem("selectedMarker") || "Top 5");
  const [selectedCelltype, setSelectedCelltype] = useState(localStorage.getItem("selectedCelltype") || "Companion_cell");
  const [customGenes, setCustomGenes] = useState(""); // Input for custom genes
  const [markerAnchorEl, setMarkerAnchorEl] = useState(null);
  const [celltypeAnchorEl, setCelltypeAnchorEl] = useState(null);
  const [error, setError] = useState(null);

  const validMarkers = ["Top 5", "Top 10", "Top 25", "Select your own Genes"];

  // API call function
  const fetchDotplot = async (filesId, marker, celltype, selectedGenes = []) => {
    try {
      const response = await fetch("/api/jobs/api/dot_plot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          job_annotate_and_plot_id: filesId,
          marker, 
          celltypes: celltype,
          selected_genes: selectedGenes, 
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Dotplot: ${response.statusText}`);
      }

      const { data, layout, celltypes, not_found_genes } = await response.json();
      setPlotData(data);
      setPlotLayout(layout);
      setCellTypes(celltypes);

      // Handle missing genes and display toast messages
      if (not_found_genes && not_found_genes.length > 0) {
        if (selectedGenes.length === not_found_genes.length) {
          toast.error(`Genes :  ${selectedGenes.join(", ")} are not present in dataset at all, Displaying results for Top 5 markers.`);
          setSelectedMarker("Top 5"); // Automatically switch to "Top 5"
          fetchDotplot(filesId, "Top 5", selectedCelltype, []);
        } else {
          toast.warning(`The following genes were not found: ${not_found_genes.join(", ")}`);
        }
      }
      
    } catch (err) {
      console.error("Error fetching Dotplot:", err);
      setError(err.message);
      toast.error("Error fetching Dotplot. Please try again.");
    }
  };

  // Handle predefined markers
  useEffect(() => {
    if (selectedMarker !== "Select your own Genes") {
      fetchDotplot(filesId, selectedMarker, selectedCelltype, []);
    }
  }, [filesId, selectedCelltype, selectedMarker]);

  // Handle custom gene submission
  const handleCustomGeneSubmit = () => {
    if (!customGenes.trim()) {
      toast.error("Please enter at least one gene name.");
      return;
    }

    const geneList = customGenes.split(/[\n,]+/).map((gene) => gene.trim()).filter(Boolean);

    if (geneList.length === 0) {
      toast.error("Invalid input. Enter gene names separated by commas or new lines.");
      return;
    }

    fetchDotplot(filesId, "Select your own Genes", selectedCelltype, geneList);
  };

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Controls */}
      <Paper sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, mb: 1 }}>
        {/* Markers */}
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>Markers</Typography>
          <Button
            variant="outlined"
            onClick={(event) => setMarkerAnchorEl(event.currentTarget)}
            sx={{ textTransform: "none" }}
          >
            {selectedMarker || "Select Marker"}
          </Button>
          <Menu anchorEl={markerAnchorEl} open={Boolean(markerAnchorEl)} onClose={() => setMarkerAnchorEl(null)}>
            {validMarkers.map((marker) => (
              <MenuItem
                key={marker}
                onClick={() => {
                  setSelectedMarker(marker);
                  setMarkerAnchorEl(null);
                }}
              >
                {marker}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Scplant Annotate Celltypes */}
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>Scplant Annotate Celltypes</Typography>
          <Button
            variant="outlined"
            onClick={(event) => setCelltypeAnchorEl(event.currentTarget)}
            sx={{ textTransform: "none" }}
          >
            {selectedCelltype || "Select Celltype"}
          </Button>
          <Menu anchorEl={celltypeAnchorEl} open={Boolean(celltypeAnchorEl)} onClose={() => setCelltypeAnchorEl(null)}>
            {Array.isArray(celltypes) && celltypes.length > 0 ? (
              celltypes.map((celltype) => (
                <MenuItem
                  key={celltype}
                  onClick={() => {
                    setSelectedCelltype(celltype);
                    setCelltypeAnchorEl(null);
                  }}
                >
                  {celltype}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Celltypes Available</MenuItem>
            )}
          </Menu>
        </Box>
      </Paper>

      {/* Custom Gene Input */}
      {selectedMarker === "Select your own Genes" && (
        <Box>
          <TextField
            label="Enter Gene Names (comma or new line separated)"
            placeholder="Enter genes here..."
            multiline
            fullWidth
            minRows={1}
            maxRows={2}
            value={customGenes}
            onChange={(e) => setCustomGenes(e.target.value)}
            variant="outlined"
          />
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={handleCustomGeneSubmit}
          >
            Submit Genes
          </Button>
        </Box>
      )}

      {/* Plot Rendering */}
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : plotData && plotLayout ? (
        <Box sx={{ width: "100%", height: "calc(100% - 60px)", overflow: "hidden" }}>
          <Plot
            data={plotData}
            layout={{ ...plotLayout, legend: { ...plotLayout.legend, y: 0.1 } }}
            style={{ width: "100%", height: "100%" }}
            config={{ responsive: true }}
            useResizeHandler
          />
        </Box>
      ) : (
        <Typography color="gray">Loading Dotplot...</Typography>
      )}
    </Box>
  );
};

export default DotPlot;
