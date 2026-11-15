import { useCallback, useEffect, useState } from "react";

// Loads the agent plans and resolves the three states of a request: loading, ready and error.
// Every effect run owns a `cancelled` flag: a response from a previous run (reload, a new
// fetchPlans, StrictMode or unmount) is ignored instead of overwriting what is on screen.
export default function usePlans(fetchPlans) {
  const [status, setStatus] = useState("loading");
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setStatus("loading");
    setPlans([]);
    setError(null);

    fetchPlans().then(
      (data) => {
        if (cancelled) return;
        setPlans(data);
        setStatus("ready");
      },
      (err) => {
        if (cancelled) return;
        setError(err);
        setStatus("error");
      }
    );

    return () => {
      cancelled = true;
    };
  }, [fetchPlans, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { status, plans, error, reload };
}
