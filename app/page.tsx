"use client";

import { useEffect, useState } from "react";
import { categories } from "@/lib/data";

export const runtime = 'edge'

const ConnectionGame = () => {
  const [selectedPairs, setSelectedPairs] = useState<{ word: string; category: string }[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  useEffect(() => {
    const allWords = categories.flatMap((category) =>
      category.words.map((word) => word.word)
    );
    setShuffledWords(shuffleArray(allWords));
  }, []);

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleWordClick = (word: string, category: string) => {
    // Prevent selecting the same word more than once
    const alreadySelected = selectedPairs.some((pair) => pair.word === word);
    if (selectedPairs.length < 4 && !alreadySelected) {
      setSelectedPairs((prev) => [...prev, { word, category }]);

      // Enable submit button when 4 words are selected
      if (selectedPairs.length + 1 === 4) {
        setIsSubmitDisabled(false);
      }
    }
  };

  const handleSubmit = () => {
    let isCorrect = true;

    // Group selected words by their categories
    const groupedByCategory = selectedPairs.reduce((acc, { word, category }) => {
      if (!acc[category]) acc[category] = [];
      acc[category].push(word);
      return acc;
    }, {} as { [category: string]: string[] });

    // Check if the selected words are correct for each category
    for (const category in groupedByCategory) {
      const correctCategory = categories.find((cat) => cat.category === category);
      if (correctCategory) {
        const correctWords = correctCategory.words.map((w) => w.word);
        const selectedWordsForCategory = groupedByCategory[category];

        // Ensure all selected words for a category are valid
        if (!selectedWordsForCategory.every((word) => correctWords.includes(word))) {
          isCorrect = false;
        }
      }
    }

    setFeedback(isCorrect ? "✅ All correct!" : "❌ Some answers are incorrect.");
  };

  const rows = [];
  const wordsPerRow = 5;
  for (let i = 0; i < shuffledWords.length; i += wordsPerRow) {
    rows.push(shuffledWords.slice(i, i + wordsPerRow));
  }

  const handleDeselectAll = () => {
    setSelectedPairs([]);
    setIsSubmitDisabled(true);
    setFeedback(""); // Reset feedback when deselecting
  };

  return (
    <div className="connection-game-container">
      <h1 className="title">Connections Game</h1>

      {/* Display Words in Rows */}
      <div className="words-grid">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="word-row">
            {row.map((word, idx) => {
              // Get category for this word based on its index in the categories array
              const category = categories.find((cat) =>
                cat.words.some((w) => w.word === word)
              )?.category;

              return (
                <button
                  key={idx}
                  onClick={() => handleWordClick(word, category || "")}
                  className={`word-button ${
                    selectedPairs.some((pair) => pair.word === word) ? "selected" : ""
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className={`submit-button ${isSubmitDisabled ? "disabled" : ""}`}
        disabled={isSubmitDisabled}
      >
        Submit
      </button>

      <button onClick={handleDeselectAll} className="deselect-button">
        Deselect All
      </button>

      {/* Feedback */}
      <div>
        <h2>{feedback}</h2>
      </div>

      {/* Selected Words */}
      <div className="selected-words-container">
        <h3>Selected Words:</h3>
        <ul className="selected-list">
          {selectedPairs.map((pair, idx) => (
            <li key={idx}>
              {pair.word} ({pair.category})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConnectionGame;
