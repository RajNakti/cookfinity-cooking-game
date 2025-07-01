'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Clock, Calendar } from 'lucide-react';
import { GameScore, GameDifficulty } from '@/types/game';

// Mock leaderboard data - in a real app, this would come from an API
const mockLeaderboardData: GameScore[] = [
  {
    id: '1',
    playerName: 'ChefMaster2024',
    recipeId: 1,
    recipeName: 'Classic Spaghetti Carbonara',
    score: 9850,
    timeElapsed: 1200,
    accuracy: 98,
    completionRate: 100,
    date: new Date('2024-01-15'),
    difficulty: GameDifficulty.HARD
  },
  {
    id: '2',
    playerName: 'CookingNinja',
    recipeId: 2,
    recipeName: 'Beef Stir Fry',
    score: 9720,
    timeElapsed: 900,
    accuracy: 95,
    completionRate: 100,
    date: new Date('2024-01-14'),
    difficulty: GameDifficulty.MEDIUM
  },
  {
    id: '3',
    playerName: 'KitchenWizard',
    recipeId: 3,
    recipeName: 'Chocolate Chip Cookies',
    score: 9650,
    timeElapsed: 1800,
    accuracy: 92,
    completionRate: 100,
    date: new Date('2024-01-13'),
    difficulty: GameDifficulty.EASY
  },
  {
    id: '4',
    playerName: 'FoodieGamer',
    recipeId: 1,
    recipeName: 'Classic Spaghetti Carbonara',
    score: 9500,
    timeElapsed: 1350,
    accuracy: 90,
    completionRate: 100,
    date: new Date('2024-01-12'),
    difficulty: GameDifficulty.HARD
  },
  {
    id: '5',
    playerName: 'VirtualChef',
    recipeId: 4,
    recipeName: 'Caesar Salad',
    score: 9400,
    timeElapsed: 600,
    accuracy: 94,
    completionRate: 100,
    date: new Date('2024-01-11'),
    difficulty: GameDifficulty.EASY
  }
];

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<GameScore[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all-time');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedDifficulty, timeFilter]);

  const loadLeaderboard = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Get scores from localStorage
      const savedScores = JSON.parse(localStorage.getItem('cookfinity-scores') || '[]');
      let filteredData = [...mockLeaderboardData, ...savedScores];

      if (selectedDifficulty !== 'all') {
        filteredData = filteredData.filter(score => score.difficulty === selectedDifficulty);
      }

      // Sort by score descending
      filteredData.sort((a, b) => b.score - a.score);

      setLeaderboard(filteredData);
      setLoading(false);
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: GameDifficulty) => {
    switch (difficulty) {
      case GameDifficulty.EASY:
        return 'text-green-600 bg-green-100';
      case GameDifficulty.MEDIUM:
        return 'text-yellow-600 bg-yellow-100';
      case GameDifficulty.HARD:
        return 'text-red-600 bg-red-100';
      case GameDifficulty.EXPERT:
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Leaderboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how you stack up against other virtual chefs around the world
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              >
                <option value="all">All Difficulties</option>
                <option value={GameDifficulty.EASY}>Easy</option>
                <option value={GameDifficulty.MEDIUM}>Medium</option>
                <option value={GameDifficulty.HARD}>Hard</option>
                <option value={GameDifficulty.EXPERT}>Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period
              </label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              >
                <option value="all-time">All Time</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="today">Today</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboard.map((score, index) => (
                    <tr key={score.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRankIcon(index + 1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {score.playerName || 'Anonymous Chef'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{score.recipeName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-orange-600">
                          {score.score.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTime(score.timeElapsed)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          {score.accuracy}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(score.difficulty)}`}>
                          {score.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(score.date).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {leaderboard.length === 0 && !loading && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No scores found for the selected filters.</p>
            <p className="text-gray-400">Be the first to set a record!</p>
          </div>
        )}
      </div>
    </div>
  );
}
