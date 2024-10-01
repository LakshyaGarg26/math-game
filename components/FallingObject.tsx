import React, { memo } from 'react';

interface FallingObjectProps {
  equation: string;
  leftPosition: number;
  delay: number;
  blasted: boolean;
  fallingObjectSize: number;
  gameWidth: number;
  onAnimationEnd: () => void;
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

const FallingObject: React.FC<FallingObjectProps> = ({
  equation,
  leftPosition,
  delay,
  blasted,
  fallingObjectSize,
  gameWidth,
  onAnimationEnd,
  selectedTheme,
}) => {
  const constrainedLeftPosition = Math.min(
    Math.max(leftPosition, 0),
    gameWidth - fallingObjectSize
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
        width: `${fallingObjectSize}px`,
        height: `${fallingObjectSize}px`,
      }}
      onAnimationEnd={onAnimationEnd}
    >
      <svg
        width={fallingObjectSize}
        height={fallingObjectSize}
        viewBox="0 0 100 100"
        dangerouslySetInnerHTML={{
          __html: selectedTheme.fallingObject.objectSVG(fallingObjectSize),
        }}
      />
      <div
        className="absolute text-center"
        style={{
          fontSize: `${fallingObjectSize / 5}px`,
          width: `${fallingObjectSize}px`,
        }}
      >
        {equation}
      </div>
    </div>
  );
};

export default memo(FallingObject);
