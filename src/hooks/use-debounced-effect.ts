
import { useEffect, useRef } from 'react';

/**
 * A custom hook that delays the execution of an effect
 * This is useful for preventing too many API calls or expensive operations
 */
export function useDebouncedEffect(
  effect: () => void | (() => void),
  deps: any[],
  delay: number = 300
) {
  const callback = useRef<() => void | (() => void)>(effect);
  
  useEffect(() => {
    callback.current = effect;
  }, [effect]);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      callback.current();
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [...deps, delay]);
}
