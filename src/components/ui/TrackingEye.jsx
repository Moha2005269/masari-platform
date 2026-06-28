import React, { useRef, useState, useEffect } from 'react';

export const TrackingEye = ({ mouseX, mouseY, isOpen = true, className = "" }) => {
  const eyeRef = useRef(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(blinkInterval);
  }, [isOpen]);

  useEffect(() => {
    if (!eyeRef.current || !isOpen || isBlinking) return;
    const rect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    const dx = mouseX - eyeCenterX;
    const dy = mouseY - eyeCenterY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(rect.width / 4, Math.hypot(dx, dy) / 8); 
    setPupilPos({ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance });
  }, [mouseX, mouseY, isOpen, isBlinking]);

  return (
    <div ref={eyeRef} className={`relative w-20 h-20 bg-white rounded-full border-4 border-theme flex items-center justify-center overflow-hidden transition-all duration-300 shadow-brutal ${className}`}>
      {isOpen && !isBlinking ? (
        <div 
          className="w-8 h-8 bg-black rounded-full transition-transform duration-75 ease-out flex items-center justify-center"
          style={{ transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)` }}
        >
          <div className="w-3 h-3 bg-white rounded-full absolute top-1.5 left-1.5"></div>
        </div>
      ) : (
        <div className="w-full h-1.5 bg-black rounded-full absolute"></div>
      )}
    </div>
  );
};
