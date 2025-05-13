'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { ChatCTA } from '@/components/ChatCTA'
import { Loader2, CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import Markdown from 'react-markdown'

const STATUS_ORDER = [
  'pending',
  'partitioning',
  'partitioned',
  'refined',
  'chunked',
  'indexed',
  'summary_indexed',
  'keyword_indexed',
  'ready',
  'failed'
]

function getStatusDisplayName(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Pending",
    partitioning: "Partitioning",
    partitioned: "Refining",
    refined: "Chunking",
    chunked: "Indexing",
    indexed: "Summary Indexing",
    summary_indexed: "Keyword Indexing",
    keyword_indexed: "Finishing Up",
    ready: "Ready",
    failed: "Sync error",
  };

  return statusMap[status] || "Syncing";
}

interface Document {
  status: 'processing' | 'ready' | 'failed' | string
  id: string
  created_at: string
  updated_at: string
  name: string
  metadata: {
    added_by: string
  }
  partition: string
  chunk_count: number
  external_id: string | null
  page_count: number
  summary?: string
}

interface DocumentSummaryProps {
  documentId: string
}

export function DocumentSummary({ documentId }: DocumentSummaryProps) {
  const [document, setDocument] = useState<Document | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkDocumentStatus = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}`)
        const data = await response.json()

        if (data) {
          setDocument(data)

        // If document is ready or failed, clear the interval
        if (data.status === 'ready' || data.status === 'failed') {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }

            if (data.status === 'ready') {
              toast.success('Document processing complete!')
            } else {
              toast.error('Document processing failed')
            }
          }
        }
      } catch (error) {
        console.error('Error fetching document status:', error)
        toast.error('Failed to fetch document status')
      }
    }

    // Initial check
    checkDocumentStatus()

    // Set up polling
    intervalRef.current = setInterval(checkDocumentStatus, 2000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [documentId])

  if (!document) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading document...</h2>
        </div>
      </Card>
    )
  }

  const currentStatusIndex = STATUS_ORDER.indexOf(document.status)
  const isProcessing = document.status !== 'ready' && document.status !== 'failed'

  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">{document.name}</h2>
          {isProcessing && (
            <div className="mt-6 space-y-4">
              {STATUS_ORDER.map((status, index) => {
                const isCurrentStatus = index === currentStatusIndex
                const isCompleted = index < currentStatusIndex
                const isFuture = index > currentStatusIndex

                return (
                  <div key={status} className="flex items-center gap-3">
                    {isCurrentStatus ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/50" />
                    )}
                    <span className={`
                      text-sm
                      ${isCurrentStatus ? 'text-primary font-medium' : ''}
                      ${isCompleted ? 'text-green-500' : ''}
                      ${isFuture ? 'text-muted-foreground/50' : ''}
                    `}>
                      {getStatusDisplayName(status)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {document.status === 'failed' && (
            <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="space-y-2">
                  <p className="text-destructive font-medium">Document processing failed</p>
                  <p className="text-sm text-muted-foreground">
                    There was an error while processing your document.
                  </p>
                  
                </div>
              </div>
            </div>
          )}
        </div>

        {document.status === 'ready' && document.summary && (
          <div className="mt-8">
            <h3 className="font-medium mb-4">Document Summary</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown>{document.summary}</Markdown>
            </div>
            <div className="mt-8">
              <ChatCTA />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
} 