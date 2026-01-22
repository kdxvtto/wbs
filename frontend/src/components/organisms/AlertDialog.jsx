import { AlertTriangle, XCircle, CheckCircle, Info } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/organisms'
import { Button } from '@/components/atoms'

/**
 * AlertDialog - Pop-up untuk menampilkan notifikasi/pesan
 * 
 * @param {boolean} open - Status dialog terbuka/tertutup
 * @param {function} onOpenChange - Callback saat status berubah
 * @param {string} title - Judul dialog
 * @param {string} message - Pesan yang ditampilkan
 * @param {string} variant - Tipe: 'error' | 'warning' | 'success' | 'info'
 * @param {string} buttonText - Teks tombol (default: 'OK')
 */
export function AlertDialog({
  open,
  onOpenChange,
  title = 'Notifikasi',
  message,
  variant = 'error', // 'error' | 'warning' | 'success' | 'info'
  buttonText = 'OK',
}) {
  const config = {
    error: {
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      bgColor: 'bg-red-100',
      buttonVariant: 'destructive',
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
      bgColor: 'bg-yellow-100',
      buttonVariant: 'default',
    },
    success: {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      bgColor: 'bg-green-100',
      buttonVariant: 'default',
    },
    info: {
      icon: <Info className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-blue-100',
      buttonVariant: 'default',
    },
  }

  const { icon, bgColor, buttonVariant } = config[variant] || config.error

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgColor}`}>
              {icon}
            </div>
            <DialogTitle className="text-lg">{title}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">{message}</p>
        </div>
        <DialogFooter>
          <Button 
            variant={buttonVariant}
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
