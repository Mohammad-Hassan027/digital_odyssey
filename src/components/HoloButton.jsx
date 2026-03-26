import { useState, useRef, useEffect } from 'react';
import useMobileDetection from '../hooks/useMobileDetection';

/**
 * HoloButton - A holographic button with 3D tilt, scanlines, and ripple effects.
 */
export default function HoloButton({ children, onClick, className = '', ...props }) {
  const { isMobile } = useMobileDetection();
  const buttonRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Handle ripple effect on click
  const handleClick = (e) => {
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.type.includes('touch') ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = e.type.includes('touch') ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    const rippleId = Date.now();
    
    setRipples((prev) => [...prev, { id: rippleId, x, y }]);
    
    // Auto-cleanup ripples
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 800);

    if (onClick) onClick(e);
  };

  // Handle 3D tilt toward cursor (Disable on mobile for performance)
  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 12;
    const rotateX = ((centerY - e.clientY) / (rect.height / 2)) * 12;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      className={`holo-btn ${className}`}
      onClick={handleClick}
      onTouchStart={isMobile ? handleClick : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isMobile ? 'none' : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        willChange: 'transform, opacity',
      }}
      {...props}
    >
      {/* Holographic scanning / projection overlays */}
      <span className="holo-overlay" aria-hidden="true" />
      <span className="holo-scanline" aria-hidden="true" />
      
      {/* Text layer with chromatic aberration */}
      <span className="holo-text">{children}</span>

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="holo-ripple"
          style={{ left: ripple.x, top: ripple.y }}
          aria-hidden="true"
        />
      ))}
    </button>
  );
}
