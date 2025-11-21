import Link from 'next/link';
import { Home, Search, Gamepad2, Wallet, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau mungkin sudah dipindahkan.
        </p>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Link href="/" className="block">
                <Home className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Kembali ke Homepage</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mulai dari halaman utama
                </p>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Link href="/topup/game" className="block">
                <Gamepad2 className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Top Up Game</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mobile Legends, Free Fire, PUBG
                </p>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Link href="/topup/ewallet" className="block">
                <Wallet className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Top Up E-Wallet</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  OVO, DANA, GoPay, ShopeePay
                </p>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Link href="/contact" className="block">
                <MessageCircle className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Hubungi Kami</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customer service siap membantu
                </p>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="mr-2 h-5 w-5" />
              Kembali ke Homepage
            </Button>
          </Link>
          <Link href="/order/lookup">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Search className="mr-2 h-5 w-5" />
              Lacak Pesanan
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Butuh bantuan?{' '}
          <Link href="/contact" className="text-blue-600 hover:underline font-semibold">
            Hubungi customer service kami
          </Link>
        </p>
      </div>
    </div>
  );
}
