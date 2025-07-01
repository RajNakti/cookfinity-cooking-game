'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RotateCcw, Trophy, Clock, Star } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import SpoonacularAPI from '@/lib/api';
import CookingGame from '@/components/CookingGame';

interface GamePageClientProps {
  params: { id: string };
}

export default function GamePageClient({ params }: GamePageClientProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    if (params.id) {
      loadRecipe(parseInt(params.id as string));
    }
  }, [params.id]);

  const loadRecipe = async (id: number) => {
    try {
      setLoading(true);
      const recipeData = await SpoonacularAPI.getRecipeById(id);
      setRecipe(recipeData);
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameStart = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setScore(0);
    setTimeElapsed(0);
  };

  const handleGameComplete = (finalScore: number, finalTime: number) => {
    setScore(finalScore);
    setTimeElapsed(finalTime);
    setGameCompleted(true);
    setGameStarted(false);
    
    // Save score to localStorage (in a real app, this would go to a backend)
    const gameScore = {
      id: Date.now().toString(),
      playerName: playerName || 'Anonymous Chef',
      recipeId: recipe?.id,
      recipeName: recipe?.title,
      score: finalScore,
      timeElapsed: finalTime,
      accuracy: Math.round((finalScore / 10000) * 100),
      completionRate: 100,
      date: new Date(),
      difficulty: 'medium'
    };
    
    const existingScores = JSON.parse(localStorage.getItem('cookfinity-scores') || '[]');
    existingScores.push(gameScore);
    localStorage.setItem('cookfinity-scores', JSON.stringify(existingScores));
  };

  const handleRestart = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setScore(0);
    setTimeElapsed(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your cooking challenge...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Recipe Not Found</h1>
          <Link
            href="/play"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Play</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Game Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/play"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-white font-bold text-lg">{recipe.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.readyInMinutes} min</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>{Math.round(recipe.spoonacularScore / 10)}/10</span>
                </span>
              </div>
            </div>
          </div>
          
          {gameStarted && (
            <div className="flex items-center space-x-6 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{score}</div>
                <div className="text-xs text-gray-400">SCORE</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-400">TIME</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game Content */}
      {!gameStarted && !gameCompleted && (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="mb-6">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Cook?</h2>
              <p className="text-gray-400">
                Follow the steps and drag ingredients to cook {recipe.title}
              </p>
            </div>
            
            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter your chef name (optional)"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none placeholder-gray-400"
              />
            </div>
            
            <button
              onClick={handleGameStart}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Start Cooking</span>
            </button>
          </div>
        </div>
      )}

      {gameStarted && (
        <CookingGame
          recipe={recipe}
          onComplete={handleGameComplete}
          onScoreUpdate={setScore}
          onTimeUpdate={setTimeElapsed}
        />
      )}

      {gameCompleted && (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Congratulations!</h2>
            <p className="text-gray-400 mb-6">You&apos;ve successfully cooked {recipe.title}!</p>
            
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-400">{score}</div>
                  <div className="text-sm text-gray-400">Final Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-400">Time</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Play Again</span>
              </button>
              
              <Link
                href="/leaderboard"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Trophy className="h-4 w-4" />
                <span>View Leaderboard</span>
              </Link>
              
              <Link
                href="/play"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Choose Another Recipe
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
