import { NextResponse } from 'next/server';
import { getRagie } from '@/lib/ragie';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value;
    const cursor = new URL(request.url).searchParams.get('cursor');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ragie = getRagie();

    const res = await ragie.documents.list({ 
      filter: JSON.stringify({
        "added_by": { "$eq": userId }
      }),
      ...(cursor && { cursor })
    });

    return NextResponse.json({
        documents: res.result.documents,
        nextCursor: res.result.pagination.nextCursor,
      });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
} 