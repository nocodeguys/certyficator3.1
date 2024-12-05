import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const participantName = formData.get('participantName') as string
    const courseName = formData.get('courseName') as string
    const courseDescription = formData.get('courseDescription') as string
    const authorName = formData.get('authorName') as string
    const completionDate = formData.get('completionDate') as string
    const companyLogo = formData.get('companyLogo') as File | null

    // Here you would handle the file upload for companyLogo
    // For this example, we'll just store the filename
    const companyLogoFilename = companyLogo ? companyLogo.name : null

    const certificate = await prisma.certificate.create({
      data: {
        participantName,
        courseName,
        courseDescription: courseDescription || undefined,
        authorName: authorName || undefined,
        completionDate: new Date(completionDate),
        companyLogo: companyLogoFilename || undefined,
      },
    })

    return NextResponse.json({ id: certificate.id }, { status: 201 })
  } catch (error) {
    console.error('Failed to create certificate:', error)
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 })
  }
}

