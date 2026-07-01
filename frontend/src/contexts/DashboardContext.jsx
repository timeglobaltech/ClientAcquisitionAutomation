import { createContext, useContext, useState, useCallback } from "react";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  // Every time this counter increments, DashboardMainView re-fetches
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshDashboard = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  return (
    <DashboardContext.Provider value={{ refreshKey, refreshDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
