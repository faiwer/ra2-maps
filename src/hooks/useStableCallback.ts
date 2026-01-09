import { useRef, useCallback, useLayoutEffect } from 'react'

export function useStableCallback<Args extends unknown[], Result>(
  callback: (...args: Args) => Result,
): (...args: Args) => Result {
  const callbackRef = useRef<typeof callback>(callback)

  useLayoutEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback((...args: Args) => callbackRef.current(...args), [])
}
