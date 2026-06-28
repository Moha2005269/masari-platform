import React from 'react';

export const AbstractShape1 = ({ className }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="currentColor" stroke="var(--border-color)" strokeWidth="4" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.6,-46.3C91.4,-33.5,98,-18,97.7,-2.4C97.4,13.2,90.2,28.7,80.3,41.9C70.4,55.1,57.8,66,43.5,73.4C29.2,80.8,13.2,84.7,-2.3,88.7C-17.8,92.7,-35.6,96.8,-49.6,89.5C-63.6,82.2,-73.8,63.5,-81.9,46C-90,28.5,-96,12.2,-95.4,-3.8C-94.8,-19.8,-87.6,-35.5,-77.3,-48.6C-67,-61.7,-53.6,-72.2,-39.3,-79.1C-25,-86,-9.8,-89.3,3.3,-84C16.4,-78.7,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
  </svg>
);

export const AbstractShape2 = ({ className, style }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path fill="currentColor" stroke="var(--border-color)" strokeWidth="4" d="M39.9,-65.7C52.4,-57.4,63.6,-47.5,72.2,-35.3C80.8,-23.1,86.8,-8.6,84.9,5.2C83,19,73.2,32.1,62.8,43.7C52.4,55.3,41.4,65.4,28.5,72.2C15.6,79,0.8,82.5,-13.4,79.9C-27.6,77.3,-41.2,68.6,-52.3,57.4C-63.4,46.2,-72,32.5,-77.7,17.4C-83.4,2.3,-86.2,-14.2,-81,-28.7C-75.8,-43.2,-62.6,-55.7,-48.3,-63.5C-34,-71.3,-18.6,-74.4,-2.8,-69.6C13,-64.8,27.4,-74,39.9,-65.7Z" transform="translate(100 100)" />
  </svg>
);

export const DecorativeStar = ({ className }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="currentColor" stroke="var(--border-color)" strokeWidth="3" d="M50 0 C50 40, 60 50, 100 50 C60 50, 50 60, 50 100 C50 60, 40 50, 0 50 C40 50, 50 40, 50 0 Z" />
  </svg>
);
