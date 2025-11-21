'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
            <h1 className="text-2xl font-bold">Kebijakan Privasi</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-950 rounded-lg shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-10 w-10 text-blue-600" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Kebijakan Privasi</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Terakhir diperbarui: 21 November 2025
              </p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Pendahuluan</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                TopUpKilat (&quot;kami&quot;, &quot;kita&quot;) berkomitmen untuk melindungi privasi dan data pribadi pengguna (&quot;Anda&quot;). Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami di digitexa.biz.id.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Informasi yang Kami Kumpulkan</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>2.1 Informasi yang Anda Berikan:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li>Email address untuk konfirmasi transaksi</li>
                <li>ID game/nomor akun tujuan top up</li>
                <li>Nomor WhatsApp untuk komunikasi customer service (opsional)</li>
                <li>Informasi akun jika Anda mendaftar (nama, password)</li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>2.2 Informasi yang Dikumpulkan Otomatis:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li>Alamat IP dan informasi perangkat</li>
                <li>Browser dan sistem operasi yang digunakan</li>
                <li>Riwayat transaksi dan aktivitas di platform</li>
                <li>Cookie dan teknologi pelacakan serupa</li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>2.3 Informasi dari Pihak Ketiga:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Data pembayaran dari payment gateway (Midtrans, dll)</li>
                <li>Informasi verifikasi dari provider game/streaming</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Penggunaan Informasi</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Kami menggunakan informasi yang dikumpulkan untuk:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Memproses transaksi dan mengirimkan produk digital ke tujuan</li>
                <li>Mengirim konfirmasi dan notifikasi status transaksi</li>
                <li>Memberikan dukungan customer service</li>
                <li>Mencegah fraud dan aktivitas mencurigakan</li>
                <li>Meningkatkan layanan dan pengalaman pengguna</li>
                <li>Mematuhi kewajiban hukum dan regulasi</li>
                <li>Mengirim informasi promosi (dengan persetujuan Anda)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Pembagian Informasi</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Kami TIDAK menjual data pribadi Anda. Namun, kami dapat membagikan informasi dengan:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Provider Game/Streaming:</strong> ID tujuan untuk pengiriman produk</li>
                <li><strong>Payment Gateway:</strong> Informasi pembayaran untuk memproses transaksi</li>
                <li><strong>Pihak Berwenang:</strong> Jika diwajibkan oleh hukum atau permintaan resmi</li>
                <li><strong>Penyedia Layanan Pihak Ketiga:</strong> Untuk mendukung operasional (hosting, analytics, email service) dengan perjanjian kerahasiaan</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Keamanan Data</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Kami menerapkan berbagai langkah keamanan untuk melindungi data Anda:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Enkripsi SSL 256-bit:</strong> Semua data yang ditransmisikan dienkripsi</li>
                <li><strong>Server Aman:</strong> Data disimpan di server dengan proteksi firewall dan sistem keamanan berlapis</li>
                <li><strong>Akses Terbatas:</strong> Hanya staff yang berwenang yang dapat mengakses data pribadi</li>
                <li><strong>Monitoring 24/7:</strong> Sistem kami dipantau untuk mendeteksi aktivitas mencurigakan</li>
                <li><strong>Backup Rutin:</strong> Data di-backup secara berkala untuk mencegah kehilangan data</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Meskipun kami berupaya maksimal, tidak ada sistem yang 100% aman. Kami mendorong Anda untuk menjaga keamanan akun dan password Anda.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Cookie dan Teknologi Pelacakan</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Kami menggunakan cookie dan teknologi serupa untuk:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Menyimpan preferensi dan pengaturan Anda</li>
                <li>Menganalisis traffic dan penggunaan website</li>
                <li>Meningkatkan fungsionalitas dan keamanan</li>
                <li>Menampilkan iklan yang relevan (jika ada)</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Anda dapat mengatur browser untuk menolak cookie, namun beberapa fitur website mungkin tidak berfungsi optimal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Hak Pengguna</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Sesuai dengan UU Perlindungan Data Pribadi (UU PDP) Indonesia, Anda memiliki hak untuk:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Akses:</strong> Meminta salinan data pribadi yang kami simpan</li>
                <li><strong>Koreksi:</strong> Memperbarui atau memperbaiki data yang tidak akurat</li>
                <li><strong>Penghapusan:</strong> Meminta penghapusan data (dengan syarat tertentu)</li>
                <li><strong>Pembatasan:</strong> Membatasi pemrosesan data pribadi Anda</li>
                <li><strong>Portabilitas:</strong> Menerima data dalam format yang dapat dibaca mesin</li>
                <li><strong>Keberatan:</strong> Menolak penggunaan data untuk tujuan tertentu (misalnya marketing)</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Untuk menggunakan hak-hak ini, silakan hubungi kami melalui email: support@topupkilat.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Penyimpanan Data</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Kami menyimpan data pribadi Anda selama diperlukan untuk tujuan yang dijelaskan dalam kebijakan ini, atau sesuai dengan kewajiban hukum. Data transaksi disimpan minimal 5 tahun untuk keperluan audit dan kepatuhan regulasi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Transfer Data Internasional</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Data Anda dapat disimpan di server yang berlokasi di Indonesia atau negara lain dengan standar perlindungan data yang memadai. Kami memastikan transfer data dilakukan sesuai dengan regulasi yang berlaku.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Privasi Anak-anak</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Layanan kami tidak ditujukan untuk anak-anak di bawah usia 13 tahun. Kami tidak dengan sengaja mengumpulkan informasi pribadi dari anak-anak. Jika Anda orang tua dan mengetahui anak Anda memberikan data kepada kami, silakan hubungi kami.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Perubahan Kebijakan Privasi</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan kami informasikan melalui email atau notifikasi di website. Anda disarankan untuk meninjau halaman ini secara berkala.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Kontak</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Jika Anda memiliki pertanyaan, keluhan, atau permintaan terkait privasi dan data pribadi, silakan hubungi:
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <p className="font-semibold mb-2">Data Protection Officer - TopUpKilat</p>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Email: admin@irvantratechnologies.my.id</li>
                  <li>WhatsApp: +62 896-3301-1300</li>
                  <li>Halaman: <Link href="/contact" className="text-blue-600 hover:underline">Hubungi Kami</Link></li>
                </ul>
              </div>
            </section>

            <section className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6 border">
              <h3 className="text-xl font-bold mb-3">Ringkasan Komitmen Kami</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>✅ Kami menggunakan enkripsi SSL 256-bit untuk melindungi data Anda</li>
                <li>✅ Kami TIDAK menjual data pribadi Anda kepada pihak ketiga</li>
                <li>✅ Anda memiliki kontrol penuh atas data pribadi Anda</li>
                <li>✅ Kami patuh terhadap UU Perlindungan Data Pribadi Indonesia</li>
                <li>✅ Tim kami siap membantu pertanyaan terkait privasi 24/7</li>
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
                <Link href="/legal/terms">
                  <Button variant="link">Syarat & Ketentuan</Button>
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
