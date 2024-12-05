import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import { CertificateViewer } from '@/components/CertificateViewer'

const prisma = new PrismaClient()

export default async function CertificatePage({ params }: { params: { id: string } }) {
  const certificate = await prisma.certificate.findUnique({
    where: { id: params.id },
  })

  if (!certificate) {
    notFound()
  }

  return <CertificateViewer certificate={certificate} />
}

export const dynamic = 'force-dynamic'

