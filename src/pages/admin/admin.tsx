// src/pages/Page.tsx

import React, { useState } from "react";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { DashboardContent } from "src/layouts/dashboard";

import VisaoGeralComponent from "./components/VisaoGeralComponent";
import GenerateDailyReport from "./components/generateDailyReport";
import FluxoCaixaMensalComponent from "./components/FluxoCaixaMensalComponent";
import FluxoCaixaDiarioComponent from "./components/FluxoCaixaDiarioComponent";

export default function Page() {
  // Estado para controlar a aba selecionada
  const [selectedTab, setSelectedTab] = useState<number>(0);

  // Função para lidar com a mudança de aba
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography variant="h4">Balanço</Typography>
        <GenerateDailyReport />
      </Grid>

      {/* Abas de Navegação */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleChange} aria-label="fluxo de caixa tabs">
          <Tab label="Visão Geral" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Mensal" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Diário" id="tab-1" aria-controls="tabpanel-2" />
        </Tabs>
      </Box>

      {/* Conteúdo das Abas */}
      <TabPanel value={selectedTab} index={1}>
        <FluxoCaixaMensalComponent />
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <FluxoCaixaDiarioComponent />
      </TabPanel>
      <TabPanel value={selectedTab} index={0}>
        <VisaoGeralComponent />
      </TabPanel>
    </DashboardContent>
  );
}

/**
 * Componente TabPanel para renderizar o conteúdo das abas.
 * @param props 
 * @returns 
 */
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}
