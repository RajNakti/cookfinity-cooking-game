import axios from 'axios';
import { Recipe, RecipeSearchParams, RecipeSearchResponse } from '@/types/recipe';

const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';
const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

if (!API_KEY) {
  console.warn('Spoonacular API key not found. Using mock data.');
}

const api = axios.create({
  baseURL: SPOONACULAR_BASE_URL,
  params: {
    apiKey: API_KEY,
  },
});

export class SpoonacularAPI {
  static async searchRecipes(params: RecipeSearchParams): Promise<RecipeSearchResponse> {
    try {
      if (!API_KEY) {
        return this.getMockSearchResults(params);
      }

      const response = await api.get('/complexSearch', {
        params: {
          ...params,
          addRecipeInformation: true,
          fillIngredients: true,
          number: params.number || 12,
          offset: params.offset || 0,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error searching recipes:', error);
      return this.getMockSearchResults(params);
    }
  }

  static async getRecipeById(id: number): Promise<Recipe> {
    try {
      if (!API_KEY) {
        return this.getMockRecipe(id);
      }

      const response = await api.get(`/${id}/information`, {
        params: {
          includeNutrition: true,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      return this.getMockRecipe(id);
    }
  }

  static async getRandomRecipes(number: number = 6): Promise<Recipe[]> {
    try {
      if (!API_KEY) {
        return this.getMockRandomRecipes(number);
      }

      const response = await api.get('/random', {
        params: {
          number,
          include_tags: 'vegetarian,dessert,main course,side dish,appetizer',
        },
      });

      return response.data.recipes;
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      return this.getMockRandomRecipes(number);
    }
  }

  static async getRecipesByIngredients(ingredients: string[]): Promise<Recipe[]> {
    try {
      if (!API_KEY) {
        return this.getMockRecipesByIngredients(ingredients);
      }

      const response = await api.get('/findByIngredients', {
        params: {
          ingredients: ingredients.join(','),
          number: 12,
          ranking: 1,
          ignorePantry: true,
        },
      });

      // Get detailed information for each recipe
      const detailedRecipes = await Promise.all(
        response.data.map((recipe: { id: number }) => this.getRecipeById(recipe.id))
      );

      return detailedRecipes;
    } catch (error) {
      console.error('Error fetching recipes by ingredients:', error);
      return this.getMockRecipesByIngredients(ingredients);
    }
  }

  // Mock data methods for development/fallback
  private static getMockSearchResults(params: RecipeSearchParams): RecipeSearchResponse {
    const mockRecipes = this.getMockRecipes();
    const filteredRecipes = mockRecipes.filter(recipe => {
      if (params.query) {
        return recipe.title.toLowerCase().includes(params.query.toLowerCase());
      }
      if (params.cuisine) {
        return recipe.cuisines.some(cuisine => 
          cuisine.toLowerCase().includes(params.cuisine!.toLowerCase())
        );
      }
      return true;
    });

    return {
      results: filteredRecipes.slice(0, params.number || 12),
      offset: params.offset || 0,
      number: params.number || 12,
      totalResults: filteredRecipes.length,
    };
  }

  private static getMockRecipe(id: number): Recipe {
    const mockRecipes = this.getMockRecipes();
    return mockRecipes.find(recipe => recipe.id === id) || mockRecipes[0];
  }

  private static getMockRandomRecipes(number: number): Recipe[] {
    const mockRecipes = this.getMockRecipes();
    return mockRecipes.slice(0, number);
  }

  private static getMockRecipesByIngredients(ingredients: string[]): Recipe[] {
    const mockRecipes = this.getMockRecipes();
    return mockRecipes.filter(recipe =>
      ingredients.some(ingredient =>
        recipe.extendedIngredients.some(recipeIngredient =>
          recipeIngredient.name.toLowerCase().includes(ingredient.toLowerCase())
        )
      )
    );
  }

  private static getMockRecipes(): Recipe[] {
    return [
      {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500",
        imageType: "jpg",
        readyInMinutes: 20,
        servings: 4,
        sourceUrl: "",
        spoonacularScore: 95,
        healthScore: 75,
        pricePerServing: 250,
        cuisines: ["Italian"],
        dishTypes: ["main course", "dinner"],
        diets: [],
        occasions: [],
        summary: "A classic Italian pasta dish with eggs, cheese, and pancetta.",
        instructions: "Cook pasta, prepare sauce with eggs and cheese, combine with pancetta.",
        analyzedInstructions: [
          {
            name: "",
            steps: [
              {
                number: 1,
                step: "Drag the spaghetti to the cutting board to prepare it.",
                ingredients: [
                  { id: 11420, name: "spaghetti", localizedName: "spaghetti", image: "spaghetti.jpg" }
                ],
                equipment: [
                  { id: 404752, name: "cutting board", localizedName: "cutting board", image: "cutting-board.jpg" }
                ]
              },
              {
                number: 2,
                step: "Drag eggs and cheese to the pan to create the sauce.",
                ingredients: [
                  { id: 1123, name: "eggs", localizedName: "eggs", image: "egg.png" },
                  { id: 1033, name: "parmesan cheese", localizedName: "parmesan", image: "parmesan.jpg" }
                ],
                equipment: [
                  { id: 404645, name: "frying pan", localizedName: "pan", image: "pan.png" }
                ]
              },
              {
                number: 3,
                step: "Cook pancetta in the pan until crispy.",
                ingredients: [
                  { id: 10410123, name: "pancetta", localizedName: "pancetta", image: "pancetta.png" }
                ],
                equipment: [
                  { id: 404645, name: "frying pan", localizedName: "pan", image: "pan.png" }
                ]
              },
              {
                number: 4,
                step: "Combine everything on the serving plate to complete the dish!",
                ingredients: [],
                equipment: [
                  { id: 404783, name: "plate", localizedName: "plate", image: "plate.jpg" }
                ]
              }
            ]
          }
        ],
        extendedIngredients: [
          {
            id: 11420,
            aisle: "Pasta and Rice",
            image: "spaghetti.jpg",
            consistency: "solid",
            name: "spaghetti",
            nameClean: "spaghetti",
            original: "400g spaghetti",
            originalName: "spaghetti",
            amount: 400,
            unit: "g",
            meta: [],
            measures: {
              us: { amount: 14.1, unitShort: "oz", unitLong: "ounces" },
              metric: { amount: 400, unitShort: "g", unitLong: "grams" }
            }
          },
          {
            id: 1123,
            aisle: "Milk, Eggs, Other Dairy",
            image: "egg.png",
            consistency: "solid",
            name: "eggs",
            nameClean: "eggs",
            original: "4 large eggs",
            originalName: "eggs",
            amount: 4,
            unit: "large",
            meta: [],
            measures: {
              us: { amount: 4, unitShort: "large", unitLong: "larges" },
              metric: { amount: 4, unitShort: "large", unitLong: "larges" }
            }
          },
          {
            id: 1033,
            aisle: "Cheese",
            image: "parmesan.jpg",
            consistency: "solid",
            name: "parmesan cheese",
            nameClean: "parmesan cheese",
            original: "100g grated parmesan cheese",
            originalName: "grated parmesan cheese",
            amount: 100,
            unit: "g",
            meta: ["grated"],
            measures: {
              us: { amount: 3.5, unitShort: "oz", unitLong: "ounces" },
              metric: { amount: 100, unitShort: "g", unitLong: "grams" }
            }
          },
          {
            id: 10410123,
            aisle: "Meat",
            image: "pancetta.png",
            consistency: "solid",
            name: "pancetta",
            nameClean: "pancetta",
            original: "150g pancetta, diced",
            originalName: "pancetta, diced",
            amount: 150,
            unit: "g",
            meta: ["diced"],
            measures: {
              us: { amount: 5.3, unitShort: "oz", unitLong: "ounces" },
              metric: { amount: 150, unitShort: "g", unitLong: "grams" }
            }
          },
          {
            id: 11282,
            aisle: "Produce",
            image: "onion.png",
            consistency: "solid",
            name: "onion",
            nameClean: "onion",
            original: "1 medium onion, diced",
            originalName: "onion, diced",
            amount: 1,
            unit: "medium",
            meta: ["diced"],
            measures: {
              us: { amount: 1, unitShort: "medium", unitLong: "medium" },
              metric: { amount: 1, unitShort: "medium", unitLong: "medium" }
            }
          },
          {
            id: 11215,
            aisle: "Produce",
            image: "garlic.png",
            consistency: "solid",
            name: "garlic",
            nameClean: "garlic",
            original: "3 cloves garlic, minced",
            originalName: "garlic, minced",
            amount: 3,
            unit: "cloves",
            meta: ["minced"],
            measures: {
              us: { amount: 3, unitShort: "cloves", unitLong: "cloves" },
              metric: { amount: 3, unitShort: "cloves", unitLong: "cloves" }
            }
          }
        ]
      },
      {
        id: 2,
        title: "Simple Scrambled Eggs",
        image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=500",
        imageType: "jpg",
        readyInMinutes: 10,
        servings: 2,
        sourceUrl: "",
        spoonacularScore: 85,
        healthScore: 80,
        pricePerServing: 150,
        cuisines: ["American"],
        dishTypes: ["breakfast"],
        diets: ["vegetarian"],
        occasions: [],
        summary: "Perfect fluffy scrambled eggs for breakfast.",
        instructions: "Beat eggs, cook in pan, serve hot.",
        analyzedInstructions: [
          {
            name: "",
            steps: [
              {
                number: 1,
                step: "Crack eggs into a bowl and whisk them.",
                ingredients: [
                  { id: 1123, name: "eggs", localizedName: "eggs", image: "egg.png" }
                ],
                equipment: []
              },
              {
                number: 2,
                step: "Heat butter in the pan and add eggs.",
                ingredients: [
                  { id: 1001, name: "butter", localizedName: "butter", image: "butter.png" }
                ],
                equipment: []
              },
              {
                number: 3,
                step: "Scramble eggs gently until fluffy, then serve on plate.",
                ingredients: [],
                equipment: []
              }
            ]
          }
        ],
        extendedIngredients: [
          {
            id: 1123,
            aisle: "Milk, Eggs, Other Dairy",
            image: "egg.png",
            consistency: "solid",
            name: "eggs",
            nameClean: "eggs",
            original: "4 large eggs",
            originalName: "eggs",
            amount: 4,
            unit: "large",
            meta: [],
            measures: {
              us: { amount: 4, unitShort: "large", unitLong: "larges" },
              metric: { amount: 4, unitShort: "large", unitLong: "larges" }
            }
          },
          {
            id: 1001,
            aisle: "Milk, Eggs, Other Dairy",
            image: "butter.png",
            consistency: "solid",
            name: "butter",
            nameClean: "butter",
            original: "2 tbsp butter",
            originalName: "butter",
            amount: 2,
            unit: "tbsp",
            meta: [],
            measures: {
              us: { amount: 2, unitShort: "tbsp", unitLong: "tablespoons" },
              metric: { amount: 30, unitShort: "ml", unitLong: "milliliters" }
            }
          },
          {
            id: 1102047,
            aisle: "Spices and Seasonings",
            image: "salt.png",
            consistency: "solid",
            name: "salt",
            nameClean: "salt",
            original: "pinch of salt",
            originalName: "salt",
            amount: 1,
            unit: "pinch",
            meta: [],
            measures: {
              us: { amount: 1, unitShort: "pinch", unitLong: "pinch" },
              metric: { amount: 1, unitShort: "pinch", unitLong: "pinch" }
            }
          }
        ]
      }
    ];
  }
}

export default SpoonacularAPI;
