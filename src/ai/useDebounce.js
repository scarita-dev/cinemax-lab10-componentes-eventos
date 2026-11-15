import { useEffect, useState } from "react";

// Fixed fault 1: the timer used to live in a ref and only the last one was cleared on unmount, so every
// change left the previous timer alive and intermediate values were emitted. The timer now belongs to
// the effect that starts it, and its cleanup cancels it before the effect repeats and on unmount.
export default function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
