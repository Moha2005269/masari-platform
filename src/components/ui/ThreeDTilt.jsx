import React, { useRef, useState } from 'react';

export const ThreeDTilt = ({ children, className = "", intensity = 15 }) => {
  const ref = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setCoords({ x: x * intensity, y: -y * intensity });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${coords.y}deg) rotateY(${coords.x}deg) scale3d(1.03, 1.03, 1.03)` 
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </div>
  );
};
