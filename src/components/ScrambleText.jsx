import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCRAMBLE_CHARS = '0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

/**
 * ScrambleText component - Scrambles text on scroll trigger.
 * Resolves left-to-right with progressive timing.
 */
/**
 * Helper to recursively extract flat text from React children
 */
const getTextContent = (children) => {
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(getTextContent).join('');
  if (typeof children === 'object' && children?.props?.children) return getTextContent(children.props.children);
  return '';
};

export default function ScrambleText({ children, className = '', threshold = 'top 85%' }) {
  const elementRef = useRef(null);
  const [displayText, setDisplayText] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const originalText = getTextContent(children);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Set initial state (empty or spaces to maintain layout if needed, but here we just hide)
    setDisplayText(originalText.replace(/./g, '\u00A0')); // NBSP to keep height

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: threshold,
        once: true,
        onEnter: () => startScramble(),
      });
    }, el);

    return () => ctx.revert();
  }, [originalText]);

  const startScramble = () => {
    setIsDecoding(true);
    const textArr = originalText.split('');
    const length = textArr.length;
    let frames = [];

    // Initialize frames for each character
    // Progressively more cycles for later characters
    for (let i = 0; i < length; i++) {
      const baseCycles = 3 + Math.floor(Math.random() * 2);
      // index-based delay factor: earlier characters resolve faster
      const delayFactor = i * 0.5; 
      frames[i] = {
        cyclesRemaining: baseCycles + Math.floor(delayFactor),
        resolved: textArr[i] === ' ',
      };
    }

    let interval;
    const update = () => {
      let currentText = '';
      let allResolved = true;

      for (let i = 0; i < length; i++) {
        const frame = frames[i];
        if (textArr[i] === ' ') {
          currentText += ' ';
          continue;
        }

        if (frame.cyclesRemaining > 0) {
          currentText += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          frame.cyclesRemaining--;
          allResolved = false;
        } else {
          currentText += textArr[i];
        }
      }

      setDisplayText(currentText);

      if (allResolved) {
        clearInterval(interval);
        setIsDecoding(false);
      }
    };

    // Run at ~60fps
    interval = setInterval(update, 40);
  };

  return (
    <p
      ref={elementRef}
      className={`${className} scramble-text ${isDecoding ? 'scramble-decoding' : ''}`}
      style={{ minHeight: '1em' }}
    >
      {displayText}
    </p>
  );
}
