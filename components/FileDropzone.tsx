'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, File } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const ACCEPTED_FILE_TYPES = {
  // Plain Text
  'text/plain': ['.txt', '.md', '.rst', '.xml', '.json'],
  'message/rfc822': ['.eml'],
  'text/html': ['.html'],
  'application/vnd.ms-outlook': ['.msg'],
  'application/rtf': ['.rtf'],
  
  // Images
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/tiff': ['.tiff'],
  'image/bmp': ['.bmp'],
  'image/heic': ['.heic'],

  'audio/*': ['.mp3', '.wav', '.ogg'],
  'video/*': ['.mp4', '.mov', '.avi'],
  
  // Documents
  'text/csv': ['.csv'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/pdf': ['.pdf'],
  'application/epub+zip': ['.epub'],
  'application/vnd.oasis.opendocument.text': ['.odt'],
  'text/tab-separated-values': ['.tsv'],
}

export function FileDropzone() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
  })

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    const toastId = toast.loading('Uploading file...')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file')
      }

      toast.success('File uploaded successfully!', {
        id: toastId,
      })

      // Redirect to the summary page
      router.push(`/summary/${data.fileId}`)
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file. Please try again.', {
        id: toastId,
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl p-8">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-col items-center gap-4">
            <File className="h-12 w-12 text-primary" />
            <p className="text-lg font-medium">{file.name}</p>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                handleUpload()
              }}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Generate Summary'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                or click to select a file
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
} 