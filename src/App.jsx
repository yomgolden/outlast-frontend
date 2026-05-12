import AppRoutes from "./routes/AppRoutes";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <div className="shell">
      <AppRoutes />
      <BottomNav />
    </div>
  );
}
