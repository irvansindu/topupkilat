'use client';

import Link from 'next/link';
import { ArrowLeft, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RefundPage() {
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
            <h1 className="text-2xl font-bold">Kebijakan Refund</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-950 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Kebijakan Pengembalian Dana (Refund)</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Terakhir diperbarui: 21 November 2025
          </p>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Pendahuluan</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                TopUpKilat berkomitmen untuk memberikan layanan terbaik dan menangani setiap transaksi dengan profesional. Kebijakan refund ini menjelaskan kondisi dan prosedur pengembalian dana untuk transaksi yang bermasalah.
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    Refund DAPAT Diproses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>✅ Top up gagal karena kesalahan sistem kami</li>
                    <li>✅ Saldo tidak masuk setelah pembayaran dikonfirmasi</li>
                    <li>✅ Terjadi duplikasi pembayaran untuk order yang sama</li>
                    <li>✅ Server provider down dan tidak memproses dalam 24 jam</li>
                    <li>✅ Kesalahan harga/nominal yang ditampilkan di sistem</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <XCircle className="h-5 w-5" />
                    Refund TIDAK DAPAT Diproses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>❌ Kesalahan input ID/nomor tujuan oleh pembeli</li>
                    <li>❌ Top up sudah berhasil masuk ke akun tujuan</li>
                    <li>❌ Pengguna berubah pikiran setelah transaksi selesai</li>
                    <li>❌ Akun game/platform di-banned oleh provider</li>
                    <li>❌ Permintaan refund setelah lebih dari 7 hari</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Ketentuan Umum Refund</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>2.1 Waktu Pengajuan:</strong> Permintaan refund harus diajukan maksimal 7 hari sejak tanggal transaksi.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>2.2 Verifikasi:</strong> Semua permintaan refund akan diverifikasi oleh tim kami. Kami berhak meminta bukti tambahan atau informasi pendukung.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>2.3 Waktu Proses:</strong> Refund yang disetujui akan diproses dalam 3-7 hari kerja. Dana akan dikembalikan ke metode pembayaran yang sama.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>2.4 Biaya Admin:</strong> Untuk refund yang disebabkan kesalahan pembeli (jika memenuhi syarat khusus), dapat dikenakan biaya administrasi 5-10% dari nilai transaksi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Prosedur Pengajuan Refund</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Langkah-langkah Pengajuan Refund:
                </h3>
                <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 shrink-0">1.</span>
                    <span>Hubungi customer service kami melalui WhatsApp atau email dalam waktu maksimal 7 hari sejak transaksi</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 shrink-0">2.</span>
                    <span>Sertakan informasi berikut:
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Kode pesanan (Order Code)</li>
                        <li>Email yang digunakan saat transaksi</li>
                        <li>Screenshot bukti pembayaran</li>
                        <li>Screenshot bukti saldo belum masuk (jika ada)</li>
                        <li>Deskripsi masalah secara detail</li>
                      </ul>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 shrink-0">3.</span>
                    <span>Tim kami akan melakukan investigasi dan verifikasi (1-3 hari kerja)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 shrink-0">4.</span>
                    <span>Anda akan mendapat notifikasi via email mengenai status pengajuan refund</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 shrink-0">5.</span>
                    <span>Jika disetujui, dana akan dikembalikan dalam 3-7 hari kerja</span>
                  </li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Kondisi Khusus</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>4.1 Kesalahan Input ID:</strong> Untuk kesalahan input ID/nomor tujuan, refund TIDAK dapat diproses jika top up sudah berhasil masuk ke ID yang salah. Kami mendorong pengguna untuk selalu double-check sebelum checkout.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>4.2 Gangguan Provider:</strong> Jika terjadi gangguan dari provider game/streaming yang menyebabkan delay, kami akan menunggu hingga 24 jam. Jika setelah 24 jam masih belum masuk, refund dapat diproses.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>4.3 Promo & Diskon:</strong> Untuk transaksi dengan promo/diskon, refund akan dikembalikan sesuai dengan harga yang dibayarkan (setelah diskon).
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>4.4 Kasus Force Majeure:</strong> Dalam kondisi force majeure (bencana alam, perang, gangguan internet massal, dll), kebijakan refund dapat disesuaikan sesuai situasi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Metode Pengembalian Dana</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Dana akan dikembalikan melalui metode yang sama dengan pembayaran awal:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>E-wallet:</strong> Refund kembali ke e-wallet yang digunakan (1-3 hari kerja)</li>
                <li><strong>Transfer Bank:</strong> Refund ke rekening bank (3-7 hari kerja)</li>
                <li><strong>QRIS:</strong> Refund ke sumber pembayaran QRIS (3-5 hari kerja)</li>
                <li><strong>Kartu Kredit/Debit:</strong> Refund ke kartu yang digunakan (5-14 hari kerja tergantung bank)</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Jika metode pembayaran awal tidak memungkinkan untuk refund, kami akan menghubungi Anda untuk alternatif pengembalian dana.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Penolakan Refund</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Kami berhak menolak permintaan refund jika:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Permintaan diajukan setelah lebih dari 7 hari sejak transaksi</li>
                <li>Bukti yang diberikan tidak lengkap atau tidak valid</li>
                <li>Terdeteksi adanya indikasi fraud atau penyalahgunaan</li>
                <li>Top up sudah berhasil masuk dan tidak ada kesalahan dari sistem kami</li>
                <li>Permintaan tidak sesuai dengan kebijakan refund yang berlaku</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Keputusan kami mengenai refund bersifat final. Namun, Anda dapat mengajukan banding dengan menyertakan bukti tambahan yang relevan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Tips Menghindari Masalah Transaksi</h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>✓ Selalu double-check ID/nomor tujuan sebelum checkout</li>
                  <li>✓ Gunakan fitur verifikasi ID jika tersedia</li>
                  <li>✓ Simpan bukti transaksi dan kode pesanan</li>
                  <li>✓ Gunakan email aktif untuk menerima konfirmasi</li>
                  <li>✓ Pastikan koneksi internet stabil saat transaksi</li>
                  <li>✓ Hubungi CS jika ada keraguan sebelum checkout</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Kontak untuk Refund</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Untuk pengajuan refund atau pertanyaan terkait, silakan hubungi:
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <p className="font-semibold mb-2">Customer Service TopUpKilat</p>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                  <li>WhatsApp: +62 896-3301-1300 (Respon cepat 24/7)</li>
                  <li>Email: admin@irvantratechnologies.my.id</li>
                  <li>Halaman: <Link href="/contact" className="text-blue-600 hover:underline">Hubungi Kami</Link></li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  Sertakan kode pesanan dan email transaksi saat menghubungi kami untuk proses yang lebih cepat.
                </p>
              </div>
            </section>

            <section className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Komitmen Kami
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                TopUpKilat berkomitmen untuk memberikan layanan terbaik dan menangani setiap kasus refund secara adil dan transparan. Kepuasan dan kepercayaan Anda adalah prioritas kami. Jika Anda mengalami masalah, jangan ragu untuk menghubungi tim customer service kami yang siap membantu 24/7.
              </p>
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
                <Link href="/legal/privacy">
                  <Button variant="link">Kebijakan Privasi</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
