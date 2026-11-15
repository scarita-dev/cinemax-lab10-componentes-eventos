import { useCallback, useEffect, useRef, useState } from "react";

const IDLE = { status: "idle", plan: null, result: null, error: null };

// State machine of one agent run. All hooks run on every render: the "runAgent may be missing" case is
// handled inside start(), never with an early return before the hooks.
export default function useAgentRun(runAgent) {
  const [run, setRun] = useState(IDLE);
  const latest = useRef(IDLE);
  const controller = useRef(null);

  const update = useCallback((next) => {
    latest.current = next;
    setRun(next);
  }, []);

  // The cleanup of this effect is what runs on unmount: it aborts the run in flight, so its late
  // response can never touch the state of a component that no longer exists.
  useEffect(() => {
    return () => {
      controller.current?.abort();
    };
  }, []);

  const start = useCallback(
    (plan) => {
      if (!runAgent) return;

      const { status } = latest.current;
      if (status === "running" || status === "awaiting_approval") return;

      const current = new AbortController();
      controller.current = current;
      update({ status: "running", plan, result: null, error: null });

      runAgent(plan, { signal: current.signal }).then(
        (result) => {
          if (current.signal.aborted) return;
          // Safety rule: a destructive plan never goes from running to done on its own.
          update({
            status: plan.risk === "R2" ? "awaiting_approval" : "done",
            plan,
            result,
            error: null,
          });
        },
        (error) => {
          if (current.signal.aborted) return;
          update({ status: "error", plan, result: null, error });
        }
      );
    },
    [runAgent, update]
  );

  const approve = useCallback(() => {
    if (latest.current.status !== "awaiting_approval") return;
    update({ ...latest.current, status: "done" });
  }, [update]);

  const reject = useCallback(() => {
    const { status } = latest.current;
    if (status !== "running" && status !== "awaiting_approval") return;
    controller.current?.abort();
    update(IDLE);
  }, [update]);

  return { ...run, start, approve, reject };
}
