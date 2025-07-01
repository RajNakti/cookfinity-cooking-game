import Link from 'next/link';
import { Play, Book, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-orange-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-6 md:p-8 rounded-full shadow-2xl">
                <img
                  src="/uniquelogo.png"
                  alt="Cookfinity Logo"
                  width={120}
                  height={120}
                  className="h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
            <h1 className="text-3xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent">
              Cook Real Recipes in a
              <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">Virtual Kitchen</span>
            </h1>
            <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto text-gray-100">
              Learn to cook through an interactive game experience. Drag, drop, chop, mix, and cook ingredients just like in a real kitchen!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/play"
                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                <Play className="h-5 w-5" />
                <span>Start Playing</span>
              </Link>
              <Link
                href="/recipes"
                className="bg-gradient-to-r from-white/20 to-purple-200/20 hover:from-white/30 hover:to-purple-200/30 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 flex items-center justify-center space-x-2 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Book className="h-5 w-5" />
                <span>Browse Recipes</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-white via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Why Cookfinity?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Experience cooking like never before with our interactive game-based learning platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-orange-200">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Play className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Interactive Gameplay</h3>
              <p className="text-gray-600">
                Drag, drop, chop, and cook ingredients with realistic physics and visual effects
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-200">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Book className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Real Recipes</h3>
              <p className="text-gray-600">
                Learn from thousands of authentic recipes with step-by-step guidance
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-200">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Score & Compete</h3>
              <p className="text-gray-600">
                Earn points for accuracy and speed, then compete on the leaderboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-orange-200">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">1000+</div>
              <div className="text-gray-700 text-sm md:text-base">Recipes Available</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-200">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">50K+</div>
              <div className="text-gray-700 text-sm md:text-base">Games Played</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-200">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">15+</div>
              <div className="text-gray-700 text-sm md:text-base">Cuisines</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-200">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">4.8★</div>
              <div className="text-gray-700 text-sm md:text-base">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-orange-900/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent">
            Ready to Start Your Culinary Adventure?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            No account needed. Jump right in and start cooking!
          </p>
          <Link
            href="/play"
            className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 inline-flex items-center space-x-2 shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            <Play className="h-5 w-5" />
            <span>Play Now - It&apos;s Free!</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
