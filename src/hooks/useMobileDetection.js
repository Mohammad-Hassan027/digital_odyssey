import { useState, useEffect } from 'react';

/**
 * useMobileDetection Hook
 * Centralized detection and performance throttling for mobile/low-power devices.
 */
export default function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1024px)');
    const lowPowerMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const onChange = () => {
      setIsMobile(mql.matches);
      setIsLowPower(lowPowerMql.matches);
    };

    onChange();
    mql.addEventListener('change', onChange);
    lowPowerMql.addEventListener('change', onChange);

    return () => {
      mql.removeEventListener('change', onChange);
      lowPowerMql.removeEventListener('change', onChange);
    };
  }, []);

  return {
    isMobile,
    isLowPower,
    // Dynamic particle reduction factor
    particleFactor: isMobile ? 0.4 : 1.0,
    // Target frame rate logic (throttling hint)
    targetFPS: isMobile ? 30 : 60,
  };
}
