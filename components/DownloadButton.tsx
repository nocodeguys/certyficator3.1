'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import html2canvas from 'html2canvas'

export function DownloadButton({ certificateId }: { certificateId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async (format: 'png' | 'jpg') => {
    setIsLoading(true)
    try {
      const certificateElement = document.getElementById('certificate-container')
      if (!certificateElement) {
        throw new Error('Certificate container not found')
      }

      // Wait for images to load
      await Promise.all(
        Array.from(certificateElement.getElementsByTagName('img'))
          .filter(img => !img.complete)
          .map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))
      )

      // Prepare the element for high-quality capture
      const originalStyles = certificateElement.style.cssText
      certificateElement.style.transform = 'none'
      certificateElement.style.width = '1920px'
      certificateElement.style.height = '1080px'

      const canvas = await html2canvas(certificateElement, {
        scale: 2, // Increase scale for higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 1920,
        height: 1080,
        onclone: (clonedDoc, clonedElement) => {
          clonedElement.style.transform = 'none'
          clonedElement.style.width = '1920px'
          clonedElement.style.height = '1080px'
          Array.from(clonedElement.getElementsByTagName('img')).forEach(img => {
            img.style.maxWidth = 'none'
          })
        }
      })

      // Restore original styles
      certificateElement.style.cssText = originalStyles

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob!),
          `image/${format}`,
          format === 'jpg' ? 0.95 : undefined // High quality for JPEG
        )
      })

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `certificate-${certificateId}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating certificate image:', error)
      alert('An error occurred while generating the certificate image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-x-4">
      <Button 
        onClick={() => handleDownload('png')}
        disabled={isLoading}
        className="bg-[#14161A] text-white hover:bg-[#2a2e35]"
      >
        <Download className="mr-2 h-4 w-4" />
        {isLoading ? 'Generating...' : 'Download as PNG'}
      </Button>
      <Button 
        onClick={() => handleDownload('jpg')}
        disabled={isLoading}
        className="bg-[#14161A] text-white hover:bg-[#2a2e35]"
      >
        <Download className="mr-2 h-4 w-4" />
        {isLoading ? 'Generating...' : 'Download as JPG'}
      </Button>
    </div>
  )
}

