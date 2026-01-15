import { Link, Navigate, Outlet, Route, Routes } from "react-router-dom";

const UseCallbackExample = () => {
  return (
    <div style={{ margin: "0 auto", maxWidth: "600px" }}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="base" replace />} />
          <Route path="base" element={<Base />} />
          <Route path="*" element={<p>Not found</p>} />
        </Route>
      </Routes>
    </div>
  );
};

export default UseCallbackExample;

function Layout() {
  return (
    <div style={{ margin: "0 auto", maxWidth: "600px" }}>
      <nav
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "16px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Link to="/state/base">Base</Link>
      </nav>
      <Outlet />
    </div>
  );
}

function Base() {
  return <h1>Base UseCallback</h1>;
}
