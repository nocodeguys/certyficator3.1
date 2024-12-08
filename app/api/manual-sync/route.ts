import { NextResponse } from 'next/server'
import { syncNotionData } from '@/lib/notion'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  
  if (token !== process.env.MANUAL_SYNC_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('Manual Notion sync started:', new Date().toISOString())
  
  try {
    const startTime = Date.now()
    const result = await syncNotionData()
    const endTime = Date.now()
    
    console.log('Manual Notion sync completed:', new Date().toISOString())
    console.log('Sync duration:', (endTime - startTime) / 1000, 'seconds')
    console.log('Sync result:', result)
    
    return NextResponse.json({ 
      message: 'Notion data synced successfully',
      syncDuration: `${(endTime - startTime) / 1000} seconds`,
      ...result
    }, { status: 200 })
  } catch (error) {
    console.error('Failed to sync Notion data:', error)
    return NextResponse.json({ error: 'Failed to sync Notion data' }, { status: 500 })
  }
}

