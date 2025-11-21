'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const blogPosts = [
  {
    id: 1,
    title: "Cara Top Up Mobile Legends Paling Murah & Aman",
    excerpt: "Panduan lengkap top up diamond ML dengan harga termurah dan proses tercepat.",
    image: "📱",
    date: "21 November 2025",
    readTime: "5 menit"
  },
  {
    id: 2,
    title: "Tips Berlangganan Netflix Hemat dengan Voucher",
    excerpt: "Simak trik berlangganan Netflix dengan harga lebih hemat menggunakan voucher digital.",
    image: "🎬",
    date: "20 November 2025",
    readTime: "4 menit"
  },
  {
    id: 3,
    title: "Panduan Keamanan Transaksi Digital untuk Pemula",
    excerpt: "Pelajari cara bertransaksi online yang aman dan terhindar dari penipuan.",
    image: "🔒",
    date: "19 November 2025",
    readTime: "6 menit"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Blog TopUpKilat</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tips & Info Terbaru
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Panduan dan artikel seputar top up, gaming, dan streaming
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                <CardHeader>
                  <div className="text-6xl mb-4 text-center">{post.image}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-xl mb-3 line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Link href={`/blog/${post.id}`}>
                    <Button variant="outline" className="w-full group">
                      Baca Selengkapnya
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
            <h3 className="text-2xl font-bold mb-3">Mulai Top Up Sekarang!</h3>
            <p className="mb-6 opacity-90">
              Proses cepat, harga transparan, dan support 24/7
            </p>
            <Link href="/">
              <Button size="lg" variant="secondary" className="shadow-xl">
                Kembali ke Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
