'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Asteroid from '../../components/Asteroid';
import Keypad from '../../components/Keypad';
import AnswerInput from '../../components/AnswerInput';
import GameHeader from '../../components/GameHeader';
import AsteroidField from '../../components/AsteroidField';

type AsteroidDrop = {
  equation: string;
  answer: number;
  id: number;
  leftPosition: number;
  blasted: boolean;
};

const GamePage = () => {
  const [asteroids, setAsteroids] = useState<AsteroidDrop[]>([]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [dropInterval, setDropInterval] = useState<number>(2500);
  const [gameWidth, setGameWidth] = useState<number>(600);
  const [asteroidSize, setAsteroidSize] = useState<number>(80);

  // Function to calculate and set game width and asteroid size based on screen size
  const updateGameDimensions = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 300 && screenWidth <= 500) {
      setGameWidth(screenWidth);
      setAsteroidSize(60);
    } else if (screenWidth < 900) {
      setGameWidth(500);
      setAsteroidSize(70);
    } else {
      setGameWidth(700);
      setAsteroidSize(80);
    }
  };

  useEffect(() => {
    updateGameDimensions();
    window.addEventListener('resize', updateGameDimensions);

    return () => window.removeEventListener('resize', updateGameDimensions);
  }, []);

  const generateAsteroid = (): AsteroidDrop => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '*', '/'];
    const selectedOperation = operations[Math.floor(Math.random() * operations.length)];

    let equation = '';
    let answer = 0;

    switch (selectedOperation) {
      case '+':
        equation = `${num1} + ${num2}`;
        answer = num1 + num2;
        break;
      case '-':
        const [larger, smaller] = [Math.max(num1, num2), Math.min(num1, num2)];
        equation = `${larger} - ${smaller}`;
        answer = larger - smaller;
        break;
      case '*':
        equation = `${num1} X ${num2}`;
        answer = num1 * num2;
        break;
      case '/':
        const quotient = Math.floor(Math.random() * 20) + 1;
        const divisor = Math.floor(Math.random() * 20) + 1;
        const dividend = quotient * divisor;
        equation = `${dividend} / ${divisor}`;
        answer = quotient;
        break;
      default:
        break;
    }

    const leftPosition = Math.random() * (gameWidth - asteroidSize);
    return { equation, answer, id: Date.now(), leftPosition, blasted: false };
  };

  const dropAsteroid = useCallback(() => {
    const newAsteroid = generateAsteroid();
    setAsteroids((prev) => [...prev, newAsteroid]);
  }, [asteroidSize, gameWidth]);

  useEffect(() => {
    const pointsMilestone = Math.floor(score / 2000);
    const newInterval = Math.max(400, 2500 - pointsMilestone * 100);
    setDropInterval(newInterval);
  }, [score]);

  // Blast the asteroid when the correct answer is entered
  const blastAsteroid = (asteroidId: number) => {
    setAsteroids((prev) =>
      prev.map((asteroid) =>
        asteroid.id === asteroidId ? { ...asteroid, blasted: true } : asteroid
      )
    );
    setTimeout(() => {
      setAsteroids((prev) => prev.filter((asteroid) => asteroid.id !== asteroidId));
    }, 500); // Delay to remove after showing blast effect
  };

  // Only decrement lives if the asteroid hasn't been blasted
  const handleMissedAsteroid = useCallback(
    (asteroidId: number) => {
      const missedAsteroid = asteroids.find((asteroid) => asteroid.id === asteroidId);
      if (missedAsteroid && !missedAsteroid.blasted) {
        // Remove the asteroid from the list
        setAsteroids((prev) => prev.filter((asteroid) => asteroid.id !== asteroidId));

        // Decrease lives if asteroid is missed
        if (lives > 1) {
          setLives((prevLives) => prevLives - 1);
        } else {
          setLives(0);
          setGameOver(true);
        }
      }
    },
    [lives, asteroids]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
  };

  const handleKeypadInput = (value: string) => {
    setUserInput((prevInput) => prevInput + value);
  };

  const handleBackspace = () => {
    setUserInput((prevInput) => prevInput.slice(0, -1));
  };

  const handleSubmit = () => {
    const correctAsteroid = asteroids.find(
      (asteroid) => asteroid.answer === parseInt(userInput)
    );

    if (correctAsteroid) {
      setScore((prevScore) => prevScore + 500);
      blastAsteroid(correctAsteroid.id);
    }
    setUserInput('');
  };

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(dropAsteroid, dropInterval);
      return () => clearInterval(interval);
    }
  }, [dropInterval, gameOver, dropAsteroid]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-start bg-black">
      <div className="w-full flex justify-center h-full">
        <div
          className="relative h-full overflow-hidden border border-black"
          style={{
            width: `${gameWidth}px`,
            backgroundImage: `url("/images/space-theme.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <GameHeader score={score} lives={lives} />

          <AsteroidField
            asteroids={asteroids}
            asteroidSize={asteroidSize}
            gameWidth={gameWidth}
            onMissedAsteroid={handleMissedAsteroid}
          />

          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center text-white">
              <span className="text-3xl mb-2">Game Over</span>
              <span className="text-6xl font-bold mb-10">Score: {score}</span>
            </div>
          )}
        </div>
      </div>

      {!gameOver && (
        <>
          <AnswerInput userInput={userInput} onChange={handleInput} />
          <Keypad
            onInput={handleKeypadInput}
            onSubmit={handleSubmit}
            onBackspace={handleBackspace}
          />
        </>
      )}

      {/* Style for animations */}
      <style jsx>{`
        @keyframes fall {
          0% {
            top: -100px;
          }
          100% {
            top: 100%;
          }
        }

        @keyframes blast {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default GamePage;
