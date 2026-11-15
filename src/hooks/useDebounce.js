import { useEffect, useState } from "react";

// Returns the "quiet" value: the last `value` that spent `delay` ms without changing.
// The timer belongs to the effect that created it, so the cleanup cancels it both when the effect
// repeats (a new value arrived) and when the component unmounts.
export default function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
