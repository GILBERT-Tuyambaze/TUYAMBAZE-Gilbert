import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePWA } from '@/hooks/usePWA'
import { Download, X, Smartphone, Zap } from 'lucide-react'

export default function PWAInstallBanner() {
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

  const handleDismiss = () => {
    setIsDismissed(true)
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 p-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-2xl border-0 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold mb-1">Install TG Developer's Portfolio App</h3>
          <div className="w-7 h-7 rounded-full overflow-hidden border-1 border-border shadow-lg transition-transform duration-300 hover:scale-60">
                <img
                    src="/favicon-16x16.png"
                    alt="Gilbert Tuyambaze"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
              </div>
          <p className="text-xs text-white/90 mb-3">
            Get quick access to full features and view services offline!
          </p>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={handleInstall}
              className="bg-white text-blue-600 hover:bg-white/90 font-medium px-3 py-1 h-8 text-xs rounded-full transition-all duration-300 hover:scale-105"
            >
              <Download className="w-3 h-3 mr-1" />
              Install
              <Zap className="w-3 h-3 ml-1" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
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