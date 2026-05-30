import Layout from "../../Components/Layout/Layout";
import "./DashboardStyles/Analytics.css";

const Analytics = () => {
  return (
    <Layout>
      <div className="analytics_page">
        <div className="page_header">
          <h1>Analytics</h1>
          <p>Track your productivity</p>
        </div>

        <div className="analytics_grid">
          <div className="analytics_card">
            <h3>Completion Rate</h3>
            <div className="chart_placeholder">
              <div className="progress_circle">
                <span className="percentage">0%</span>
              </div>
            </div>
          </div>

          <div className="analytics_card">
            <h3>Tasks by Priority</h3>
            <div className="priority_stats">
              <div className="stat_item high">
                <span>High</span>
                <span className="count">0</span>
              </div>
              <div className="stat_item medium">
                <span>Medium</span>
                <span className="count">0</span>
              </div>
              <div className="stat_item low">
                <span>Low</span>
                <span className="count">0</span>
              </div>
            </div>
          </div>

          <div className="analytics_card">
            <h3>Weekly Activity</h3>
            <div className="bar_chart">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="bar_item">
                  <div className="bar" style={{ height: "0px" }}></div>
                  <span>{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
