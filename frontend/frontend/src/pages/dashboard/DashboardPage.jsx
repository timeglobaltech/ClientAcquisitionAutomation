
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import DashboardMainView from "./DashboardMainView";
import LeadsView from "./LeadsView";
import ScraperView from "./ScraperView";
import AuditView from "./AuditView";
import OutreachView from "./OutreachView";
import CalendarView from "./CalendarView";
import CopilotView from "./CopilotView";
import AnalyticsView from "./AnalyticsView";
import PricingView from "./PricingView";
import SettingsView from "./SettingsView";

export default function DashboardPage() {
  const [view, setView] = useState("main");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderView = () => {
    switch (view) {
      case "main": return <DashboardMainView setView={setView} />;
      case "leads": return <LeadsView setView={setView} />;
      case "scraper": return <ScraperView />;
      case "audit": return <AuditView />;
      case "outreach": return <OutreachView />;
      case "calendar": return <CalendarView />;
      case "copilot": return <CopilotView />;
      case "analytics": return <AnalyticsView />;
      case "pricing": return <PricingView />;
      case "settings": return <SettingsView />;
      default: return <DashboardMainView setView={setView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0E27]">
      <Sidebar 
        view={view} 
        setView={setView} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar view={view} setView={setView} />
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
