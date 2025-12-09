import { Link, NavLink, useLocation } from "react-router-dom";
import { Network } from "lucide-react";

const linkBase =
  "text-sm sm:text-base text-gray-300 hover:text-white transition-colors";

export default function Navbar() {
  const location = useLocation();

  const mode =
    location.pathname === "/learn"
      ? "Tutorial"
      : location.pathname === "/playground"
      ? "Comparison"
      : "Browse";

  return (
    <nav className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Network className="w-7 h-7 text-blue-400" />
          <span className="text-xl font-bold text-white">Protocol Racer</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <NavLink to="/" className={linkBase}>
            Home
          </NavLink>
          <NavLink to="/learn" className={linkBase}>
            Learn
          </NavLink>
          <NavLink to="/playground" className={linkBase}>
            Playground
          </NavLink>
          <NavLink to="/labs" className={linkBase}>
            Labs
          </NavLink>
          <NavLink to="/setup" className={linkBase}>
            Setup
          </NavLink>

          <div className="hidden sm:flex items-center">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-blue-200 border border-blue-500/40">
              Mode: {mode} · HTTP/2 & HTTP/3
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}