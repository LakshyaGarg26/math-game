// /components/AsteroidField.tsx
import React from 'react';
import Asteroid from './Asteroid';

type AsteroidDrop = {
  equation: string;
  answer: number;
  id: number;
  leftPosition: number;
  blasted: boolean;
};

type AsteroidFieldProps = {
  asteroids: AsteroidDrop[];
  asteroidSize: number;
  gameWidth: number;
  onMissedAsteroid: (asteroidId: number) => void;
};

const AsteroidField: React.FC<AsteroidFieldProps> = ({
  asteroids,
  asteroidSize,
  gameWidth,
  onMissedAsteroid,
}) => {
  return (
    <>
      {asteroids.map((asteroid, index) => (
        <Asteroid
          key={asteroid.id}
          equation={asteroid.equation}
          leftPosition={asteroid.leftPosition}
          delay={index * 0.5}
          blasted={asteroid.blasted}
          asteroidSize={asteroidSize}
          gameWidth={gameWidth}
          onAnimationEnd={() => onMissedAsteroid(asteroid.id)}
        />
      ))}
    </>
  );
};

export default AsteroidField;
