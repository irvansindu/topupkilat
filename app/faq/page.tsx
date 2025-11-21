'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Bagaimana cara top up di TopUpKilat?',
    answer: 'Cara top up sangat mudah: 1) Pilih game, streaming, atau e-wallet yang kamu inginkan. 2) Masukkan ID/nomor akun tujuan. 3) Pilih nominal yang diinginkan. 4) Masukkan email untuk konfirmasi. 5) Pilih metode pembayaran (QRIS, e-wallet, atau transfer bank). 6) Selesaikan pembayaran. Saldo akan otomatis masuk ke akun kamu dalam hitungan detik.'
  },
  {
    question: 'Berapa lama proses top up?',
    answer: 'Proses top up di TopUpKilat sangat cepat! Setelah pembayaran dikonfirmasi, saldo akan otomatis masuk ke akun kamu dalam 1-5 detik untuk sebagian besar produk. Sistem kami bekerja otomatis 24/7 tanpa jeda.'
  },
  {
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer: 'Kami menyediakan berbagai metode pembayaran untuk kemudahan kamu: QRIS (scan & bayar), E-wallet (GoPay, OVO, DANA, ShopeePay), Transfer Bank (BCA, Mandiri, BNI, BRI), dan Kartu Kredit/Debit. Semua metode pembayaran aman dan terenkripsi.'
  },
  {
    question: 'Apa yang harus saya lakukan jika top up belum masuk?',
    answer: 'Jika top up belum masuk setelah pembayaran berhasil: 1) Tunggu hingga 5 menit karena kadang ada delay dari sistem. 2) Cek status pesanan di menu "Lacak Pesanan" dengan memasukkan kode pesanan dan email. 3) Jika sudah lebih dari 10 menit, hubungi CS kami melalui WhatsApp dengan menyertakan bukti pembayaran dan kode pesanan.'
  },
  {
    question: 'Bagaimana cara memastikan transaksi saya aman?',
    answer: 'Untuk transaksi yang aman, ikuti panduan berikut: 1) Pastikan alamat web dimulai dengan https:// dan ada ikon gembok. 2) JANGAN PERNAH bagikan password, PIN, atau kode OTP ke siapapun - CS resmi tidak akan pernah meminta ini. 3) Gunakan metode pembayaran resmi (QRIS, e-wallet, virtual account). 4) Simpan bukti transaksi. 5) Pakai password yang kuat dan berbeda untuk setiap akun. 6) Waspada terhadap promo yang terlalu menggiurkan. 7) Gunakan jaringan internet yang aman (hindari WiFi publik untuk transaksi). TopUpKilat sendiri menggunakan enkripsi SSL 256-bit, payment gateway resmi, dan sistem otomatis terintegrasi dengan provider resmi untuk melindungi data dan transaksi Anda.'
  },
  {
    question: 'Bagaimana kebijakan refund di TopUpKilat?',
    answer: 'Refund dapat diproses dalam kondisi tertentu: 1) Top up gagal karena kesalahan sistem kami. 2) Saldo tidak masuk setelah konfirmasi pembayaran. 3) Kesalahan input yang belum diproses. Refund tidak dapat dilakukan jika: top up sudah berhasil masuk, kesalahan input ID oleh pembeli setelah proses selesai. Untuk pengajuan refund, hubungi CS kami dengan menyertakan bukti.'
  },
  {
    question: 'Apakah transaksi berjalan otomatis 24/7?',
    answer: 'Ya! Sistem TopUpKilat berjalan otomatis 24 jam setiap hari tanpa libur. Kamu bisa melakukan top up kapan saja, dan saldo akan langsung masuk setelah pembayaran dikonfirmasi. Customer service kami juga siap membantu kamu 24/7 melalui WhatsApp.'
  },
  {
    question: 'Bagaimana cara menghubungi CS TopUpKilat?',
    answer: 'Kamu bisa menghubungi customer service kami melalui: WhatsApp (tersedia di halaman Hubungi Kami), Email support kami, atau Form kontak di website. CS kami siap membantu untuk pertanyaan seputar transaksi, komplain, atau informasi kerjasama.'
  },
  {
    question: 'Apakah ada minimum pembelian?',
    answer: 'Tidak ada minimum pembelian khusus. Kamu bisa membeli sesuai dengan nominal yang tersedia untuk masing-masing produk. Setiap game atau layanan memiliki pilihan nominal yang berbeda-beda, mulai dari yang paling kecil hingga yang paling besar.'
  },
  {
    question: 'Bagaimana jika saya salah memasukkan ID/nomor tujuan?',
    answer: 'Harap berhati-hati saat memasukkan ID/nomor tujuan. Jika top up sudah diproses dan berhasil masuk ke ID yang salah, kami tidak dapat membatalkan atau memindahkan saldo tersebut. Pastikan selalu mengecek kembali ID/nomor sebelum melakukan pembayaran. Gunakan fitur verifikasi ID jika tersedia.'
  },
  {
    question: 'Apa saja yang TIDAK boleh saya bagikan saat transaksi?',
    answer: 'Jangan PERNAH bagikan: 1) Password akun (email, game, e-wallet, bank). 2) PIN ATM atau kartu debit. 3) Kode OTP yang dikirim via SMS/email. 4) CVV kartu kredit (3 digit di belakang kartu) kecuali saat checkout resmi di payment gateway. 5) Foto/scan KTP untuk transaksi yang tidak relevan. CS resmi TopUpKilat TIDAK PERNAH meminta informasi sensitif tersebut. Yang wajar dibagikan hanya: User ID game, nomor HP tujuan, atau email untuk konfirmasi.'
  },
  {
    question: 'Bagaimana cara mengenali website atau penawaran yang mencurigakan?',
    answer: 'Ciri-ciri penipuan online: 1) Harga terlalu murah dan tidak masuk akal. 2) Meminta data sensitif seperti password/OTP via chat atau email. 3) Domain website mirip tapi berbeda (contoh: t0pupkilat.com dengan angka nol). 4) Ada banyak typo atau grammar buruk. 5) Tekanan untuk transaksi cepat dengan dalih "promo terbatas waktu sangat singkat". 6) Diminta transfer ke rekening pribadi, bukan payment gateway resmi. Selalu cek: URL dimulai dengan https://, ada ikon gembok, dan nama domain benar. Ketik alamat website langsung di browser atau gunakan bookmark.'
  },
  {
    question: 'Apakah aman transaksi menggunakan WiFi publik?',
    answer: 'Sebaiknya HINDARI transaksi penting (termasuk top up yang melibatkan pembayaran) saat menggunakan WiFi publik yang tidak jelas keamanannya. Gunakan data seluler atau WiFi pribadi untuk transaksi. Jika terpaksa menggunakan WiFi publik, jangan: 1) Login ke aplikasi bank. 2) Memasukkan data kartu kredit. 3) Transaksi yang melibatkan data sensitif. WiFi publik rentan terhadap penyadapan data oleh pihak tidak bertanggung jawab.'
  },
  {
    question: 'Apa yang harus saya lakukan jika menerima chat/pesan mencurigakan yang mengaku dari TopUpKilat?',
    answer: 'Jika menerima chat/pesan mencurigakan: 1) JANGAN klik link yang dikirim. 2) JANGAN berikan informasi apapun. 3) Cek langsung ke website resmi TopUpKilat (digitexa.biz.id). 4) Hubungi CS resmi kami melalui kontak yang tertera di website (WhatsApp: +62 896-3301-1300 atau email: admin@irvantratechnologies.my.id) untuk konfirmasi. 5) Laporkan chat/pesan tersebut. Ingat: CS resmi tidak akan meminta password, OTP, atau PIN. Kami juga tidak mengirim link pembayaran via chat pribadi yang tidak diminta.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
            <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Temukan jawaban untuk pertanyaan umum seputar TopUpKilat
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg font-semibold text-left flex-1">
                      {faq.question}
                    </CardTitle>
                    <div className="shrink-0">
                      {openIndex === index ? (
                        <ChevronUp className="h-5 w-5 text-blue-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <CardContent className="pt-0 pb-6 px-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                      {faq.answer}
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center p-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold mb-2">Masih ada pertanyaan?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tim customer service kami siap membantu kamu 24/7
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
