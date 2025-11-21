'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
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
            <h1 className="text-2xl font-bold">Syarat & Ketentuan</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-950 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Syarat & Ketentuan Layanan</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Terakhir diperbarui: 21 November 2025
          </p>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Pendahuluan</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Selamat datang di TopUpKilat. Dengan mengakses dan menggunakan layanan kami di domain digitexa.biz.id, Anda setuju untuk terikat dengan syarat dan ketentuan berikut. Harap membaca dengan seksama sebelum menggunakan layanan kami.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Definisi</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>&quot;Layanan&quot;</strong> merujuk pada platform top up digital yang disediakan oleh TopUpKilat</li>
                <li><strong>&quot;Pengguna&quot;</strong> merujuk pada setiap individu yang mengakses atau menggunakan layanan kami</li>
                <li><strong>&quot;Produk&quot;</strong> merujuk pada item digital seperti voucher game, streaming, atau e-wallet</li>
                <li><strong>&quot;Transaksi&quot;</strong> merujuk pada proses pembelian produk digital melalui platform kami</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Penggunaan Layanan</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Dengan menggunakan layanan TopUpKilat, Pengguna menyetujui untuk:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Memberikan informasi yang akurat dan lengkap saat melakukan transaksi</li>
                <li>Bertanggung jawab atas keamanan akun dan password (jika terdaftar)</li>
                <li>Menggunakan layanan hanya untuk tujuan yang sah dan legal</li>
                <li>Tidak menyalahgunakan atau memanipulasi sistem kami</li>
                <li>Mematuhi semua hukum dan regulasi yang berlaku di Indonesia</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Proses Pembelian</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>4.1 Pemesanan:</strong> Pengguna memilih produk, memasukkan ID/nomor tujuan, dan menyelesaikan pembayaran melalui metode yang tersedia.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>4.2 Verifikasi:</strong> Pengguna wajib memverifikasi semua detail pemesanan (ID tujuan, nominal, harga) sebelum melakukan pembayaran. Kesalahan input yang sudah diproses tidak dapat dibatalkan.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>4.3 Pembayaran:</strong> Pembayaran dilakukan melalui payment gateway resmi yang kami sediakan. Kami tidak bertanggung jawab atas masalah yang timbul dari penyedia layanan pembayaran pihak ketiga.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>4.4 Pengiriman:</strong> Produk digital akan dikirim secara otomatis ke ID/nomor tujuan setelah pembayaran dikonfirmasi. Waktu pengiriman biasanya 1-5 detik, namun dapat bervariasi tergantung kondisi server provider.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Harga dan Pembayaran</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>5.1 Harga:</strong> Semua harga yang tertera di website sudah termasuk biaya admin dan pajak yang berlaku. Harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>5.2 Metode Pembayaran:</strong> Kami menerima berbagai metode pembayaran termasuk QRIS, e-wallet, transfer bank, dan kartu kredit/debit melalui payment gateway resmi.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>5.3 Konfirmasi Pembayaran:</strong> Pembayaran akan dikonfirmasi secara otomatis oleh sistem. Pengguna akan menerima notifikasi via email setelah pembayaran berhasil.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Kebijakan Refund & Pembatalan</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Untuk informasi lengkap mengenai kebijakan pengembalian dana, silakan baca{' '}
                <Link href="/legal/refund" className="text-blue-600 hover:underline font-semibold">
                  Kebijakan Refund
                </Link>{' '}
                kami.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Secara umum, refund hanya dapat diproses jika: terjadi kesalahan sistem dari pihak kami, produk tidak terkirim setelah pembayaran dikonfirmasi, atau terjadi duplikasi pembayaran.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Hak Kekayaan Intelektual</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Semua konten di website TopUpKilat termasuk namun tidak terbatas pada logo, desain, teks, gambar, dan kode program dilindungi oleh hak cipta. Pengguna dilarang menyalin, memodifikasi, atau mendistribusikan konten tanpa izin tertulis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Batasan Tanggung Jawab</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                TopUpKilat tidak bertanggung jawab atas:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Kesalahan input ID/nomor tujuan yang dilakukan oleh Pengguna</li>
                <li>Gangguan layanan dari provider game/streaming/e-wallet</li>
                <li>Kerugian yang timbul akibat penggunaan layanan pihak ketiga</li>
                <li>Akses tidak sah ke akun Pengguna akibat kelalaian Pengguna</li>
                <li>Force majeure atau keadaan di luar kendali kami</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Privasi Data</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Kami menghormati privasi Pengguna. Informasi lengkap mengenai bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda dapat dibaca di{' '}
                <Link href="/legal/privacy" className="text-blue-600 hover:underline font-semibold">
                  Kebijakan Privasi
                </Link>{' '}
                kami.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Perubahan Syarat & Ketentuan</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku segera setelah dipublikasikan di website. Pengguna disarankan untuk memeriksa halaman ini secara berkala.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Hukum yang Berlaku</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Syarat dan ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap perselisihan akan diselesaikan melalui musyawarah atau jalur hukum yang berlaku di Indonesia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Kontak</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Jika Anda memiliki pertanyaan mengenai Syarat & Ketentuan ini, silakan hubungi kami melalui:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                <li>Email: admin@irvantratechnologies.my.id</li>
                <li>WhatsApp: +62 896-3301-1300</li>
                <li>Halaman: <Link href="/contact" className="text-blue-600 hover:underline">Hubungi Kami</Link></li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Homepage
                </Button>
              </Link>
              <div className="flex gap-4">
                <Link href="/legal/privacy">
                  <Button variant="link">Kebijakan Privasi</Button>
                </Link>
                <Link href="/legal/refund">
                  <Button variant="link">Kebijakan Refund</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
