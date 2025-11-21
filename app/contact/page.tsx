'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Show thank you message
    setSubmitted(true);
    // Reset form after 5 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', whatsapp: '', message: '' });
      setSubmitted(false);
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            <h1 className="text-2xl font-bold">Hubungi Kami</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ada Yang Bisa Kami Bantu?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Tim customer service TopUpKilat siap membantu untuk pertanyaan, bantuan transaksi, komplain, atau kerjasama
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    WhatsApp
                  </CardTitle>
                  <CardDescription>
                    Hubungi kami via WhatsApp untuk respon cepat
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="https://wa.me/6289633011300"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-green-600 hover:text-green-700"
                  >
                    +62 896-3301-1300
                  </a>
                  <p className="text-sm text-gray-500 mt-2">
                    Klik untuk chat langsung
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Email
                  </CardTitle>
                  <CardDescription>
                    Kirim email untuk pertanyaan detail atau kerjasama
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="mailto:admin@irvantratechnologies.my.id"
                    className="text-lg font-semibold text-blue-600 hover:text-blue-700"
                  >
                    admin@irvantratechnologies.my.id
                  </a>
                  <p className="text-sm text-gray-500 mt-2">
                    Kami akan membalas dalam 1x24 jam
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Jam Operasional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Senin - Minggu</span>
                      <span className="font-semibold">24 Jam</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Sistem otomatis berjalan 24/7. Customer service available untuk chat WhatsApp.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Kirim Pesan</CardTitle>
                <CardDescription>
                  Isi form di bawah ini dan kami akan segera merespon
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                    <div className="text-green-600 dark:text-green-400 mb-2">
                      <Mail className="h-12 w-12 mx-auto mb-3" />
                      <h3 className="text-lg font-bold">Terima Kasih!</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Fitur pengiriman pesan sedang dalam pengembangan. Untuk saat ini silakan hubungi kami langsung via WhatsApp atau email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-medium mb-2">
                        Nomor WhatsApp (Opsional)
                      </label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="08xxxxxxxxxx"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Pesan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <Send className="mr-2 h-4 w-4" />
                      Kirim Pesan
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
