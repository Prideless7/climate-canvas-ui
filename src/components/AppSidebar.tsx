
import {
  BarChart3,
  CloudRain,
  Sun,
  Thermometer,
  Droplets,
  TrendingUp,
  Database,
  Upload,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Overview",
    icon: BarChart3,
    id: "overview",
  },
  {
    title: "Temperature",
    icon: Thermometer,
    id: "temperature",
  },
  {
    title: "Rainfall",
    icon: CloudRain,
    id: "rainfall",
  },
  {
    title: "Solar Radiation",
    icon: Sun,
    id: "solar",
  },
  {
    title: "Humidity",
    icon: Droplets,
    id: "humidity",
  },
  {
    title: "Trends",
    icon: TrendingUp,
    id: "trends",
  },
];

const dataItems = [
  {
    title: "Data Import",
    icon: Upload,
    id: "import",
  },
  {
    title: "Database",
    icon: Database,
    id: "database",
  },
];

interface AppSidebarProps {
  currentView: string;
  onNavigationChange: (viewId: string) => void;
  isDataImported: boolean;
}

export function AppSidebar({ currentView, onNavigationChange, isDataImported }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-sidebar-foreground">MeteoLytics</h2>
              <p className="text-xs text-sidebar-foreground/70">Weather Analytics</p>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    className={`hover:bg-sidebar-accent ${currentView === item.id ? 'bg-sidebar-accent' : ''} ${!isDataImported && item.id !== 'overview' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => onNavigationChange(item.id)}
                    disabled={!isDataImported && item.id !== 'overview'}
                  >
                    <item.icon className="w-4 h-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Data Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dataItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    className={`hover:bg-sidebar-accent ${currentView === item.id ? 'bg-sidebar-accent' : ''}`}
                    onClick={() => onNavigationChange(item.id)}
                  >
                    <item.icon className="w-4 h-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
