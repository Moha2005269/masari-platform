import React, { useRef, useState } from 'react';

export const Magnetic = ({ children, className = "", strength = 0.3 }) => {
  const magneticRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!magneticRef.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = magneticRef.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };
  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <div
      ref={magneticRef} onMouseMove={handleMouse} onMouseLeave={reset}
      className={`inline-block magnetic-target ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.1s linear',
      }}
    >
      {children}
    </div>
  );
};
