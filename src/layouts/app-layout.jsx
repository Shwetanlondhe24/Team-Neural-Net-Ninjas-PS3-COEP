import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      <footer className="p-6 bg-gray-800 text-white mt-10 flex justify-center space-x-10 text-sm">
        <span>🚀 Built for Hack Matrix Hackathon</span>
        <a href="mailto:hackteam@example.com" className="hover:underline">📩 Team Neural Net Ninjas</a>
        {/* <a href="https://linkedin.com/in/team-hackathon" target="_blank" rel="noopener noreferrer" className="hover:underline">🔗 LinkedIn</a> */}
        <a href="https://github.com/hackathon-team" target="_blank" rel="noopener noreferrer" className="hover:underline">💻 GitHub</a>
      </footer>
    </div>
  );
};

export default AppLayout;
