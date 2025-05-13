import { DocumentSummary } from '@/components/DocumentSummary'

interface SummaryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { id } = await params
  return (
    <div className="container mx-auto px-4 py-16">
      <DocumentSummary documentId={id} />
    </div>
  )
} 