'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Asteroid from '../../components/Asteroid';

// If you are using GameHeader, import it here (if it's defined elsewhere)
// import GameHeader from './components/GameHeader'; // Uncomment this line if you have a GameHeader component

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
  const [lives, setLives] = useState(3); // Initialize with 3 lives
  const [gameOver, setGameOver] = useState(false); // Game over state
  const [dropInterval, setDropInterval] = useState<number>(2500);
  const [gameWidth, setGameWidth] = useState<number>(600); // Default game width
  const [asteroidSize, setAsteroidSize] = useState<number>(80); // Default asteroid size

  // Function to calculate and set game width and asteroid size based on screen size
  const updateGameDimensions = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 300 && screenWidth <= 500) {
      setGameWidth(screenWidth); // Set the game width to match the screen width for mobile
      setAsteroidSize(60); // Smaller asteroid size for smaller screens
    } else if (screenWidth < 900) {
      setGameWidth(500); // Medium screens like tablets
      setAsteroidSize(70); // Default size for medium screens
    } else {
      setGameWidth(700); // Large screens like desktops
      setAsteroidSize(80); // Larger asteroids for bigger screens
    }
  };

  useEffect(() => {
    // Update game dimensions on load and resize
    updateGameDimensions();
    window.addEventListener('resize', updateGameDimensions);

    return () => window.removeEventListener('resize', updateGameDimensions);
  }, []);

  // Function to generate random math equations
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

  // Function to drop new asteroids
  const dropAsteroid = useCallback(() => {
    const newAsteroid = generateAsteroid();
    setAsteroids((prev) => [...prev, newAsteroid]);
  }, [asteroidSize, gameWidth]);

  // Adjust the dropInterval based on the player's score
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
    }, 500); // Delay to show the blast effect before removal
  };

  // Optimized handleMissedAsteroid function to avoid re-rendering issues
  const handleMissedAsteroid = useCallback(
    (asteroidId: number) => {
      setAsteroids((prev) => prev.filter((asteroid) => asteroid.id !== asteroidId));

      if (lives > 1) {
        setLives((prevLives) => prevLives - 1); // Lose one life
      } else {
        setLives(0); // Lose last life
        setGameOver(true); // Game over
      }
    },
    [lives]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
  };

  // Handle keypad input
  const handleKeypadInput = (value: string) => {
    setUserInput((prevInput) => prevInput + value);
  };

  // Handle backspace button
  const handleBackspace = () => {
    setUserInput((prevInput) => prevInput.slice(0, -1));
  };

  const handleSubmit = () => {
    const correctAsteroid = asteroids.find(
      (asteroid) => asteroid.answer === parseInt(userInput)
    );

    if (correctAsteroid) {
      // If correct, increment the score and blast the asteroid
      setScore((prevScore) => prevScore + 500);
      blastAsteroid(correctAsteroid.id);
    }
    setUserInput(''); // Clear input after submission
  };

  // Drop new asteroids at regular intervals
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
          <div className="absolute top-4 right-4 text-white text-xl font-bold">
            Score: {score}
            <p>
              Lives: <span className="font-bold">{'⭐'.repeat(lives)}</span> {/* Display remaining lives */}
            </p>
          </div>

          {asteroids.map((asteroid, index) => (
            <Asteroid
              key={asteroid.id}
              equation={asteroid.equation}
              leftPosition={asteroid.leftPosition}
              delay={index * 0.5}
              blasted={asteroid.blasted}
              asteroidSize={asteroidSize}
              gameWidth={gameWidth}
              onAnimationEnd={() => handleMissedAsteroid(asteroid.id)}
            />
          ))}

          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center text-white">
              <span className="text-3xl mb-2">Game Over</span>
              <span className="text-6xl font-bold mb-10">Score: {score}</span>
            </div>
          )}
        </div>
      </div>

      {!gameOver && (
        <div className="absolute bottom-80 w-full max-w-md px-4 mb-2">
          <input
            type="text"
            value={userInput}
            onChange={handleInput}
            className="w-full p-4 text-lg text-white bg-transparent border-2 border-white rounded-md placeholder-white text-center"
            placeholder="Enter answer"
            readOnly
          />
        </div>
      )}

      {!gameOver && (
        <div className="absolute bottom-4 w-full max-w-md px-4">
          <div className="grid grid-cols-3 gap-2 bg-black bg-opacity-50 p-4 rounded-lg">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                className="text-white text-xl bg-transparent border border-white py-4 rounded-md"
                onClick={() => handleKeypadInput(num.toString())}
              >
                {num}
              </button>
            ))}
            {/* Backspace, 0, and Submit in one row */}
            <button
              className="col-span-1 text-white text-xl bg-transparent border border-white py-4 rounded-md"
              onClick={handleBackspace}
            >
              Backspace
            </button>
            <button
              className="col-span-1 text-white text-xl bg-transparent border border-white py-4 rounded-md"
              onClick={() => handleKeypadInput('0')}
            >
              0
            </button>
            <button
              className="col-span-1 text-white text-xl bg-transparent border border-white py-4 rounded-md"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Style for animations */}
      <style jsx>{`
        @keyframes fall {
          0% {
            top: -100px; /* Start completely outside the screen */
          }
          100% {
            top: 100%; /* End at the bottom of the container */
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
