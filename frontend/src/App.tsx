import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Playground from "./pages/Playground";
import Labs from "./pages/Labs";
import Setup from "./pages/Setup";

export default function App() {
  return (
    <Router>
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/setup" element={<Setup />} />
          </Routes>
        </main>


      </div>
    </Router>
  );
}
