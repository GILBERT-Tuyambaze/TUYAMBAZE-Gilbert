import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePWA } from '@/hooks/usePWA'
import { Download, X, Smartphone, Zap } from 'lucide-react'

export default function PWAInstallBanner() {
  const { t } = useTranslation()
  const { isInstallable, isInstalled, installApp } = usePWA()
  const [isDismissed, setIsDismissed] = useState(false)

  if (!isInstallable || isInstalled || isDismissed) {
    return null
  }

  const handleInstall = async () => {
    const success = await installApp()
    if (success) {
      setIsDismissed(true)
    }
  }

  return (
    <Card className="fixed bottom-3 left-3 right-3 md:left-auto md:right-4 md:w-80 z-50 p-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-2xl border-0 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <Smartphone className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold mb-1">{t('pwa.installTitle')}</h3>
          <p className="text-[11px] text-white/90 mb-3">
            {t('pwa.installDescription')}
          </p>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={handleInstall}
              className="bg-white text-blue-600 hover:bg-white/90 font-medium px-3 py-1 h-8 text-xs rounded-full transition-all duration-300 hover:scale-105"
            >
              <Download className="w-3 h-3 mr-1" />
              {t('pwa.installButton')}
              <Zap className="w-3 h-3 ml-1" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDismissed(true)}
              className="text-white hover:bg-white/20 p-1 h-8 w-8 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
