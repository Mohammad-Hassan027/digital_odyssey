import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const HEX_CHARS = '0123456789ABCDEF';

function generateHexColumn(len) {
  let res = '';
  for (let i = 0; i < len; i++) {
    res += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)] + '\n';
  }
  return res;
}

export default function LoadingOverlay({ onComplete }) {
  const overlayRef = useRef(null);
  const [pct, setPct] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [packets, setPackets] = useState([]);
  const [hexColumns, setHexColumns] = useState([]);

  // 1. Progress Logic - Random Jumps
  useEffect(() => {
    let currentPct = 0;
    const interval = setInterval(() => {
      const jump = Math.floor(Math.random() * 15) + 1;
      currentPct = Math.min(100, currentPct + jump);
      setPct(currentPct);
      
      if (currentPct === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          // Final fade out after connection established message
          setTimeout(() => {
            gsap.to(overlayRef.current, {
              opacity: 0,
              duration: 1,
              ease: 'power4.inOut',
              onComplete: onComplete,
            });
          }, 1500);
        }, 500);
      }
    }, 400 + Math.random() * 600);

    return () => clearInterval(interval);
  }, [onComplete]);

  // 2. Hex Rain Generation
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const count = isMobile ? 10 : 22;
    const cols = Array.from({ length: count }, (_, i) => ({
      id: i,
      content: generateHexColumn(25),
      speed: 10 + Math.random() * 15,
      delay: Math.random() * 5,
    }));
    setHexColumns(cols);
  }, []);

  // 3. Packet Visualization - Simulating traffic
  useEffect(() => {
    if (isDone) return;
    const interval = setInterval(() => {
      const id = Date.now();
      const isFailing = Math.random() < 0.2; // 20% fail rate
      setPackets((prev) => [...prev, { id, isFailing }]);
      
      // Cleanup packets after they move across
      setTimeout(() => {
        setPackets((prev) => prev.filter((p) => p.id !== id));
      }, 2000);
    }, 600);

    return () => clearInterval(interval);
  }, [isDone]);

  return (
    <div ref={overlayRef} className="loader-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center">
      
      {/* Background Hex Rain */}
      <div className="hex-rain-container">
        {hexColumns.map((col) => (
          <div 
            key={col.id} 
            className="hex-column"
            style={{ 
              animationDuration: `${col.speed}s`, 
              animationDelay: `${col.delay}s` 
            }}
          >
            {col.content}
          </div>
        ))}
      </div>

      <div className="loader-inner relative z-10">
        {!isDone ? (
          <>
            <div className="w-full">
              <h2 className="text-[#00ff41] font-['Share_Tech_Mono'] text-sm md:text-base tracking-[0.25em] mb-3 opacity-80 uppercase">
                Data_Stream: Loading_Matrix
              </h2>
              <div className="packet-track mb-10">
                {packets.map((p) => (
                  <div 
                    key={p.id} 
                    className={`packet ${p.isFailing ? 'failing' : ''}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="loader-pct text-[#00ff41] text-7xl md:text-9xl font-black mb-2">
                {pct}%
              </div>
              <p className="text-[#00ff41]/40 font-['Share_Tech_Mono'] text-[0.65rem] tracking-[0.4em] uppercase">
                Connection_Established // Sync_Nodes
              </p>
            </div>
          </>
        ) : (
          <h1 className="conn-established text-3xl md:text-6xl font-black tracking-widest text-center px-6">
            SYSTEM ONLINE
          </h1>
        )}
      </div>

      {/* Industrial CRT flicker effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />
    </div>
  );
}
