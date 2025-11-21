'use client';

import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);
  
  const whatsappNumber = process.env.NEXT_PUBLIC_CS_WHATSAPP || '6289633011300';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Halo%20TopUpKilat%2C%20saya%20butuh%20bantuan`;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Quick Actions Popup */}
        {isOpen && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-4 w-64 border border-gray-200 dark:border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
            <div className="mb-3">
              <h4 className="font-semibold text-sm mb-1">Butuh Bantuan?</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Tim kami siap membantu 24/7
              </p>
            </div>
            
            <div className="space-y-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group border border-transparent hover:border-green-200 dark:hover:border-green-800"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm group-hover:text-green-600 dark:group-hover:text-green-400">
                    Chat WhatsApp
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Respon cepat
                  </p>
                </div>
              </a>
              
              <a
                href="/order/lookup"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Lacak Pesanan
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cek status top up
                  </p>
                </div>
              </a>
              
              <a
                href="/faq"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    FAQ
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Pertanyaan umum
                  </p>
                </div>
              </a>
            </div>
          </div>
        )}
        
        {/* Main Button */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-200 ${
            isOpen
              ? 'bg-gray-600 hover:bg-gray-700'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
          } hover:scale-110`}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </div>
    </>
  );
}
