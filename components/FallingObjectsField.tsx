import React from 'react';
import FallingObject from './FallingObject';
import { FallingObjectDrop } from '../types'; // Keeping the type but could also rename to FallingObjectDrop

interface FallingObjectsFieldProps {
  fallingObjects: FallingObjectDrop[];
  fallingObjectSize: number;
  gameWidth: number;
  onMissedFallingObject: (id: number) => void;
  selectedTheme: {
    backgroundImage: string;
    fallingObject: {
      type: string;
      objectColor: string;
      subObjectColor: string;
      objectSVG: (size: number) => string;
    };
  };
}

const FallingObjectsField: React.FC<FallingObjectsFieldProps> = ({
  fallingObjects,
  fallingObjectSize,
  gameWidth,
  onMissedFallingObject,
  selectedTheme,
}) => {
  return (
    <>
      {fallingObjects.map((fallingObject, index) => (
        <FallingObject
          key={fallingObject.id}
          equation={fallingObject.equation}
          leftPosition={fallingObject.leftPosition}
          delay={index * 0.5}
          blasted={fallingObject.blasted}
          fallingObjectSize={fallingObjectSize}
          gameWidth={gameWidth}
          onAnimationEnd={() => onMissedFallingObject(fallingObject.id)}
          selectedTheme={selectedTheme}
        />
      ))}
    </>
  );
};

export default FallingObjectsField;
