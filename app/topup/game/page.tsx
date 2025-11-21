'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { FloatingSupport } from "@/components/FloatingSupport";
import { ArrowLeft, Search } from "lucide-react";

// Mock data - will be replaced with database query
const games = [
  { id: 'mlbb', name: 'Mobile Legends', category: 'MOBA', icon: '🎮', popular: true },
  { id: 'ff', name: 'Free Fire', category: 'Battle Royale', icon: '🔫', popular: true },
  { id: 'pubgm', name: 'PUBG Mobile', category: 'Battle Royale', icon: '🎯', popular: true },
  { id: 'genshin', name: 'Genshin Impact', category: 'RPG', icon: '🌟', popular: true },
  { id: 'valorant', name: 'Valorant', category: 'FPS', icon: '🎯', popular: true },
  { id: 'roblox', name: 'Roblox', category: 'Platform', icon: '🎲', popular: true },
  { id: 'codm', name: 'Call of Duty Mobile', category: 'FPS', icon: '🔫', popular: false },
  { id: 'aov', name: 'Arena of Valor', category: 'MOBA', icon: '⚔️', popular: false },
  { id: 'honkai', name: 'Honkai Star Rail', category: 'RPG', icon: '✨', popular: false },
  { id: 'wildrift', name: 'League of Legends: Wild Rift', category: 'MOBA', icon: '🏆', popular: false },
  { id: 'fifa', name: 'FIFA Mobile', category: 'Sports', icon: '⚽', popular: false },
  { id: 'stumbleguys', name: 'Stumble Guys', category: 'Party', icon: '🎮', popular: false },
];

const categories = ['Semua', 'MOBA', 'Battle Royale', 'RPG', 'FPS', 'Platform', 'Sports', 'Party'];

export default function GameCatalogPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <FloatingSupport />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Top Up Game</h1>
            </div>
            
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari game favorit kamu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex space-x-2 overflow-x-auto mt-6 pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? 'default' : 'outline'}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Games Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState onRetry={handleRetry} />
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Tidak ada game yang ditemukan untuk &quot;{searchQuery}&quot;</p>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}>Reset Pencarian</Button>
          </div>
        ) : (
          <>
            {/* Popular Games - only show when no filter */}
            {selectedCategory === 'Semua' && searchQuery === '' && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">🔥 Game Populer</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {games.filter(g => g.popular).map((game) => (
                    <Link key={game.id} href={`/topup/game/${game.id}`}>
                      <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                        <CardContent className="p-6">
                          <div className="text-4xl mb-3 text-center">{game.icon}</div>
                          <p className="text-sm font-medium text-center">{game.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">{game.category}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* All/Filtered Games */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {selectedCategory === 'Semua' && searchQuery === '' 
                  ? 'Semua Game'
                  : `Hasil Pencarian ${searchQuery ? `"${searchQuery}"` : ''} ${selectedCategory !== 'Semua' ? `- ${selectedCategory}` : ''}`
                }
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredGames.map((game) => (
                  <Link key={game.id} href={`/topup/game/${game.id}`}>
                    <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="text-4xl mb-3 text-center">{game.icon}</div>
                        <p className="text-sm font-medium text-center">{game.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">{game.category}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </>
  );
}
