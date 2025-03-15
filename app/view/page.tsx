'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download, FileIcon, FileText, Play } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function FileViewer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileUrl = searchParams.get('url')
  const [fileType, setFileType] = useState<'image' | 'video' | 'other' | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [mediaLoading, setMediaLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!fileUrl) {
      setError('No file URL provided')
      setLoading(false)
      return
    }

    // Save the URL to localStorage for state persistence
    localStorage.setItem('lastUploadedFileUrl', fileUrl)

    // Extract file name from URL
    try {
      const url = new URL(fileUrl)
      const pathSegments = url.pathname.split('/')
      const fullFileName = pathSegments[pathSegments.length - 1]
      // Remove UUID prefix if present (format: uuid-filename)
      const nameWithoutUuid = fullFileName.includes('-')
        ? fullFileName.substring(fullFileName.indexOf('-') + 1)
        : fullFileName

      setFileName(decodeURIComponent(nameWithoutUuid))

      // Determine file type based on extension
      const extension = nameWithoutUuid.split('.').pop()?.toLowerCase() || ''

      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
        setFileType('image')
      } else if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension)) {
        setFileType('video')
      } else {
        setFileType('other')
      }

      setLoading(false)
    } catch (err) {
      console.error('Error parsing URL:', err)
      setError('Invalid file URL')
      setLoading(false)
    }
  }, [fileUrl])

  const handleBack = () => {
    router.push('/')
  }

  const handleMediaLoad = () => {
    setMediaLoading(false)
  }

  if (loading) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center py-10 p-4'>
        <Card className='w-full max-w-xl'>
          <CardContent className='p-6'>
            <div className='space-y-4'>
              <Skeleton className='h-6 w-3/4 mx-auto' />
              <Skeleton className='h-[300px] w-full' />
              <div className='flex justify-between'>
                <Skeleton className='h-10 w-20' />
                <Skeleton className='h-10 w-20' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !fileUrl) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-4'>
        <Card className='w-full max-w-xl'>
          <CardContent className='p-6'>
            <div className='text-center'>
              <FileText className='mx-auto h-12 w-12 text-gray-400 mb-4' />
              <h2 className='text-xl font-semibold mb-2'>Error</h2>
              <p className='text-gray-600 mb-4'>{error || 'No file URL provided'}</p>
              <Button onClick={handleBack}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className='flex min-h-screen flex-col items-center p-4 pt-8'>
      <div className='w-full max-w-4xl'>
        <div className='flex items-center justify-between mb-6'>
          <Button variant='outline' onClick={handleBack}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
          <h1 className='text-xl font-semibold truncate max-w-[50%]'>{fileName}</h1>
          {(fileType === 'image' || fileType === 'video') && (
            <a href={fileUrl} download={fileName} target='_blank' rel='noopener noreferrer'>
              <Button>
                <Download className='mr-2 h-4 w-4' />
                Download
              </Button>
            </a>
          )}
          {fileType === 'other' && (
            <div className='w-[110px]'></div> // Empty div to maintain layout spacing
          )}
        </div>

        <Card className='w-full'>
          <CardContent className='p-6 flex justify-center'>
            {fileType === 'image' && (
              <div className='max-h-[70vh] overflow-hidden relative w-full h-[60vh] flex items-center justify-center'>
                {mediaLoading && (
                  <div className='absolute inset-0 flex items-center justify-center z-10'>
                    <Skeleton className='h-full w-full absolute' />
                  </div>
                )}
                <Image
                  src={fileUrl}
                  alt={fileName}
                  className='object-contain'
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  onError={() => setFileType('other')}
                  onLoad={handleMediaLoad}
                  unoptimized // Use unoptimized for external images from S3
                />
              </div>
            )}

            {fileType === 'video' && (
              <div className='w-full h-[60vh] flex items-center justify-center relative'>
                {mediaLoading && (
                  <div className='absolute inset-0 flex items-center justify-center z-10 bg-gray-100 dark:bg-gray-800 rounded-md'>
                    <Skeleton className='h-full w-full absolute rounded-md' />
                    <Play className='h-16 w-16 text-gray-400 z-20' />
                  </div>
                )}
                <video
                  ref={videoRef}
                  src={fileUrl}
                  controls
                  className='max-w-full max-h-full object-contain rounded-md'
                  onLoadedData={handleMediaLoad}
                  onError={() => {
                    setFileType('other')
                    setMediaLoading(false)
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {fileType === 'other' && (
              <div className='text-center py-12'>
                <FileIcon className='mx-auto h-16 w-16 text-gray-400 mb-4' />
                <p className='text-gray-600 mb-4'>This file type cannot be previewed directly.</p>
                <a href={fileUrl} download={fileName} target='_blank' rel='noopener noreferrer'>
                  <Button>
                    <Download className='mr-2 h-4 w-4' />
                    Download File
                  </Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
