'use client'

import { Button } from '@/components/ui/button'

export function ChatCTA() {
  return (
    <Button
          size="xl"
          className="mt-2"
          onClick={() => window.open('https://www.ragie.ai/basechat', '_blank')}
        >
          Chat with this file
        </Button>
  )
} 