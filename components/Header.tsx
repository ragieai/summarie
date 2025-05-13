import Link from 'next/link'
import Image from 'next/image'
import { Home, FileText } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Summarie</span>
          </Link>
          <Link
            href="/documents"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span>My Documents</span>
          </Link>
        </div>

        <a
          href="https://www.ragie.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Image
            src="/ragie-logo.svg"
            alt="Ragie"
            width={80}
            height={80}
            className="h-6 w-6 brightness-0"
          />
        </a>
      </div>
    </header>
  )
} 