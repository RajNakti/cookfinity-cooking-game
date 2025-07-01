'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Users, Star, Play, ArrowLeft, ChefHat } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import SpoonacularAPI from '@/lib/api';

interface RecipeDetailClientProps {
  params: { id: string };
}

export default function RecipeDetailClient({ params }: RecipeDetailClientProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      setError('Failed to load recipe');
      console.error('Error loading recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Recipe Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || "The recipe you're looking for doesn't exist."}
            </p>
            <Link
              href="/recipes"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Recipes</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/recipes"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-500 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Recipes</span>
        </Link>

        {/* Recipe Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{recipe.title}</h1>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.readyInMinutes} minutes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{Math.round(recipe.spoonacularScore / 10)}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href={`/game/${recipe.id}`}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Play className="h-5 w-5" />
            <span>Start Cooking Game</span>
          </Link>
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-lg transition-colors duration-200">
            Save Recipe
          </button>
        </div>

        {/* Recipe Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.extendedIngredients.map((ingredient, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img
                      src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                      alt={ingredient.name}
                      className="w-8 h-8 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-ingredient.png';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{ingredient.original}</div>
                    <div className="text-sm text-gray-600">{ingredient.name}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
            {recipe.analyzedInstructions.length > 0 ? (
              <ol className="space-y-4">
                {recipe.analyzedInstructions[0].steps.map((step, index) => (
                  <li key={index} className="flex space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">{step.step}</p>
                      {step.length && (
                        <p className="text-sm text-gray-500 mt-1">
                          Time: {step.length.number} {step.length.unit}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="text-gray-600">
                <p>{recipe.instructions || 'Instructions will be provided in the cooking game.'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recipe Summary */}
        {recipe.summary && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Recipe</h2>
            <div 
              className="text-gray-700 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: recipe.summary }}
            />
          </div>
        )}

        {/* Cuisines and Diet Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe Info</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {recipe.cuisines.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cuisines</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.cuisines.map((cuisine, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {recipe.diets.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Dietary</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.diets.map((diet, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                    >
                      {diet}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
