
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardContent } from "./DashboardContent";

export const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <DashboardContent />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};
