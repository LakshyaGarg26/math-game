'use client';

import React, { useState, useEffect, useCallback } from 'react';
import FallingObjectsField from '../../components/FallingObjectsField';
import Keypad from '../../components/Keypad';
import AnswerInput from '../../components/AnswerInput';
import GameHeader from '../../components/GameHeader';
import themes from '../../config/themes';
import { FallingObjectDrop } from '../../types';

const GamePage = () => {
  const [fallingObjects, setFallingObjects] = useState<FallingObjectDrop[]>([]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [dropInterval, setDropInterval] = useState<number>(2500);
  const [gameWidth, setGameWidth] = useState<number>(600);
  const [fallingObjectSize, setFallingObjectSize] = useState<number>(80);
  const selectedTheme = themes; // Default theme (change to themes.forest for a forest theme)

  // Function to calculate and set game width and falling object size based on screen size
  const updateGameDimensions = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 300 && screenWidth <= 500) {
      setGameWidth(screenWidth);
      setFallingObjectSize(60);
    } else if (screenWidth < 900) {
      setGameWidth(500);
      setFallingObjectSize(70);
    } else {
      setGameWidth(700);
      setFallingObjectSize(80);
    }
  };

  useEffect(() => {
    updateGameDimensions();
    window.addEventListener('resize', updateGameDimensions);
    return () => window.removeEventListener('resize', updateGameDimensions);
  }, []);

  // Function to generate random math equations for falling objects
  const generateFallingObject = (): FallingObjectDrop => {
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

    const leftPosition = Math.random() * (gameWidth - fallingObjectSize);
    return { equation, answer, id: Date.now(), leftPosition, blasted: false };
  };

  // Function to drop new falling objects at intervals
  const dropFallingObject = useCallback(() => {
    const newFallingObject = generateFallingObject();
    setFallingObjects((prev) => [...prev, newFallingObject]);
  }, [fallingObjectSize, gameWidth]);

  // Adjust the drop interval based on the player's score
  useEffect(() => {
    const pointsMilestone = Math.floor(score / 2000);
    const newInterval = Math.max(400, 2500 - pointsMilestone * 100);
    setDropInterval(newInterval);
  }, [score]);

  // Blast the falling object when the correct answer is entered
  const blastFallingObject = (fallingObjectId: number) => {
    setFallingObjects((prev) =>
      prev.map((fallingObject) =>
        fallingObject.id === fallingObjectId ? { ...fallingObject, blasted: true } : fallingObject
      )
    );
    setTimeout(() => {
      setFallingObjects((prev) => prev.filter((fallingObject) => fallingObject.id !== fallingObjectId));
    }, 500);
  };

  // Handle when a falling object reaches the bottom without being blasted
  const handleMissedFallingObject = useCallback(
    (fallingObjectId: number) => {
      setFallingObjects((prev) => prev.filter((fallingObject) => fallingObject.id !== fallingObjectId));

      const missedFallingObject = fallingObjects.find(
        (fallingObject) => fallingObject.id === fallingObjectId
      );
      if (missedFallingObject && !missedFallingObject.blasted) {
        if (lives > 1) {
          setLives((prevLives) => prevLives - 1);
        } else {
          setLives(0);
          setGameOver(true);
        }
      }
    },
    [lives, fallingObjects]
  );

  // Handle user input changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
  };

  // Handle keypad input
  const handleKeypadInput = (value: string) => {
    setUserInput((prevInput) => prevInput + value);
  };

  // Handle backspace
  const handleBackspace = () => {
    setUserInput((prevInput) => prevInput.slice(0, -1));
  };

  // Handle form submission
  const handleSubmit = () => {
    const correctFallingObject = fallingObjects.find(
      (fallingObject) => fallingObject.answer === parseInt(userInput)
    );

    if (correctFallingObject) {
      setScore((prevScore) => prevScore + 500);
      blastFallingObject(correctFallingObject.id);
    }
    setUserInput('');
  };

  // Drop new falling objects at regular intervals
  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(dropFallingObject, dropInterval);
      return () => clearInterval(interval);
    }
  }, [dropInterval, gameOver, dropFallingObject]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-start bg-black">
      <div className="w-full flex justify-center h-full">
        <div
          className="relative h-full overflow-hidden border border-black"
          style={{
            width: `${gameWidth}px`,
            backgroundImage: `url(${selectedTheme.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <GameHeader score={score} lives={lives} />

          <FallingObjectsField
            fallingObjects={fallingObjects}
            fallingObjectSize={fallingObjectSize}
            gameWidth={gameWidth}
            onMissedFallingObject={handleMissedFallingObject}
            selectedTheme={selectedTheme}
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
