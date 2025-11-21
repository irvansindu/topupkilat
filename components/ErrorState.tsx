import { AlertCircle, MessageCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showSupport?: boolean;
}

export function ErrorState({
  title = "Oops, terjadi kesalahan saat memuat data",
  message = "Silakan coba beberapa saat lagi atau hubungi CS kami jika masalah berlanjut.",
  onRetry,
  showSupport = true
}: ErrorStateProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_CS_WHATSAPP || '6289633011300';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Halo%20TopUpKilat%2C%20saya%20mengalami%20kendala%20teknis%20di%20website`;

  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center py-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            {message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {onRetry && (
              <Button 
                onClick={onRetry}
                variant="default"
                className="w-full sm:w-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Coba Lagi
              </Button>
            )}
            
            {showSupport && (
              <Button 
                asChild
                variant="outline"
                className="w-full sm:w-auto"
              >
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Hubungi CS
                </a>
              </Button>
            )}
          </div>
          
          {showSupport && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
              Tim support kami siap membantu 24/7
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
