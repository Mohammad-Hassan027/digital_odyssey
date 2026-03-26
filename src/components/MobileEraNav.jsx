import { useState } from 'react';
import useMobileDetection from '../hooks/useMobileDetection';

const ERAS = [
  { id: 'portal', label: 'Start', year: 'Home' },
  { id: 'spark', label: 'Spark', year: '1969' },
  { id: 'boom', label: 'Boom', year: '1995' },
  { id: 'social', label: 'Social', year: '2004' },
  { id: 'mobile', label: 'Shift', year: '2012' },
  { id: 'future', label: 'Future', year: '∞' },
];

/**
 * MobileEraNav - Floating menu for era jumping on mobile.
 */
export default function MobileEraNav() {
  const { isMobile } = useMobileDetection();
  const [isOpen, setIsOpen] = useState(false);

  if (!isMobile) return null;

  const scrollToEra = (id) => {
    const el = document.getElementById(id);
    if (id === 'portal') {
       window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1001] pointer-events-none">
      {/* Menu Drawer */}
      <div 
        className={`absolute bottom-16 right-0 transition-all duration-400 ease-out flex flex-col gap-3 pointer-events-auto ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}
      >
        {ERAS.map((era) => (
          <button
            key={era.id}
            onClick={() => scrollToEra(era.id)}
            className="mobile-era-btn flex items-center justify-between gap-4 px-6 py-3 bg-[#0a0a0a]/90 backdrop-blur-md border border-[#00ff41]/30 rounded-full text-[#00ff41] font-['Share_Tech_Mono'] text-xs whitespace-nowrap"
          >
             <span>{era.year}</span>
             <span className="font-bold">{era.label}</span>
          </button>
        ))}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-[#00ff41] pointer-events-auto transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)] ${isOpen ? 'bg-[#00ff41] text-black rotate-45' : 'bg-black text-[#00ff41]'}`}
        aria-label="Toggle navigation menu"
      >
        <div className="relative w-6 h-6">
          <span className={`absolute bg-current w-full h-0.5 left-0 top-1/2 -translate-y-1/2 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          <span className="absolute bg-current w-full h-0.5 left-0 top-1/2 -translate-y-1/2" />
        </div>
      </button>
    </div>
  );
}
