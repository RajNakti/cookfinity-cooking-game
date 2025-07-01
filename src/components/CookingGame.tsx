'use client';

import { useState, useEffect, useRef } from 'react';
import { Recipe } from '@/types/recipe';
import { Flame, Droplets, Zap, CheckCircle, Target } from 'lucide-react';

interface CookingGameProps {
  recipe: Recipe;
  onComplete: (score: number, time: number) => void;
  onScoreUpdate: (score: number) => void;
  onTimeUpdate: (time: number) => void;
}

interface GameIngredient {
  id: string;
  name: string;
  image: string;
  x: number;
  y: number;
  isDragging: boolean;
  isProcessed: boolean;
  processingType?: string;
}

interface CookingStation {
  id: string;
  name: string;
  type: 'cutting-board' | 'pan' | 'pot' | 'oven' | 'plate';
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;
  contents: GameIngredient[];
}

export default function CookingGame({ recipe, onComplete, onScoreUpdate, onTimeUpdate }: CookingGameProps) {
  const [gameIngredients, setGameIngredients] = useState<GameIngredient[]>([]);
  const [cookingStations, setCookingStations] = useState<CookingStation[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [draggedItem, setDraggedItem] = useState<GameIngredient | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showScorePopup, setShowScorePopup] = useState<{show: boolean, points: number, text: string}>({show: false, points: 0, text: ''});
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const steps = recipe.analyzedInstructions[0]?.steps || [
    { number: 1, step: "Prepare all ingredients", ingredients: [], equipment: [] },
    { number: 2, step: "Cook according to recipe", ingredients: [], equipment: [] },
    { number: 3, step: "Serve and enjoy!", ingredients: [], equipment: [] }
  ];

  // Sound effect function
  const playSound = (frequency: number = 800, duration: number = 200) => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch {
      console.log('Audio not supported');
    }
  };

  // Next step function
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setScore(prev => prev + 100);
      playSound(1000, 300); // Higher pitch for next step
      onScoreUpdate(score + 100);
    }
  };

  useEffect(() => {
    initializeGame();
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  useEffect(() => {
    onTimeUpdate(timeElapsed);
  }, [timeElapsed, onTimeUpdate]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  };

  const initializeGame = () => {
    // Initialize ingredients and stations in a responsive layout
    const isMobile = window.innerWidth < 768;

    const ingredients: GameIngredient[] = recipe.extendedIngredients.slice(0, 6).map((ingredient, index) => ({
      id: `ingredient-${index}`,
      name: ingredient.name,
      image: ingredient.image,
      x: isMobile ? 10 + (index % 2) * 90 : 30 + (index % 3) * 120,
      y: isMobile ? 80 + Math.floor(index / 2) * 90 : 100 + Math.floor(index / 3) * 120,
      isDragging: false,
      isProcessed: false,
    }));

    const stations: CookingStation[] = [
      {
        id: 'cutting-board',
        name: 'Cutting Board',
        type: 'cutting-board',
        x: isMobile ? window.innerWidth * 0.52 : 450,
        y: isMobile ? 80 : 100,
        width: isMobile ? 80 : 120,
        height: isMobile ? 60 : 80,
        isActive: false,
        contents: []
      },
      {
        id: 'pan',
        name: 'Frying Pan',
        type: 'pan',
        x: isMobile ? window.innerWidth * 0.52 : 590,
        y: isMobile ? 150 : 100,
        width: isMobile ? 80 : 120,
        height: isMobile ? 60 : 80,
        isActive: false,
        contents: []
      },
      {
        id: 'pot',
        name: 'Cooking Pot',
        type: 'pot',
        x: isMobile ? window.innerWidth * 0.72 : 450,
        y: isMobile ? 80 : 200,
        width: isMobile ? 80 : 120,
        height: isMobile ? 60 : 80,
        isActive: false,
        contents: []
      },
      {
        id: 'plate',
        name: 'Serving Plate',
        type: 'plate',
        x: isMobile ? window.innerWidth * 0.72 : 590,
        y: isMobile ? 150 : 200,
        width: isMobile ? 80 : 120,
        height: isMobile ? 60 : 80,
        isActive: false,
        contents: []
      }
    ];

    setGameIngredients(ingredients);
    setCookingStations(stations);
  };

  const handleMouseDown = (ingredient: GameIngredient, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDraggedItem(ingredient);
    setGameIngredients(prev =>
      prev.map(ing =>
        ing.id === ingredient.id ? { ...ing, isDragging: true } : ing
      )
    );
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggedItem || !gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left - 48; // Adjusted for ingredient size
    const y = clientY - rect.top - 48;

    setGameIngredients(prev =>
      prev.map(ing =>
        ing.id === draggedItem.id ? { ...ing, x: Math.max(0, Math.min(x, rect.width - 96)), y: Math.max(0, Math.min(y, rect.height - 96)) } : ing
      )
    );
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggedItem || !gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.changedTouches[0].clientY : e.clientY;

    const dropX = clientX - rect.left;
    const dropY = clientY - rect.top;

    const targetStation = cookingStations.find(station =>
      dropX >= station.x &&
      dropX <= station.x + station.width &&
      dropY >= station.y &&
      dropY <= station.y + station.height
    );

    if (targetStation) {
      handleIngredientDrop(draggedItem, targetStation);
    }

    setGameIngredients(prev =>
      prev.map(ing => ({ ...ing, isDragging: false }))
    );
    setDraggedItem(null);
  };

  const handleIngredientDrop = (ingredient: GameIngredient, station: CookingStation) => {
    let newScore = score;
    let processingType = '';
    let points = 0;

    switch (station.type) {
      case 'cutting-board':
        processingType = 'chopped';
        points = 100;
        newScore += points;
        break;
      case 'pan':
        processingType = 'fried';
        points = 150;
        newScore += points;
        break;
      case 'pot':
        processingType = 'boiled';
        points = 150;
        newScore += points;
        break;
      case 'plate':
        processingType = 'plated';
        points = 200;
        newScore += points;
        break;
    }

    setScore(newScore);

    // Play sound effect based on station type
    switch (station.type) {
      case 'cutting-board':
        playSound(600, 150); // Lower pitch for chopping
        break;
      case 'pan':
        playSound(800, 200); // Medium pitch for frying
        break;
      case 'pot':
        playSound(700, 250); // Medium-low pitch for boiling
        break;
      case 'plate':
        playSound(1200, 300); // Higher pitch for plating
        break;
    }

    setShowScorePopup({
      show: true,
      points,
      text: `${processingType} ${ingredient.name}!`
    });
    
    setTimeout(() => {
      setShowScorePopup({show: false, points: 0, text: ''});
    }, 2000);
    
    setGameIngredients(prev =>
      prev.map(ing =>
        ing.id === ingredient.id
          ? { ...ing, isProcessed: true, processingType, x: station.x + 10, y: station.y + 10 }
          : ing
      )
    );

    setCookingStations(prev =>
      prev.map(st =>
        st.id === station.id
          ? { ...st, contents: [...st.contents, { ...ingredient, isProcessed: true, processingType }] }
          : st
      )
    );

    checkStepCompletion();
  };

  const checkStepCompletion = () => {
    const processedCount = gameIngredients.filter(ing => ing.isProcessed).length;
    const totalIngredients = gameIngredients.length;

    if (processedCount >= Math.ceil(totalIngredients * 0.3) && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setScore(prev => prev + 300);
      playSound(1100, 400); // Auto step progression sound
    }

    if (processedCount >= Math.ceil(totalIngredients * 0.8)) {
      completeGame();
    }
  };

  const completeGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const timeBonus = Math.max(0, (300 - timeElapsed) * 10);
    const finalScore = score + timeBonus;
    
    setGameCompleted(true);
    setTimeout(() => {
      onComplete(finalScore, timeElapsed);
    }, 2000);
  };

  const getStationColor = (station: CookingStation, isHovered: boolean = false) => {
    const baseColors = {
      'cutting-board': isHovered
        ? 'bg-gradient-to-br from-amber-300 to-yellow-400 border-amber-500 shadow-2xl scale-105'
        : 'bg-gradient-to-br from-amber-200 to-yellow-300 border-amber-400 shadow-lg',
      'pan': isHovered
        ? 'bg-gradient-to-br from-red-300 to-pink-400 border-red-500 shadow-2xl scale-105'
        : 'bg-gradient-to-br from-red-200 to-pink-300 border-red-400 shadow-lg',
      'pot': isHovered
        ? 'bg-gradient-to-br from-blue-300 to-cyan-400 border-blue-500 shadow-2xl scale-105'
        : 'bg-gradient-to-br from-blue-200 to-cyan-300 border-blue-400 shadow-lg',
      'plate': isHovered
        ? 'bg-gradient-to-br from-green-300 to-emerald-400 border-green-500 shadow-2xl scale-105'
        : 'bg-gradient-to-br from-green-200 to-emerald-300 border-green-400 shadow-lg',
      'oven': isHovered
        ? 'bg-gradient-to-br from-orange-300 to-yellow-400 border-orange-500 shadow-2xl scale-105'
        : 'bg-gradient-to-br from-orange-200 to-yellow-300 border-orange-400 shadow-lg',
    };
    return baseColors[station.type] || 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-400';
  };

  const getStationIcon = (station: CookingStation) => {
    switch (station.type) {
      case 'cutting-board': return <Target className="h-8 w-8 text-amber-600" />;
      case 'pan': return <Flame className="h-8 w-8 text-red-600" />;
      case 'pot': return <Droplets className="h-8 w-8 text-blue-600" />;
      case 'plate': return <CheckCircle className="h-8 w-8 text-green-600" />;
      default: return <Zap className="h-8 w-8 text-gray-600" />;
    }
  };

  const getStationDescription = (station: CookingStation) => {
    switch (station.type) {
      case 'cutting-board': return 'Chop & Prepare';
      case 'pan': return 'Fry & Sauté';
      case 'pot': return 'Boil & Simmer';
      case 'plate': return 'Serve & Plate';
      default: return 'Cook';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-800 text-white overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 border-b border-gray-500 p-2 md:p-4 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-3 space-y-2 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start space-x-2 md:space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold shadow-lg">
                Step {currentStep + 1}/{steps.length}
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-lg">
                Progress: {gameIngredients.filter(ing => ing.isProcessed).length}/{gameIngredients.length}
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">{score}</div>
              <div className="text-xs text-gray-300">POINTS</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-2 md:p-3 mb-2 border border-purple-500 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
              <p className="text-white font-medium text-sm md:text-base text-center md:text-left flex-1">{steps[currentStep]?.step}</p>
              {currentStep < steps.length - 1 && (
                <button
                  onClick={goToNextStep}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>Next Step</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs md:text-sm text-yellow-300">
            <span>💡</span>
            <span className="text-center">Drag ingredients to the colored cooking stations below!</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-2 md:p-4">
        <div
          ref={gameAreaRef}
          className="relative w-full h-full bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 rounded-xl shadow-2xl border-2 border-purple-500 min-h-[500px] md:min-h-[600px]"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(45deg, rgba(139, 69, 19, 0.1) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(139, 69, 19, 0.1) 25%, transparent 25%)
            `,
            backgroundSize: '50px 50px, 50px 50px, 20px 20px, 20px 20px'
          }}
        >
          <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-lg border border-purple-400">
            🥘 Ingredients
          </div>

          <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-gradient-to-r from-orange-600 to-red-600 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-lg border border-orange-400">
            🍳 Cooking Stations
          </div>

          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-full shadow-lg border border-cyan-400 hidden md:block">
            <div className="text-center">
              <div className="text-sm font-bold">👆 Drag ingredients to the colored cooking stations below! 👇</div>
            </div>
          </div>

          {/* Mobile instruction */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-3 py-1 rounded-full shadow-lg text-xs md:hidden">
            Drag to cook!
          </div>

          {/* Ingredients Area Background */}
          <div className="absolute top-16 md:top-20 left-2 md:left-4 w-[calc(50%-12px)] md:w-96 h-64 md:h-80 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border-2 border-dashed border-purple-400/50 backdrop-blur-sm z-0 shadow-lg">
            <div className="absolute top-2 left-2 md:left-4 text-purple-300 text-xs font-medium">Ingredients Area</div>
          </div>

          {/* Cooking Stations Area Background */}
          <div className="absolute top-16 md:top-20 right-2 md:right-4 w-[calc(50%-12px)] md:w-80 h-64 md:h-80 bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl border-2 border-dashed border-orange-400/50 backdrop-blur-sm z-0 shadow-lg">
            <div className="absolute top-2 left-2 md:left-4 text-orange-300 text-xs font-medium">Cooking Stations Area</div>
          </div>

          {cookingStations.map(station => (
            <div
              key={station.id}
              className={`absolute border-3 md:border-4 border-dashed rounded-xl flex flex-col items-center justify-center ${getStationColor(station, hoveredStation === station.id)} transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm`}
              style={{
                left: station.x,
                top: station.y,
                width: station.width,
                height: station.height,
              }}
              onMouseEnter={() => setHoveredStation(station.id)}
              onMouseLeave={() => setHoveredStation(null)}
            >
              <div className="flex flex-col items-center space-y-1">
                {getStationIcon(station)}
                <span className="text-xs md:text-sm font-bold text-center text-gray-800">{station.name}</span>
                <span className="text-xs text-center text-gray-600 hidden md:block">{getStationDescription(station)}</span>
              </div>
              {station.contents.length > 0 && (
                <div className="absolute -top-2 md:-top-3 -right-2 md:-right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full w-5 h-5 md:w-7 md:h-7 flex items-center justify-center text-xs md:text-sm font-bold shadow-lg animate-pulse border-2 border-white">
                  {station.contents.length}
                </div>
              )}
            </div>
          ))}

          {showScorePopup.show && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce">
                <div className="text-center">
                  <div className="text-2xl font-bold">+{showScorePopup.points}</div>
                  <div className="text-sm">{showScorePopup.text}</div>
                </div>
              </div>
            </div>
          )}



          {gameIngredients.map(ingredient => (
            <div
              key={ingredient.id}
              className={`absolute w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-xl cursor-grab active:cursor-grabbing transition-all duration-300 hover:scale-105 border-2 ${
                ingredient.isDragging ? 'scale-125 z-50 rotate-12 shadow-2xl border-cyan-400' : 'z-30 border-purple-300'
              } ${ingredient.isProcessed ? 'ring-4 ring-green-400 ring-opacity-60 border-green-400' : 'hover:shadow-lg hover:border-pink-400'}`}
              style={{
                left: ingredient.x,
                top: ingredient.y,
                transform: ingredient.isDragging ? 'rotate(12deg)' : 'rotate(0deg)',
                zIndex: ingredient.isDragging ? 1000 : 30,
              }}
              onMouseDown={(e) => handleMouseDown(ingredient, e)}
              onTouchStart={(e) => handleMouseDown(ingredient, e)}
            >
              <div className="w-full h-full bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 rounded-xl flex items-center justify-center relative overflow-hidden border-2 border-orange-200 hover:border-pink-300">
                <img
                  src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                  alt={ingredient.name}
                  className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0Y5RkFGQiIvPgo8cGF0aCBkPSJNMjAgMTBDMTUuNTggMTAgMTIgMTMuNTggMTIgMThDMTIgMjIuNDIgMTUuNTggMjYgMjAgMjZDMjQuNDIgMjYgMjggMjIuNDIgMjggMThDMjggMTMuNTggMjQuNDIgMTAgMjAgMTBaTTIwIDI0QzE2LjY9IDI0IDE0IDIxLjMxIDE0IDE4QzE0IDE0LjY5IDE2LjY5IDEyIDIwIDEyQzIzLjMxIDEyIDI2IDE0LjY5IDI2IDE4QzI2IDIxLjMxIDIzLjMxIDI0IDIwIDI0WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjAgMTZDMTguOSAxNiAxOCAxNi45IDE4IDE4QzE4IDE5LjEgMTguOSAyMCAyMCAyMEMyMS4xIDIwIDIyIDE5LjEgMjIgMThDMjIgMTYuOSAyMS4xIDE2IDIwIDE2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                  }}
                />
                {ingredient.isProcessed && (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 bg-opacity-30 flex items-center justify-center rounded-xl">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-700" />
                  </div>
                )}
                {ingredient.isDragging && (
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 bg-opacity-20 rounded-xl animate-pulse"></div>
                )}
              </div>
              <div className="absolute -bottom-8 md:-bottom-10 left-0 right-0 text-xs text-center text-white bg-gradient-to-r from-gray-900 to-purple-900 bg-opacity-90 rounded-lg px-1 md:px-2 py-1 font-medium shadow-lg max-w-20 md:max-w-28 mx-auto">
                {ingredient.processingType ? `${ingredient.processingType} ${ingredient.name}` : ingredient.name}
              </div>
            </div>
          ))}

          {gameCompleted && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Recipe Complete!</h2>
                <p className="text-gray-300">Calculating your final score...</p>
              </div>
            </div>
          )}

          <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-2 border-purple-500 rounded-xl p-2 md:p-3 shadow-2xl backdrop-blur-sm max-w-[95%] md:max-w-none">
            <div className="flex flex-wrap items-center justify-center space-x-2 md:space-x-6 text-xs md:text-sm">
              <div className="flex items-center space-x-1 md:space-x-2 text-gray-200 mb-1 md:mb-0">
                <Target className="h-3 w-3 md:h-4 md:w-4 text-amber-400" />
                <span><strong className="text-amber-400">Board:</strong> +100pts</span>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2 text-gray-200 mb-1 md:mb-0">
                <Flame className="h-3 w-3 md:h-4 md:w-4 text-red-400" />
                <span><strong className="text-red-400">Pan:</strong> +150pts</span>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2 text-gray-200 mb-1 md:mb-0">
                <Droplets className="h-3 w-3 md:h-4 md:w-4 text-blue-400" />
                <span><strong className="text-blue-400">Pot:</strong> +150pts</span>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2 text-gray-200 mb-1 md:mb-0">
                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-400" />
                <span><strong className="text-green-400">Plate:</strong> +200pts</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {Math.round((gameIngredients.filter(ing => ing.isProcessed).length / gameIngredients.length) * 100)}%
              </div>
              <div className="text-xs text-gray-400 mb-2">Complete</div>
              <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                  style={{ width: `${(gameIngredients.filter(ing => ing.isProcessed).length / gameIngredients.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
