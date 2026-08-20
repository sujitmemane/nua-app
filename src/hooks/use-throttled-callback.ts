import { useCallback, useEffect, useRef } from "react";

export function useThrottledCallback(callback:()=>void,interval=800){
    const callbackRef = useRef(callback);
    const lastRan  = useRef(0)
    useEffect(() => {
        callbackRef.current = callback;
      }, [callback]);

    const throttled = useCallback(() => {
        const now = Date.now();
        if(now - lastRan.current < interval) return;
        lastRan.current = now;
        callbackRef.current();
    },[interval])

    return throttled;
    
}