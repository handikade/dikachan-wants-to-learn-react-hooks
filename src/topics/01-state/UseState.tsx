import { useState } from "react";
import { Link, Navigate, Outlet, Route, Routes } from "react-router-dom";

const UseStateExample = () => {
  return (
    <div style={{ margin: "0 auto", maxWidth: "600px" }}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="simple" replace />} />
          <Route path="simple" element={<UseStateSimple />} />
          <Route
            path="with-object-and-input"
            element={<UseStateObjectAndInput />}
          />
          <Route path="with-undo-redo" element={<UseStateWithUndoRedo />} />
          <Route path="*" element={<p>Not found</p>} />
        </Route>
      </Routes>
    </div>
  );
};

export default UseStateExample;

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
        <Link to="/state/simple">Simple</Link>
        <Link to="/state/with-object-and-input">Object + Input</Link>
        <Link to="/state/with-undo-redo">Undo/Redo</Link>
      </nav>
      <Outlet />
    </div>
  );
}

function UseStateSimple() {
  const [count, setCount] = useState(0);
  const title = "Simple useState";
  return (
    <>
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      <h2 style={{ textAlign: "center", color: "red" }}>Count: {count}</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          Increment
        </button>
        <button type="button" onClick={() => setCount((c) => c - 1)}>
          Decrement
        </button>
      </div>
    </>
  );
}

function UseStateObjectAndInput() {
  const [profile, setProfile] = useState({ name: "", age: 0 });
  const title = "useState With Object and Input";

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((p) => ({ ...p, name: event.target.value }));
  };

  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((p) => {
      const rawAge = event.target.valueAsNumber;
      const age = isNaN(rawAge) ? 0 : rawAge;
      return { ...p, age };
    });
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        <pre style={{ gridColumn: "1/3" }}>
          {JSON.stringify(profile, null, 2)}
        </pre>
        <div>
          <label htmlFor="name">Name</label>
          <br />
          <input
            id="name"
            type="text"
            value={profile.name}
            onChange={handleProfileChange}
          />
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <br />
          <input
            id="age"
            type="number"
            value={profile.age}
            onChange={handleAgeChange}
          />
        </div>
      </div>
    </>
  );
}

type ActionType = "increment" | "decrement";

function UseStateWithUndoRedo() {
  const [count, setCount] = useState(0);
  const [undoStack, setUndoStack] = useState<Array<ActionType>>([]);
  const [redoStack, setRedoStack] = useState<Array<ActionType>>([]);

  const increment = () => {
    setCount((c) => c + 1);
  };

  const decrement = () => {
    setCount((c) => c - 1);
  };

  const undo = () => {
    if (undoStack.length === 0) return;

    const _undoStack = [...undoStack];
    const lastAction = _undoStack.pop() as ActionType;

    if (lastAction === "decrement") {
      increment();
    } else {
      decrement();
    }

    setUndoStack(() => [..._undoStack]);
    setRedoStack((st) => [...st, lastAction]);
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const _redoStack = [...redoStack];
    const lastAction = _redoStack.pop() as ActionType;

    if (lastAction === "decrement") {
      decrement();
    } else {
      increment();
    }

    setRedoStack(() => [..._redoStack]);
    setUndoStack((st) => [...st, lastAction]);
  };

  const handleAction = (actionType: ActionType) => {
    if (actionType === "increment") {
      increment();
    } else if (actionType === "decrement") {
      decrement();
    }

    setUndoStack((p) => [...p, actionType]);
    setRedoStack([]);
  };

  const title = "useState with Undo & Redo";

  return (
    <>
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      <h2 style={{ textAlign: "center", color: "red" }}>Count: {count}</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button type="button" onClick={() => handleAction("increment")}>
          Increment
        </button>
        <button type="button" onClick={() => handleAction("decrement")}>
          Decrement
        </button>
        <button type="button" onClick={undo} disabled={undoStack.length <= 0}>
          Undo ({undoStack.length})
        </button>
        <button type="button" onClick={redo} disabled={redoStack.length <= 0}>
          Redo ({redoStack.length})
        </button>
      </div>
    </>
  );
}
