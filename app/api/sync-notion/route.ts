import { NextResponse } from 'next/server'
import { syncNotionData } from '@/lib/notion'

export async function GET() {
  try {
    await syncNotionData()
    return NextResponse.json({ message: 'Notion data synced successfully' }, { status: 200 })
  } catch (error) {
    console.error('Failed to sync Notion data:', error)
    return NextResponse.json({ error: 'Failed to sync Notion data' }, { status: 500 })
  }
}

