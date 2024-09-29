'use client';

import React, { memo } from 'react';

type AsteroidProps = {
  equation: string;
  leftPosition: number;
  delay: number;
  blasted: boolean;
  onAnimationEnd: (e: React.SyntheticEvent<HTMLElement>) => void;
  asteroidSize: number; // Dynamic size prop for better scaling
  gameWidth: number; // Add game width to confine asteroid within the screen
};

const Asteroid: React.FC<AsteroidProps> = ({
  equation,
  leftPosition,
  delay,
  blasted,
  onAnimationEnd,
  asteroidSize,
  gameWidth,
}) => {
  // Constrain leftPosition to ensure the entire asteroid stays on the screen
  const constrainedLeftPosition = Math.min(
    Math.max(leftPosition, 0), // Ensure it doesn't go left off the screen
    gameWidth - asteroidSize // Ensure it doesn't go right off the screen
  );

  return (
    <div
      className={`absolute flex justify-center items-center text-white font-bold ${
        blasted ? 'blasting' : ''
      }`}
      style={{
        left: `${constrainedLeftPosition}px`,
        top: '-100px', // Start position above the screen
        animation: blasted
          ? `blast 0.5s forwards`
          : `fall 5s linear ${delay}s forwards`,
        width: `${asteroidSize}px`, // Dynamic asteroid size
        height: `${asteroidSize}px`, // Dynamic asteroid size
      }}
      onAnimationEnd={onAnimationEnd}
    >
      <svg
        width={asteroidSize} // Dynamic size
        height={asteroidSize}
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="50" fill="#8B4513" />
        <circle cx="35" cy="35" r="15" fill="#A0522D" />
        <circle cx="65" cy="65" r="12" fill="#A0522D" />
        <circle cx="75" cy="25" r="10" fill="#A0522D" />
      </svg>
      <div
        className="absolute text-center"
        style={{
          fontSize: `${asteroidSize / 5}px`, // Dynamically size the text to fit
          width: `${asteroidSize}px`,
        }}
      >
        {equation}
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(Asteroid);
