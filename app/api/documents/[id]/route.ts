import { getRagie } from '@/lib/ragie'
import { NextResponse } from 'next/server'

const ragie = getRagie();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const p = await params;
    // Get document status from Ragie SDK
    const document = await ragie.documents.get({ documentId: p.id })

    // If document is ready, fetch the summary
    if (document.status === 'ready') {
      const result = await ragie.documents.getSummary({ documentId: p.id })

      
      return NextResponse.json({
        ...document,
        summary: result.summary
      })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error fetching document status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document status' },
      { status: 500 }
    )
  }
} 