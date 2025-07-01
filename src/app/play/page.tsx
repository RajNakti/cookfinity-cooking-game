'use client';

import { useState, useEffect } from 'react';
import { Play, Clock, Users, Star } from 'lucide-react';
import Link from 'next/link';
import { Recipe } from '@/types/recipe';
import SpoonacularAPI from '@/lib/api';

export default function PlayPage() {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedRecipes();
  }, []);

  const loadFeaturedRecipes = async () => {
    try {
      const recipes = await SpoonacularAPI.getRandomRecipes(6);
      setFeaturedRecipes(recipes);
    } catch (error) {
      console.error('Error loading featured recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/uniquelogo.png"
              alt="Cookfinity Logo"
              width={64}
              height={64}
              className="h-16 w-16"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Cooking Challenge
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Select a recipe below and start your virtual cooking adventure. Each recipe is a unique game experience!
          </p>
        </div>
      </section>

      {/* Game Modes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Modes</h2>
            <p className="text-xl text-gray-600">Choose how you want to play</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-6 text-white text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Cook</h3>
              <p className="mb-4">Fast-paced cooking challenges under 15 minutes</p>
              <button className="bg-white text-green-600 font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
                Coming Soon
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 text-white text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <img
                  src="/uniquelogo.png"
                  alt="Cookfinity Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Master Chef</h3>
              <p className="mb-4">Complex recipes for experienced virtual cooks</p>
              <button className="bg-white text-blue-600 font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
                Coming Soon
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-6 text-white text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiplayer</h3>
              <p className="mb-4">Cook together with friends in real-time</p>
              <button className="bg-white text-purple-600 font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Recipes</h2>
            <p className="text-xl text-gray-600">Start with these popular cooking challenges</p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
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
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.readyInMinutes} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href={`/game/${recipe.id}`}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Start Cooking</span>
                      </Link>
                      <Link
                        href={`/recipes/${recipe.id}`}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center block"
                      >
                        View Recipe
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/recipes"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <span>Browse All Recipes</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
