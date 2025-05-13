import { getRagie } from '@/lib/ragie'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


const ragie = getRagie();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = request.cookies.get('user_id')?.value;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Create document using Ragie SDK
    const result = await ragie.documents.create({
      file: file,
      mode: "hi_res",
      metadata: {
        added_by: userId || "unknown"
      }
    })

    return NextResponse.json({ 
      status: result.status,
      fileId: result.id
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 