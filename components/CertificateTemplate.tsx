import { Certificate } from '@prisma/client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export function CertificateTemplate(certificate: Certificate) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [awardIconSrc, setAwardIconSrc] = useState<string>('');
  const [logoSrc, setLogoSrc] = useState<string>('');
  const [signatureSrc, setSignatureSrc] = useState<string>('');

  useEffect(() => {
    const loadImages = async () => {
      try {
        const [awardIconData, logoData, signatureData] = await Promise.all([
          fetch('/images/ni-award.svg').then(res => res.text()),
          fetch('/images/logo-dobra.png').then(res => res.blob()),
          fetch('/images/signature.svg').then(res => res.text())
        ]);

        const awardIconBase64 = btoa(awardIconData);
        setAwardIconSrc(`data:image/svg+xml;base64,${awardIconBase64}`);

        const signatureBase64 = btoa(signatureData);
        setSignatureSrc(`data:image/svg+xml;base64,${signatureBase64}`);

        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoSrc(reader.result as string);
        };
        reader.readAsDataURL(logoData);

        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading images:', error);
        setImagesLoaded(true);
      }
    };

    loadImages();
  }, []);

  if (!imagesLoaded) {
    return <div className="absolute inset-0 p-24 bg-[#EEEEEE]">Loading...</div>;
  }

  return (
    <>
      <style jsx global>{`
        @font-face {
          font-family: 'Barlow';
          src: url('/fonts/Barlow-Regular.ttf') format('truetype');
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: 'Barlow';
          src: url('/fonts/Barlow-Medium.ttf') format('truetype');
          font-weight: 500;
          font-style: normal;
        }
        @font-face {
          font-family: 'Barlow';
          src: url('/fonts/Barlow-SemiBold.ttf') format('truetype');
          font-weight: 600;
          font-style: normal;
        }
        @font-face {
          font-family: 'Barlow';
          src: url('/fonts/Barlow-Bold.ttf') format('truetype');
          font-weight: 700;
          font-style: normal;
        }
      `}</style>
      <div className="absolute inset-0 p-24 bg-[#EEEEEE]" style={{ fontFamily: 'Barlow, sans-serif' }}>
        {/* Top Logos */}
        <div className="flex justify-between items-start mb-32">
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 bg-[#4185F3] rounded-full flex items-center justify-center">
              {awardIconSrc && (
                <img 
                  src={awardIconSrc}
                  alt="Award Icon"
                  style={{ 
                    width: '84px',
                    height: '84px'
                  }}
                  className="text-black"
                />
              )}
            </div>
            <span className="text-4xl text-gray-700">Akademia Dobrej Treści</span>
          </div>
          <div className="absolute top-24 right-24 w-[200px] h-[100px]">
            {logoSrc && (
              <img
                src={logoSrc}
                alt="Dobra Treść Logo"
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            )}
          </div>
        </div>

        {/* Certificate Content */}
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl text-gray-900">Certyfikat ukończenia</h1>
            <h2 className="text-7xl font-bold text-gray-900 mt-4">{certificate.courseName}</h2>
          </div>

          <div className="text-6xl text-[#4185F3] font-semibold">
            {certificate.participantName}
          </div>

          <p className="text-3xl text-gray-600 max-w-4xl leading-relaxed">
            {certificate.courseDescription}
          </p>

          {/* Signature Area */}
          <div className="mt-40 pt-16">
            {signatureSrc && (
              <div className="mb-4">
                <img
                  src={signatureSrc}
                  alt="Signature"
                  style={{ 
                    width: '200px',
                    height: '50px'
                  }}
                />
              </div>
            )}
            <div className="border-b-2 border-gray-400 w-96 mb-4"></div>
            <div className="flex justify-between items-end text-2xl">
              <div className="text-gray-900">
                Autorka kursu: {certificate.authorName}
              </div>
              <div className="text-gray-900">
                Rok ukończenia: {new Date(certificate.completionDate).getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}