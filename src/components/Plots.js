import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { useLocation } from 'react-router-dom';
import Dimplot from "./Dimplot";
import DotPlot from "./Dotplot";
import MinimizedPlot from "./MinimizedPlot";
import { useAuth } from '../Auth';

const Plots = () => {
  const location = useLocation();
  const { user, csrfToken } = useAuth();
  const { type, filesId } = location.state || {};
  
  const storedActivePlot = localStorage.getItem("activePlot") || "DotPlot";
  const [activePlot, setActivePlot] = useState(storedActivePlot);

  useEffect(() => {
    localStorage.setItem("activePlot", activePlot);
  }, [activePlot]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Container
        sx={{
          pt: { xs: 8, sm: 16 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 2, sm: 6 },
        }}
      >
        <Typography component="h2" variant="h4">
          Plots
        </Typography>
        
      </Container>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, height: "90vh" }}>
        {/* Enlarged Plot Section */}
        <Paper
          elevation={3}
          sx={{
            flex: 7,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            p: 2,
            overflow: "hidden",
            backgroundColor: "white",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, p: 1, backgroundColor: "grey.200", borderRadius: 1 }}>
            {activePlot}
          </Typography>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {activePlot === "Dimplot" && <Dimplot type={type} filesId={filesId} />}
            {activePlot === "DotPlot" && <DotPlot type={type} filesId={filesId} />}
          </Box>
        </Paper>

        {/* Small Plots Section */}
        <Paper
          elevation={3}
          sx={{
            flex: 3,
            display: "flex",
            flexDirection: "column",
            borderLeft: "1px solid",
            borderColor: "grey.300",
            p: 2,
            overflow: "hidden",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Other Plots
          </Typography>
          <Box sx={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ height: "35vh", cursor: "pointer" }} onClick={() => setActivePlot("Dimplot")}>
              <MinimizedPlot plotType="dimplot" title="DimPlot" type={type} filesId={filesId} />
            </Box>
            <Box sx={{ height: "35vh", cursor: "pointer" }} onClick={() => setActivePlot("DotPlot")}>
              <MinimizedPlot plotType="dotplot" title="DotPlot" type={type} filesId={filesId} />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Plots;
