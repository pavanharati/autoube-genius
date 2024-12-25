import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Lightbulb, FileText, Video, Settings } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Lightbulb, label: "Topic Research", path: "/topics" },
    { icon: FileText, label: "Scripts", path: "/scripts" },
    { icon: Video, label: "Videos", path: "/videos" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`bg-card border-r p-4 flex flex-col gap-4 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
        <div className="flex items-center gap-3 px-3 py-4">
          {!isCollapsed && <h1 className="text-xl font-bold">YT Creator</h1>}
        </div>
        
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              <item.icon className="w-5 h-5" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;