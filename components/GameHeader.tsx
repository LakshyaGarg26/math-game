'use client';

import React from 'react';

type GameHeaderProps = {
  score: number;
  lives: number;
};

const GameHeader: React.FC<GameHeaderProps> = ({ score, lives }) => {
  return (
    <div className="absolute top-4 right-4 text-white text-xl font-bold">
      Score: {score}
      <p>
        Lives: <span className="font-bold">{'⭐'.repeat(lives)}</span>
      </p>
    </div>
  );
};

export default GameHeader;
