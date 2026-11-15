import { useCallback, useEffect, useState } from "react";

// Fixed fault 2: the rejection only went to console.error, so a failing request stayed in "loading"
// forever and `error` was never set.
// Fixed fault 3: there was no way to ignore an old response. Each effect run now owns a `cancelled`
// flag that its cleanup sets, so a late answer (reload, a new fetchPlans, StrictMode, unmount) is
// discarded instead of overwriting the newer one.
export default function usePlans(fetchPlans) {
  const [plans, setPlans] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setPlans([]);
    setStatus("loading");
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
