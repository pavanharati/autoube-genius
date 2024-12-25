import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import TopicResearch from "./pages/TopicResearch";
import Scripts from "./pages/Scripts";
import Videos from "./pages/Videos";

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/topics" element={<TopicResearch />} />
          <Route path="/scripts" element={<Scripts />} />
          <Route path="/videos" element={<Videos />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;