'use client';

import { useState, useEffect } from 'react';
import { Search, Clock, Users, Star } from 'lucide-react';
import Link from 'next/link';
import { Recipe } from '@/types/recipe';
import SpoonacularAPI from '@/lib/api';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  useEffect(() => {
    loadRecipes();
  }, [searchQuery, selectedCuisine]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const response = await SpoonacularAPI.searchRecipes({
        query: searchQuery || undefined,
        cuisine: selectedCuisine || undefined,
        number: 12,
      });
      setRecipes(response.results);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const cuisines = [
    'Italian', 'Mexican', 'Chinese', 'Indian', 'French', 'Japanese',
    'Thai', 'Mediterranean', 'American', 'Korean', 'Greek', 'Spanish'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Recipes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from thousands of recipes and start your virtual cooking adventure
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Cuisine Filter */}
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
            >
              <option value="">All Cuisines</option>
              {cuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
            >
              <option value="">All Difficulties</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative h-48">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1 text-sm font-medium flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>{Math.round(recipe.spoonacularScore / 10)}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.readyInMinutes} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                      View Recipe
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {recipes.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No recipes found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
