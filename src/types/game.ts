import { Recipe } from './recipe';

export interface GameState {
  recipe: Recipe;
  currentStep: number;
  score: number;
  timeElapsed: number;
  isPlaying: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  ingredients: GameIngredient[];
  cookingActions: CookingAction[];
  kitchenItems: KitchenItem[];
}

export interface GameIngredient {
  id: number;
  name: string;
  image: string;
  amount: number;
  unit: string;
  state: IngredientState;
  position: Position3D;
  isSelected: boolean;
  isProcessed: boolean;
  processingType?: ProcessingType;
  temperature?: number;
  cookingTime?: number;
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface Rotation3D {
  x: number;
  y: number;
  z: number;
}

export enum IngredientState {
  RAW = 'raw',
  CHOPPED = 'chopped',
  DICED = 'diced',
  SLICED = 'sliced',
  MINCED = 'minced',
  GRATED = 'grated',
  MIXED = 'mixed',
  COOKED = 'cooked',
  FRIED = 'fried',
  BOILED = 'boiled',
  BAKED = 'baked',
  GRILLED = 'grilled',
  SAUTEED = 'sauteed',
  STEAMED = 'steamed',
  ROASTED = 'roasted',
  BURNED = 'burned'
}

export enum ProcessingType {
  CHOPPING = 'chopping',
  MIXING = 'mixing',
  COOKING = 'cooking',
  FRYING = 'frying',
  BOILING = 'boiling',
  BAKING = 'baking',
  GRILLING = 'grilling',
  SAUTEING = 'sauteing',
  STEAMING = 'steaming',
  ROASTING = 'roasting'
}

export interface CookingAction {
  id: string;
  type: ActionType;
  ingredientIds: number[];
  equipment: string;
  duration: number;
  temperature?: number;
  timestamp: number;
  isCompleted: boolean;
  accuracy: number;
}

export enum ActionType {
  CHOP = 'chop',
  DICE = 'dice',
  SLICE = 'slice',
  MINCE = 'mince',
  GRATE = 'grate',
  MIX = 'mix',
  STIR = 'stir',
  POUR = 'pour',
  HEAT = 'heat',
  FRY = 'fry',
  BOIL = 'boil',
  BAKE = 'bake',
  GRILL = 'grill',
  SAUTE = 'saute',
  STEAM = 'steam',
  ROAST = 'roast',
  SEASON = 'season',
  SERVE = 'serve'
}

export interface KitchenItem {
  id: string;
  name: string;
  type: KitchenItemType;
  position: Position3D;
  rotation: Rotation3D;
  isActive: boolean;
  temperature?: number;
  capacity?: number;
  contents: GameIngredient[];
  model?: string;
}

export enum KitchenItemType {
  CUTTING_BOARD = 'cutting_board',
  KNIFE = 'knife',
  BOWL = 'bowl',
  PAN = 'pan',
  POT = 'pot',
  STOVE = 'stove',
  OVEN = 'oven',
  PLATE = 'plate',
  SPOON = 'spoon',
  SPATULA = 'spatula',
  WHISK = 'whisk',
  MEASURING_CUP = 'measuring_cup',
  GRATER = 'grater',
  BLENDER = 'blender',
  MIXER = 'mixer'
}

export interface GameScore {
  id: string;
  playerName?: string;
  recipeId: number;
  recipeName: string;
  score: number;
  timeElapsed: number;
  accuracy: number;
  completionRate: number;
  date: Date;
  difficulty: GameDifficulty;
}

export enum GameDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

export interface GameSettings {
  difficulty: GameDifficulty;
  soundEnabled: boolean;
  musicEnabled: boolean;
  showHints: boolean;
  autoSave: boolean;
  graphics: GraphicsQuality;
}

export enum GraphicsQuality {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  ULTRA = 'ultra'
}

export interface GameEvent {
  id: string;
  type: GameEventType;
  timestamp: number;
  data: Record<string, unknown>;
}

export enum GameEventType {
  GAME_START = 'game_start',
  GAME_PAUSE = 'game_pause',
  GAME_RESUME = 'game_resume',
  GAME_END = 'game_end',
  STEP_COMPLETE = 'step_complete',
  INGREDIENT_SELECTED = 'ingredient_selected',
  INGREDIENT_PROCESSED = 'ingredient_processed',
  ACTION_PERFORMED = 'action_performed',
  SCORE_UPDATED = 'score_updated',
  TIMER_TICK = 'timer_tick',
  ERROR_OCCURRED = 'error_occurred'
}

export interface DragDropContext {
  isDragging: boolean;
  draggedItem: GameIngredient | KitchenItem | null;
  dropTarget: KitchenItem | null;
  dragOffset: Position3D;
}

export interface GamePhysics {
  gravity: number;
  friction: number;
  restitution: number;
  airResistance: number;
}

export interface ParticleEffect {
  id: string;
  type: EffectType;
  position: Position3D;
  velocity: Position3D;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  opacity: number;
}

export enum EffectType {
  STEAM = 'steam',
  SMOKE = 'smoke',
  SIZZLE = 'sizzle',
  BUBBLE = 'bubble',
  SPARK = 'spark',
  CHOP_PARTICLE = 'chop_particle',
  SPLASH = 'splash',
  DUST = 'dust'
}

export interface SoundEffect {
  id: string;
  name: string;
  url: string;
  volume: number;
  loop: boolean;
  category: SoundCategory;
}

export enum SoundCategory {
  AMBIENT = 'ambient',
  ACTION = 'action',
  UI = 'ui',
  COOKING = 'cooking',
  MUSIC = 'music'
}
