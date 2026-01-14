import { Link, Navigate, Outlet, Route, Routes } from "react-router-dom";
import UseStateExample from "./topics/01-state/UseState";
import UseEffectExample from "./topics/02-effect/UseEffect";

const Layout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ flex: "0 0 200px", background: "#ccc" }}>
        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ padding: "4px" }}>
            <Link to="/state">useState</Link>
          </div>
          <div style={{ padding: "4px" }}>
            <Link to="/effect">useEffect</Link>
          </div>
        </nav>
      </div>
      <div style={{ flex: "1 1 auto" }}>
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/state" replace />} />
        <Route path="state" element={<UseStateExample />} />
        <Route path="effect" element={<UseEffectExample />} />
        <Route path="*" element={<p>Not found</p>} />
      </Route>
    </Routes>
  );
}

export default App;
