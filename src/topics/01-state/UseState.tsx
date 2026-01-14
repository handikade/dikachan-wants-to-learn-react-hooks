import { useState } from "react";

const UseStateSimple = () => {
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
};

const UseStateObjectAndInput = () => {
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
};

type ActionType = "increment" | "decrement";

const UseStateWithUndoRedo = () => {
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
};

const UseStateExample = () => {
  return (
    <div style={{ margin: "0 auto", maxWidth: "600px" }}>
      <UseStateSimple />
      <hr />
      <UseStateObjectAndInput />
      <hr />
      <UseStateWithUndoRedo />
    </div>
  );
};

export default UseStateExample;
