'use client';

import Link from "next/link";
import { useSession, signOut } from 'next-auth/react';
import {
  Gamepad2,
  Wallet,
  Zap,
  Shield,
  Star,
  ChevronRight,
  Search,
  Tv,
  Headphones,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { data: session, status } = useSession();
  const popularGames = [
    { id: 'mlbb', name: 'Mobile Legends', icon: '🎮' },
    { id: 'ff', name: 'Free Fire', icon: '🔫' },
    { id: 'pubgm', name: 'PUBG Mobile', icon: '🎯' },
    { id: 'genshin', name: 'Genshin Impact', icon: '🌟' },
    { id: 'valorant', name: 'Valorant', icon: '🎯' },
    { id: 'roblox', name: 'Roblox', icon: '🎲' },
  ];

  const streamingServices = [
    { id: 'netflix', name: 'Netflix', icon: '🎬', price: 'Mulai 54rb' },
    { id: 'spotify', name: 'Spotify', icon: '🎵', price: 'Mulai 55rb' },
    { id: 'youtube-premium', name: 'YouTube', icon: '📺', price: 'Mulai 35rb' },
    { id: 'disney-plus', name: 'Disney+', icon: '🏰', price: 'Mulai 39rb' },
    { id: 'vidio', name: 'Vidio', icon: '⚽', price: 'Mulai 79rb' },
    { id: 'wetv', name: 'WeTV', icon: '🎭', price: 'Mulai 49rb' },
  ];

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Proses Kilat",
      description: "Top up diproses otomatis dalam hitungan detik"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "100% Aman",
      description: "Transaksi terenkripsi dan terjamin keamanannya"
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Support 24/7",
      description: "Tim kami siap membantu kapan saja"
    }
  ];

  const testimonials = [
    {
      name: "Andi Pratama",
      rating: 5,
      comment: "Top up ML super cepat! Langsung masuk dalam 5 detik 👍"
    },
    {
      name: "Sarah N.",
      rating: 5,
      comment: "Harga paling murah dan proses otomatis. Recommended!"
    },
    {
      name: "Reza Gaming",
      rating: 5,
      comment: "Udah langganan disini, selalu aman dan terpercaya"
    }
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/95">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold">TopUpKilat</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/topup/game" className="text-sm font-medium hover:text-blue-600">
                Game
              </Link>
              <Link href="/topup/streaming" className="text-sm font-medium hover:text-blue-600 flex items-center">
                <Tv className="h-4 w-4 mr-1" />
                Streaming
              </Link>
              <Link href="/topup/pulsa" className="text-sm font-medium hover:text-blue-600">
                Pulsa & Data
              </Link>
              <Link href="/topup/ewallet" className="text-sm font-medium hover:text-blue-600">
                E-Wallet
              </Link>
              <Link href="/socialmedia" className="text-sm font-medium hover:text-blue-600">
                Social Media
              </Link>
              <Link href="/order/lookup" className="text-sm font-medium hover:text-blue-600">
                Lacak Pesanan
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {status === 'loading' ? (
                <span className="text-xs text-gray-500">Mengecek sesi...</span>
              ) : session?.user ? (
                <>
                  <span className="hidden md:inline text-sm text-gray-700 dark:text-gray-200">
                    {session.user.name || session.user.email}
                  </span>
                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin/provider">
                      <Button variant="outline" size="sm">Admin</Button>
                    </Link>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">Masuk</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">Daftar</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Top Up Game, Streaming & E-Wallet dalam{' '}
              <span className="text-yellow-300">Hitungan Menit</span>
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Bayar via QRIS, e-wallet, atau transfer bank. Harga transparan, proses otomatis. Dukungan 24/7 siap membantu Anda.
            </p>
            
            {/* Quick Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cari game, streaming, atau e-wallet..."
                  className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const query = e.currentTarget.value.toLowerCase();
                      if (query.includes('netflix') || query.includes('spotify') || query.includes('youtube')) {
                        window.location.href = '/topup/streaming';
                      } else if (query.includes('ml') || query.includes('ff') || query.includes('pubg')) {
                        window.location.href = '/topup/game';
                      } else {
                        window.location.href = `/search?q=${encodeURIComponent(e.currentTarget.value)}`;
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/topup/game">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Top Up Game
                </Button>
              </Link>
              <Link href="/topup/streaming">
                <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                  <Tv className="mr-2 h-5 w-5" />
                  Streaming Services
                </Button>
              </Link>
              <Link href="/topup/ewallet">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Wallet className="mr-2 h-5 w-5" />
                  Top Up E-Wallet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Games */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Game Populer</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularGames.map((game) => (
              <Link key={game.id} href={`/topup/game/${game.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">{game.icon}</div>
                    <p className="text-sm font-medium">{game.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/topup/game">
              <Button variant="outline">
                Lihat Semua Game
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Streaming Services */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Streaming Services</h2>
            <p className="text-gray-600 dark:text-gray-400">Berlangganan Netflix, Spotify, YouTube Premium & lainnya</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {streamingServices.map((service) => (
              <Link key={service.id} href={`/topup/streaming/${service.id}`}>
                <Card className="hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer bg-white dark:bg-slate-800">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">{service.icon}</div>
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm text-green-600 font-medium mt-1">{service.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/topup/streaming">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Lihat Semua Streaming
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Kenapa TopUpKilat?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Testimoni Pengguna</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{testimonial.name}</p>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <CardDescription>{testimonial.comment}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Mulai Top Up Sekarang!
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Proses cepat, harga terbaik, 100% aman
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/topup/game">
              <Button size="lg" variant="secondary">
                Top Up Sekarang
              </Button>
            </Link>
            <Link href="/order/lookup">
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                Lacak Pesanan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">TopUpKilat</span>
              </div>
              <p className="text-sm">
                Platform top up game dan e-wallet terpercaya di Indonesia
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Layanan</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/topup/game" className="hover:text-white">Top Up Game</Link></li>
                <li><Link href="/topup/ewallet" className="hover:text-white">Top Up E-Wallet</Link></li>
                <li><Link href="/topup/pulsa" className="hover:text-white">Pulsa</Link></li>
                <li><Link href="/topup/data" className="hover:text-white">Paket Data</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Bantuan</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/order/lookup" className="hover:text-white">Lacak Pesanan</Link></li>
                <li><Link href="/contact" className="hover:text-white">Hubungi Kami</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/legal/terms" className="hover:text-white">Syarat & Ketentuan</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-white">Kebijakan Privasi</Link></li>
                <li><Link href="/legal/refund" className="hover:text-white">Kebijakan Refund</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 TopUpKilat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
