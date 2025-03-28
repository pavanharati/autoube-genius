
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import TopicResearch from "./pages/TopicResearch";
import Scripts from "./pages/Scripts";
import Videos from "./pages/Videos";
import Trending from "./pages/Trending";
import Settings from "./pages/Settings";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/topics" element={<TopicResearch />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/scripts" element={<Scripts />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </DashboardLayout>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
