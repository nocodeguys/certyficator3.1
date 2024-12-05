'use client'

import { useState, useEffect, useRef } from 'react'
import { toPng } from 'html-to-image'
import { Button } from '@/components/ui/button'
import { CertificateTemplate } from '@/components/CertificateTemplate'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Certificate } from '@prisma/client'

export function CertificateViewer({
  certificate,
}: {
  certificate: Certificate
}) {
  const [loading, setLoading] = useState(false)
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const newScale = Math.min(containerWidth / 1920, 1)
        setScale(newScale)
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  const downloadCertificate = async () => {
    try {
      setLoading(true)
      const element = document.getElementById('certificate-container')
      if (!element) throw new Error('Certificate element not found')

      // Wait for images to load
      await Promise.all(
        Array.from(element.getElementsByTagName('img'))
          .map(img => img.complete ? Promise.resolve() : new Promise(resolve => {
            img.onload = resolve
            img.onerror = resolve
          }))
      )

      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 3,
        width: 1920,
        height: 1080,
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      })

      const link = document.createElement('a')
      link.download = `certificate-${certificate.id}.png`
      link.href = dataUrl
      link.click()

      toast({
        title: "Success!",
        description: "Your certificate has been downloaded.",
      })
    } catch (error) {
      console.error('Error generating certificate:', error)
      toast({
        title: "Error",
        description: "Failed to generate certificate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex flex-col items-center justify-center">
      <div ref={containerRef} className="w-full max-w-[1920px] overflow-hidden">
        <div 
          id="certificate-container" 
          className="bg-white w-[1920px] h-[1080px] shadow-lg relative"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <CertificateTemplate {...certificate} />
        </div>
      </div>
      <div className="mt-4">
        <Button
          onClick={downloadCertificate}
          disabled={loading}
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Download Certificate'
          )}
        </Button>
      </div>
    </div>
  )
}

