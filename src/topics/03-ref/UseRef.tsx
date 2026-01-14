import { useEffect, useRef, useState } from "react";
import { Link, Navigate, Outlet, Route, Routes } from "react-router-dom";

const UseRefExample = () => {
  return (
    <div style={{ margin: "0 auto", maxWidth: "800px" }}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="stopwatch" replace />} />
          <Route path="stopwatch" element={<Stopwatch />} />
        </Route>
      </Routes>
    </div>
  );
};

export default UseRefExample;

function Layout() {
  return (
    <div>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <Link to="/ref/stopwatch">Stopwatch</Link>
      </nav>
      <Outlet />
    </div>
  );
}

function formatElapsed(ms: number): string {
  ms = Math.max(0, Math.floor(Number(ms) || 0));

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10); // ms/10, 0..99

  const pad2 = (n: number) => String(n).padStart(2, "0");
  return `${pad2(minutes)}:${pad2(seconds)}:${pad2(centiseconds)}`;
}

function Stopwatch() {
  const [time, setTime] = useState(0); // in ms
  const [state, setState] = useState<"idle" | "paused" | "running">("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const start = () => {
    if (intervalRef.current !== null) return;
    setState("running");
    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 10);
    }, 10);
  };

  const resume = () => {
    start();
  };

  const pause = () => {
    setState("paused");
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    setTime(0);
    setState("idle");

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const buttonDict = {
    idle: (
      <button type="button" onClick={start}>
        Start
      </button>
    ),
    paused: (
      <button type="button" onClick={resume}>
        Resume
      </button>
    ),
    running: (
      <button type="button" onClick={pause}>
        Pause
      </button>
    ),
  };

  const btnAction = buttonDict[state];

  const timeFormatted = formatElapsed(time);

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          fontFamily: "monospace",
          marginBottom: "12px",
        }}
      >
        {timeFormatted}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
        }}
      >
        {btnAction}
        <button type="button" onClick={reset} disabled={state === "idle"}>
          Reset
        </button>
      </div>
    </div>
  );
}

