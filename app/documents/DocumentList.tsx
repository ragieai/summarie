'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

interface Document {
  id: string;
  name: string;
  created_at: string;
  status: string;
  page_count: number;
}

export default function DocumentList() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const fetchDocuments = useCallback(async (cursor?: string) => {
    try {
      const url = cursor ? `/api/documents?cursor=${cursor}` : '/api/documents';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      
      if (cursor) {
        setDocuments(prev => [...prev, ...data.documents]);
      } else {
        setDocuments(data.documents);
      }
      
      setNextCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchDocuments(nextCursor || undefined);
        }
      },
      { threshold: 1.0 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchDocuments, hasMore, loading, nextCursor]);

  const handleCardClick = (id: string) => {
    router.push(`/summary/${id}`);
  };

  if (loading && documents.length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (documents.length === 0) {
    return <div className="text-center text-gray-500">No documents found</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <Card 
            key={doc.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCardClick(doc.id)}
          >
            <CardHeader>
              <CardTitle className="truncate">{doc.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className="capitalize">{doc.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {hasMore && (
        <div ref={loadingRef} className="h-10 flex items-center justify-center mt-6">
          {loading && <div className="text-muted-foreground">Loading more...</div>}
        </div>
      )}
    </>
  );
} 