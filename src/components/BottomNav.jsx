import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/", icon: "⚡", label: "Home" },
  { path: "/events", icon: "🎯", label: "Events" },
  { path: "/leaderboard", icon: "🏆", label: "Ranks" },
  { path: "/profile", icon: "💀", label: "Profile" }
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const hideNav = ["/queue", "/match", "/results"];

  if (hideNav.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(item => (
        <div
          key={item.path}
          className={`nav-item ${
            location.pathname === item.path ? "active" : ""
          }`}
          onClick={() => navigate(item.path)}
        >
          <div>{item.icon}</div>
          <div>{item.label}</div>
        </div>
      ))}
    </nav>
  );
}
