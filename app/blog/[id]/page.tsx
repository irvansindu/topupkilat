'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { use } from 'react';

interface BlogPost {
  id: number;
  title: string;
  image: string;
  date: string;
  readTime: string;
  content: string[];
}

const blogPosts: Record<number, BlogPost> = {
  1: {
    id: 1,
    title: "Cara Top Up Mobile Legends Paling Murah & Aman",
    image: "📱",
    date: "21 November 2025",
    readTime: "5 menit",
    content: [
      "Mobile Legends: Bang Bang adalah salah satu game mobile paling populer di Indonesia. Untuk meningkatkan pengalaman bermain, pemain sering membutuhkan diamond untuk membeli skin, hero, dan item premium lainnya.",
      
      "Berikut adalah panduan lengkap cara top up diamond Mobile Legends dengan harga termurah dan paling aman:",
      
      "**1. Pilih Platform Top Up Terpercaya**\nPastikan kamu memilih platform top up yang sudah terpercaya seperti TopUpKilat. Cek review pengguna, pastikan ada customer service yang responsif, dan sistem pembayaran yang aman.",
      
      "**2. Siapkan User ID dan Zone ID**\nSebelum melakukan top up, pastikan kamu sudah mengetahui User ID dan Zone ID akun Mobile Legends kamu. Cara ceknya: buka game ML → klik profil → lihat ID kamu (format: 12345678 (1234)).",
      
      "**3. Pilih Nominal Diamond**\nPilih paket diamond sesuai kebutuhan. TopUpKilat menyediakan berbagai pilihan mulai dari 86 diamond hingga 12000+ diamond dengan harga yang kompetitif.",
      
      "**4. Pilih Metode Pembayaran**\nGunakan metode pembayaran yang paling nyaman untuk kamu. Tersedia QRIS, e-wallet (GoPay, OVO, DANA), transfer bank, dan kartu kredit. Semua metode aman dan terenkripsi.",
      
      "**5. Konfirmasi dan Bayar**\nSetelah memilih metode pembayaran, selesaikan proses checkout. Diamond akan otomatis masuk ke akun kamu dalam 1-5 detik setelah pembayaran dikonfirmasi.",
      
      "**Tips Hemat Top Up ML:**\n• Manfaatkan promo dan diskon yang tersedia\n• Top up dalam jumlah besar untuk harga per diamond yang lebih murah\n• Gunakan kode promo jika tersedia\n• Cek perbandingan harga di platform terpercaya\n• Jangan tergiur harga murah dari sumber tidak jelas",
      
      "**Keamanan Saat Top Up:**\nPastikan selalu double check User ID sebelum checkout, gunakan email aktif untuk konfirmasi, simpan bukti transaksi, dan jangan share informasi akun ke pihak lain.",
      
      "Dengan mengikuti panduan ini, kamu bisa top up diamond Mobile Legends dengan aman, cepat, dan dengan harga termurah. Selamat bermain!"
    ]
  },
  2: {
    id: 2,
    title: "Tips Berlangganan Netflix Hemat dengan Voucher",
    image: "🎬",
    date: "20 November 2025",
    readTime: "4 menit",
    content: [
      "Netflix adalah platform streaming terpopuler dengan ribuan konten film, series, dokumenter, dan anime. Namun, biaya berlangganan bulanan bisa cukup menguras kantong jika tidak pintar-pintar mengatur.",
      
      "Berikut tips berlangganan Netflix dengan lebih hemat menggunakan voucher digital:",
      
      "**1. Gunakan Voucher Netflix Digital**\nDaripada berlangganan langsung dengan kartu kredit yang auto-renewal, kamu bisa menggunakan voucher Netflix digital. Keuntungannya: kontrol pengeluaran lebih baik, tidak perlu kartu kredit, dan sering ada promo cashback.",
      
      "**2. Pilih Paket yang Sesuai Kebutuhan**\nNetflix menyediakan beberapa paket: Mobile (ponsel only), Basic (1 layar SD), Standard (2 layar HD), dan Premium (4 layar UHD). Pilih sesuai jumlah pengguna dan kualitas yang kamu butuhkan.",
      
      "**3. Patungan dengan Teman/Keluarga**\nPaket Standard dan Premium memungkinkan beberapa layar sekaligus. Kamu bisa patungan dengan teman atau keluarga untuk split biaya. Pastikan trust dengan orang yang patungan.",
      
      "**4. Manfaatkan Promo Platform Top Up**\nPlatform seperti TopUpKilat sering memberikan promo cashback, diskon, atau bonus voucher untuk pembelian voucher Netflix. Pantau terus promo yang ada.",
      
      "**5. Beli Voucher Saat Ada Diskon**\nBeberapa waktu tertentu (harbolnas, tanggal kembar, dll) biasanya ada diskon voucher digital. Kamu bisa stock voucher untuk beberapa bulan ke depan.",
      
      "**6. Hindari Auto-Renewal yang Lupa Dicancel**\nSalah satu penyebab boros adalah lupa cancel auto-renewal padahal sudah jarang nonton. Dengan voucher, kamu bayar saat perlu saja.",
      
      "**Perbandingan Harga Paket Netflix Indonesia:**\n• Mobile: Rp 54.000/bulan (1 layar, SD, ponsel only)\n• Basic: Sudah tidak tersedia untuk user baru\n• Standard: Rp 120.000/bulan (2 layar, Full HD)\n• Premium: Rp 186.000/bulan (4 layar, Ultra HD + HDR)",
      
      "**Cara Redeem Voucher Netflix:**\n1. Buka netflix.com/redeem\n2. Login ke akun Netflix kamu\n3. Masukkan kode voucher 11 digit\n4. Klik Redeem\n5. Masa aktif akan otomatis bertambah",
      
      "Dengan tips di atas, kamu bisa berlangganan Netflix dengan lebih hemat dan tetap menikmati konten favorit tanpa khawatir tagihan membengkak!"
    ]
  },
  3: {
    id: 3,
    title: "Panduan Keamanan Transaksi Digital untuk Pemula",
    image: "🔒",
    date: "19 November 2025",
    readTime: "6 menit",
    content: [
      "Di era digital ini, transaksi online sudah menjadi kebutuhan sehari-hari. Namun, seiring kemudahan yang ditawarkan, risiko penipuan dan kebocoran data juga meningkat. Panduan ini akan membantu kamu bertransaksi online dengan lebih aman.",
      
      "**1. Kenali Platform yang Terpercaya**\nSebelum melakukan transaksi, pastikan platform yang kamu gunakan memiliki: reputasi baik dengan banyak review positif, kontak customer service yang jelas dan responsif, sistem pembayaran yang aman (SSL/HTTPS), dan informasi perusahaan yang transparan.",
      
      "**2. Cek Sertifikat Keamanan Website**\nPastikan URL website dimulai dengan 'https://' (bukan 'http://') yang menandakan adanya enkripsi SSL. Klik ikon gembok di address bar untuk melihat sertifikat keamanan. Hindari website yang browser tandai sebagai 'Not Secure'.",
      
      "**3. Gunakan Metode Pembayaran yang Aman**\nMetode pembayaran yang aman antara lain: payment gateway resmi (Midtrans, Xendit, dll), QRIS dari merchant terdaftar, e-wallet resmi (GoPay, OVO, DANA, ShopeePay), dan virtual account dari bank terpercaya. Hindari transfer langsung ke rekening pribadi untuk transaksi besar.",
      
      "**4. Jangan Bagikan Data Sensitif**\nJangan pernah share: PIN kartu ATM/debit, CVV kartu kredit (kecuali saat checkout resmi), password email atau akun, OTP/kode verifikasi ke pihak lain, dan foto/scan KTP untuk transaksi yang tidak relevan.",
      
      "**5. Waspadai Phishing dan Penipuan**\nCiri-ciri penipuan online: harga terlalu murah (tidak masuk akal), meminta data sensitif via chat/email, website mirip tapi beda domain (misalnya: t0pupkilat.com), ada typo atau grammar buruk, dan tekanan untuk transaksi cepat 'promo terbatas'.",
      
      "**6. Verifikasi Sebelum Bayar**\nSelalu cek kembali: detail produk/layanan yang dibeli, nomor/ID tujuan (untuk top up), total pembayaran, dan metode pembayaran. Jangan terburu-buru, pastikan semua detail benar sebelum konfirmasi.",
      
      "**7. Simpan Bukti Transaksi**\nSetelah transaksi: screenshot bukti pembayaran, simpan email konfirmasi, catat nomor/kode transaksi, dan simpan chat dengan customer service jika ada masalah.",
      
      "**8. Aktifkan 2FA (Two-Factor Authentication)**\nUntuk akun-akun penting (email, e-wallet, banking), aktifkan 2FA atau verifikasi 2 langkah untuk keamanan ekstra.",
      
      "**9. Update Software Security**\nPastikan: browser selalu update ke versi terbaru, OS (Windows/Android/iOS) up to date, antivirus aktif dan ter-update, dan gunakan password manager untuk password yang kuat dan unik.",
      
      "**10. Tahu Hak Konsumen Digital**\nKamu berhak: mendapat informasi jelas tentang produk/layanan, refund jika terjadi kesalahan sistem, privasi data dijaga sesuai UU PDP, dan komplain jika layanan tidak sesuai.",
      
      "**Apa yang Dilakukan Jika Terjadi Masalah?**\n1. Segera hubungi customer service platform dengan bukti transaksi\n2. Laporkan ke penyedia payment gateway jika ada transaksi mencurigakan\n3. Ganti password akun jika dicurigai bocor\n4. Laporkan ke OJK atau Kominfo jika platform tidak responsif\n5. Blokir kartu/rekening jika terjadi fraud",
      
      "**TopUpKilat dan Keamanan:**\nTopUpKilat menggunakan enkripsi SSL 256-bit, payment gateway resmi Midtrans, sistem otomatis tanpa human error, data pribadi tersimpan aman, dan customer service 24/7 siap membantu.",
      
      "Dengan mengikuti panduan keamanan di atas, kamu bisa bertransaksi digital dengan lebih tenang dan terhindar dari risiko penipuan. Stay safe dan happy shopping!"
    ]
  }
};

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const postId = parseInt(id);
  const post = blogPosts[postId];

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Artikel yang kamu cari tidak tersedia.
          </p>
          <Link href="/blog">
            <Button>Kembali ke Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/blog">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <span className="text-sm text-gray-500">Kembali ke Blog</span>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Article Header */}
          <div className="text-center mb-8">
            <div className="text-7xl mb-6">{post.image}</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime} baca
              </span>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white dark:bg-slate-950 rounded-lg p-8 shadow-lg">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {post.content.map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {paragraph.split('**').map((text, i) => 
                    i % 2 === 0 ? text : <strong key={i}>{text}</strong>
                  )}
                </p>
              ))}
            </div>

            {/* Share */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Bagikan artikel ini:</span>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-8 text-center">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Blog
              </Button>
            </Link>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-3">Siap Top Up?</h3>
            <p className="mb-6 opacity-90">
              Mulai top up game, streaming, atau e-wallet favoritmu sekarang!
            </p>
            <Link href="/">
              <Button size="lg" variant="secondary">
                Top Up Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
