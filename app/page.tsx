import { FileDropzone } from '@/components/FileDropzone'

export default async function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              AI-Powered File Summaries
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Upload any file and get an instant AI-generated summary. Share insights with your team in seconds.
            </p>
          </div>
          <FileDropzone />
        </div>
      </div>
    </main>
  )
}
