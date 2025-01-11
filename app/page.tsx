/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useState } from "react";
import { categories } from "@/lib/data";

export const runtime = "edge";

const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const homepage = () => {
  const [selectedPairs, setSelectedPairs] = useState<{ word: string; category: string }[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (categories && Array.isArray(categories)) {
      const allWords = categories.flatMap((category) =>
        category.words.map((word) => word.word)
      );
      setShuffledWords(shuffleArray(allWords));
    }
  }, []);

  const handleWordClick = (word: string, category: string) => {
    const alreadySelected = selectedPairs.some((pair) => pair.word === word);
    if (selectedPairs.length < 4 && !alreadySelected) {
      setSelectedPairs((prev) => [...prev, { word, category }]);
      if (selectedPairs.length + 1 === 4) setIsSubmitDisabled(false);
    }
  };

  const handleSubmit = () => {
    let isCorrect = true;
  
    // Extract the category for each selected word
    const selectedCategories = selectedPairs.map((pair) => pair.category);
  
    // Check if all selected words belong to the same category
    const uniqueCategories = [...new Set(selectedCategories)];
    if (uniqueCategories.length !== 1) {
      isCorrect = false; // More than one category detected
    } else {
      // Validate the selected words against the correct words for this single category
      const selectedCategory = uniqueCategories[0];
      const correctCategory = categories.find((cat) => cat.category === selectedCategory);
  
      if (!correctCategory) {
        isCorrect = false; // Invalid category
      } else {
        const correctWords = correctCategory.words.map((w) => w.word);
        const selectedWords = selectedPairs.map((pair) => pair.word);
  
        // Ensure all selected words belong to the correct category
        if (!selectedWords.every((word) => correctWords.includes(word))) {
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
    setFeedback("");
  };

  return (
    <div className="connection-game-container">
      <h1 className="title">Connections Game</h1>
      <div className="words-grid">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="word-row">
            {row.map((word, idx) => {
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
      <div>
        <h2>{feedback}</h2>
      </div>
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

export default homepage;
