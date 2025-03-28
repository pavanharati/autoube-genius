
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Lightbulb, FileText, Video, Settings, Menu, X, TrendingUp, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Lightbulb, label: "Topic Research", path: "/topics" },
    { icon: TrendingUp, label: "Trending Topics", path: "/trending" },
    { icon: FileText, label: "Scripts", path: "/scripts" },
    { icon: Video, label: "Videos", path: "/videos" },
    { icon: Upload, label: "Publish", path: "/publish" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className={`bg-card border-r p-4 hidden md:flex flex-col gap-4 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
        <div className="flex items-center gap-3 px-3 py-4 border-b mb-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" />
              <h1 className="text-xl font-bold">FacelessTube</h1>
            </div>
          )}
          {isCollapsed && <Sparkles className="h-6 w-6 text-accent mx-auto" />}
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
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

        <div className="mt-auto">
          {!isCollapsed && (
            <div className="px-3 py-4 bg-accent/10 rounded-lg">
              <h3 className="font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                Pro Tips
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Create daily content with AI and grow your audience faster.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-10">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-accent" />
                <h1 className="text-xl font-bold">FacelessTube</h1>
              </div>
            </div>
            
            <nav className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto p-4">
              <div className="px-3 py-4 bg-accent/10 rounded-lg">
                <h3 className="font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Pro Tips
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Create daily content with AI and grow your audience faster.
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
