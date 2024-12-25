import { BarChart, TrendingUp, Video, Clock } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { icon: Video, label: "Total Videos", value: "12" },
    { icon: TrendingUp, label: "Views This Month", value: "45.2K" },
    { icon: BarChart, label: "Engagement Rate", value: "8.7%" },
    { icon: Clock, label: "Avg. Watch Time", value: "4:32" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground mt-2">Here's what's happening with your channel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <stat.icon className="w-8 h-8 text-accent" />
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h2 className="text-xl font-semibold mb-4">Recent Videos</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                <div className="w-32 h-20 bg-secondary rounded-md"></div>
                <div>
                  <h3 className="font-medium">Video Title {i + 1}</h3>
                  <p className="text-sm text-muted-foreground">Published 2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <h3 className="font-medium">Trending Topic {i + 1}</h3>
                  <p className="text-sm text-muted-foreground">1.2K searches</p>
                </div>
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;