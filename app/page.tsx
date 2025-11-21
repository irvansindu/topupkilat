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
  CheckCircle,
  Users,
  Clock,
  CreditCard,
  Lock,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { FloatingSupport } from "@/components/FloatingSupport";
import Head from 'next/head';

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
      role: "Streamer Mobile Legends",
      avatar: "AP",
      rating: 5,
      comment: "Top up ML super cepat! Langsung masuk dalam 5 detik 👍"
    },
    {
      name: "Sarah N.",
      role: "Pelanggan Setia",
      avatar: "SN",
      rating: 5,
      comment: "Harga paling murah dan proses otomatis. Recommended!"
    },
    {
      name: "Reza Gaming",
      role: "Pro Player PUBG",
      avatar: "RG",
      rating: 5,
      comment: "Udah langganan disini, selalu aman dan terpercaya"
    },
    {
      name: "Dina Ayu",
      role: "Subscriber Netflix",
      avatar: "DA",
      rating: 5,
      comment: "Top up Netflix gampang banget, CS nya juga responsif!"
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Cara Top Up Mobile Legends Paling Murah & Aman",
      excerpt: "Panduan lengkap top up diamond ML dengan harga termurah dan proses tercepat.",
      image: "📱"
    },
    {
      id: 2,
      title: "Tips Berlangganan Netflix Hemat dengan Voucher",
      excerpt: "Simak trik berlangganan Netflix dengan harga lebih hemat menggunakan voucher digital.",
      image: "🎬"
    },
    {
      id: 3,
      title: "Panduan Keamanan Transaksi Digital untuk Pemula",
      excerpt: "Pelajari cara bertransaksi online yang aman dan terhindar dari penipuan.",
      image: "🔒"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      icon: <Search className="h-8 w-8" />,
      title: "Pilih Produk",
      description: "Pilih game, streaming, atau e-wallet yang kamu inginkan"
    },
    {
      step: 2,
      icon: <CreditCard className="h-8 w-8" />,
      title: "Isi Data & Bayar",
      description: "Masukkan ID/nomor, pilih nominal, dan bayar dengan metode favoritmu"
    },
    {
      step: 3,
      icon: <Zap className="h-8 w-8" />,
      title: "Saldo Masuk",
      description: "Saldo/voucher otomatis masuk ke akun kamu dalam hitungan detik"
    }
  ];

  const user = session?.user ? (session.user as typeof session.user & { role?: string }) : null;

  return (
    <>
      <FloatingSupport />
      <Head>
        <title>TopUpKilat – Top Up Game, Streaming & E-Wallet Tercepat & Termurah di Indonesia</title>
        <meta name="description" content="Top up game murah Mobile Legends, Free Fire, PUBG. Berlangganan Netflix, Spotify, YouTube Premium. Top up e-wallet OVO, DANA, GoPay. Proses otomatis, harga transparan, support 24/7." />
        <meta name="keywords" content="top up game murah, top up ml, top up free fire, top up netflix, top up spotify, top up ewallet, top up ovo, top up dana, top up gopay" />
        <meta property="og:title" content="TopUpKilat – Top Up Game, Streaming & E-Wallet Tercepat" />
        <meta property="og:description" content="Platform top up terpercaya dengan harga termurah dan proses tercepat di Indonesia" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://digitexa.biz.id" />
        <link rel="canonical" href="https://digitexa.biz.id" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TopUpKilat",
              "url": "https://digitexa.biz.id",
              "logo": "https://digitexa.biz.id/logo.png",
              "description": "Platform top up game, streaming, dan e-wallet terpercaya di Indonesia dengan proses otomatis 24/7",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "ID"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "availableLanguage": ["Indonesian", "English"]
              },
              "sameAs": [
                "https://facebook.com/topupkilat",
                "https://instagram.com/topupkilat",
                "https://twitter.com/topupkilat"
              ]
            })
          }}
        />
        
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "TopUpKilat",
              "url": "https://digitexa.biz.id",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://digitexa.biz.id/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/95">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size="md" />
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
                  {user?.role === 'ADMIN' && (
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
              <span className="text-yellow-300">Hitungan Detik</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              Proses <span className="font-bold text-yellow-300">Otomatis 24/7</span> • Harga <span className="font-bold text-yellow-300">Transparan & Kompetitif</span>
            </p>
            <p className="text-lg mb-4 opacity-80">
              Bayar via QRIS, e-wallet, transfer bank & kartu kredit. Dukungan pelanggan siap membantu kapan saja.
            </p>
            <p className="text-sm mb-8 opacity-75 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
              ⚡ Mayoritas pesanan diproses otomatis dalam hitungan detik hingga beberapa menit
            </p>
            
            {/* Social Proof Badges */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">100.000+ Transaksi</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Gamepad2 className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">50+ Game & Layanan</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Headphones className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Support 24/7</span>
              </div>
            </div>
            
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
            
            <div className="flex gap-4 justify-center flex-wrap mb-8">
              <Link href="/topup/game">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1">
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Top Up Game
                </Button>
              </Link>
              <Link href="/topup/streaming">
                <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1">
                  <Tv className="mr-2 h-5 w-5" />
                  Streaming Services
                </Button>
              </Link>
              <Link href="/topup/ewallet">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 bg-white/5 backdrop-blur-sm">
                  <Wallet className="mr-2 h-5 w-5" />
                  Top Up E-Wallet
                </Button>
              </Link>
            </div>

            {/* Payment Methods Trust Indicators */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-sm opacity-75 mb-4">Metode Pembayaran Tersedia:</p>
              <div className="flex flex-wrap justify-center items-center gap-4 opacity-90">
                <div className="bg-white px-4 py-2 rounded text-gray-700 font-semibold text-sm">QRIS</div>
                <div className="bg-white px-4 py-2 rounded text-gray-700 font-semibold text-sm">GoPay</div>
                <div className="bg-white px-4 py-2 rounded text-gray-700 font-semibold text-sm">OVO</div>
                <div className="bg-white px-4 py-2 rounded text-gray-700 font-semibold text-sm">DANA</div>
                <div className="bg-white px-4 py-2 rounded text-gray-700 font-semibold text-sm">ShopeePay</div>
                <div className="bg-white px-4 py-2 rounded text-gray-700 font-semibold text-sm">BCA</div>
                <div className="bg-white px-4 py-2 rounded text-gray-700 font-semibold text-sm">Mandiri</div>
                <div className="bg-white px-4 py-2 rounded text-gray-700 font-semibold text-sm">BNI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cara Top Up di TopUpKilat</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Mudah, cepat, dan aman hanya dalam 3 langkah</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 shadow-md mx-auto" style={{left: '50%', transform: 'translateX(20px)'}}>
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
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
              <Card key={index} className="hover:shadow-xl transition-shadow">
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

      {/* Security & Legal Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Keamanan & Kepercayaan</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Transaksi aman dan terpercaya dengan jaminan 100%</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <Lock className="h-10 w-10 text-green-600 mb-3" />
                <CardTitle className="text-lg">Transaksi Terenkripsi</CardTitle>
                <CardDescription>
                  Semua data dan transaksi dilindungi dengan enkripsi SSL 256-bit. Informasi pribadi dan pembayaran Anda dijamin aman.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <Clock className="h-10 w-10 text-blue-600 mb-3" />
                <CardTitle className="text-lg">Sistem Otomatis 24/7</CardTitle>
                <CardDescription>
                  Proses otomatis tanpa intervensi manual. Top up langsung masuk ke akun Anda kapan pun Anda melakukan transaksi.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <FileText className="h-10 w-10 text-purple-600 mb-3" />
                <CardTitle className="text-lg">Kebijakan Refund Jelas</CardTitle>
                <CardDescription>
                  Kami memiliki <Link href="/legal/refund" className="text-blue-600 hover:underline font-semibold">kebijakan refund</Link> yang transparan. Jika ada masalah, kami siap membantu.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="text-center mt-10">
            <div className="inline-block bg-white dark:bg-slate-800 px-6 py-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong className="text-gray-900 dark:text-white">Platform Digital Terpercaya</strong>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Terdaftar sebagai penyedia layanan digital Indonesia • Melayani 100.000+ pengguna aktif
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Order Tracking Highlight */}
      <section className="py-12 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <CheckCircle className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Cek Status Transaksi Kapan Saja</h3>
            <p className="text-blue-100 mb-6">
              Gunakan fitur <strong>Lacak Pesanan</strong> untuk memantau status top up kamu secara real-time. Masukkan kode pesanan dan email untuk melihat detail lengkap.
            </p>
            <Link href="/order/lookup">
              <Button size="lg" variant="secondary" className="shadow-xl">
                <Search className="mr-2 h-5 w-5" />
                Lacak Pesanan Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Testimoni Pengguna</h2>
            <div className="flex items-center justify-center gap-2 text-xl">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-bold text-gray-900 dark:text-white">4.9/5</span>
              <span className="text-gray-600 dark:text-gray-400">dari 2.300+ review</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{testimonial.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-sm">{testimonial.comment}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog/Tips Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Tips & Info Terbaru</h2>
              <p className="text-gray-600 dark:text-gray-400">Panduan dan artikel seputar top up & gaming</p>
            </div>
            <Link href="/blog" className="hidden md:block">
              <Button variant="outline">
                Lihat Semua
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                <CardHeader>
                  <div className="text-5xl mb-4">{post.image}</div>
                  <CardTitle className="text-lg mb-2 line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mb-4">{post.excerpt}</CardDescription>
                  <Link href={`/blog/${post.id}`} className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center">
                    Baca selengkapnya <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link href="/blog">
              <Button variant="outline">
                Lihat Semua Artikel
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
              <div className="mb-4">
                <Logo size="md" className="text-white" />
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
