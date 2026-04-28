import { useState } from "react";
import Layout from "@/components/Layout";
import Dashboard from "./Dashboard";
import Stats from "./Stats";
import Monitoring from "./Monitoring";
import Logs from "./Logs";
import Attacks from "./Attacks";
import Settings from "./Settings";
import Cities from "./Cities";
import REE from "./REE";

const pages: Record<string, React.ReactNode> = {
  dashboard: <Dashboard />,
  cities: <Cities />,
  ree: <REE />,
  stats: <Stats />,
  monitoring: <Monitoring />,
  logs: <Logs />,
  attacks: <Attacks />,
  settings: <Settings />,
};

const Index = () => {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {pages[activePage] ?? <Dashboard />}
    </Layout>
  );
};

export default Index;
