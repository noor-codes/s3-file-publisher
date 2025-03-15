'use client'

import Image from 'next/image'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Download, Eye, FileIcon, FileText, Play, Share2 } from 'lucide-react'

export default function FileViewer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileUrl = searchParams.get('url')
  const shortCode = searchParams.get('shortCode')
  const [loading, setLoading] = useState(true)
  const [fileName, setFileName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mediaLoading, setMediaLoading] = useState(true)
  const [fileType, setFileType] = useState<'image' | 'video' | 'other' | null>(null)
  const [viewCount, setViewCount] = useState<number | null>(null)

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

  // Fetch view count if shortCode is available
  useEffect(() => {
    if (shortCode) {
      const fetchViewCount = async () => {
        try {
          const response = await fetch(`/api/views/${shortCode}`)
          if (response.ok) {
            const data = await response.json()
            setViewCount(data.visits)
          }
        } catch (error) {
          console.error('Error fetching view count:', error)
        }
      }

      fetchViewCount()
    }
  }, [shortCode])

  const handleBack = () => {
    router.push('/')
  }

  const handleMediaLoad = () => {
    setMediaLoading(false)
  }

  const handleShareClick = () => {
    if (navigator.share && fileUrl) {
      navigator
        .share({
          title: fileName,
          url: window.location.href,
        })
        .catch((error) => {
          console.error('Error sharing:', error)
        })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!', {
        description: 'The view page URL has been copied to your clipboard.',
      })
    }
  }

  if (loading) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center py-10 p-4 bg-gradient-to-b from-white to-gray-50'>
        <Card className='w-full max-w-xl shadow-sm border border-gray-200 rounded-xl overflow-hidden'>
          <CardContent className='p-8'>
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <Skeleton className='h-10 w-24' />
                <Skeleton className='h-8 w-40' />
                <Skeleton className='h-10 w-24' />
              </div>
              <Skeleton className='h-[400px] w-full rounded-lg' />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !fileUrl) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50'>
        <Card className='w-full max-w-xl shadow-sm border border-gray-200 rounded-xl overflow-hidden'>
          <CardContent className='p-8'>
            <div className='text-center'>
              <div className='bg-red-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center'>
                <FileText className='h-10 w-10 text-red-400' />
              </div>
              <h2 className='text-xl font-semibold mb-2'>Error</h2>
              <p className='text-gray-600 mb-6'>{error || 'No file URL provided'}</p>
              <Button onClick={handleBack} className='px-6'>
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
    <main className='flex min-h-screen flex-col items-center p-6 pt-8 bg-gradient-to-b from-white to-gray-50'>
      <div className='w-full max-w-5xl'>
        <Card className='w-full shadow-sm border border-gray-200 rounded-xl overflow-hidden'>
          <CardContent className='p-0'>
            {/* Header - Only visible on lg and larger screens */}
            <div className='hidden lg:flex items-center justify-between p-4 border-b border-gray-100'>
              <Button variant='outline' onClick={handleBack} className='text-gray-600'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back
              </Button>

              <h1 className='text-lg font-medium truncate max-w-[50%]'>{fileName}</h1>

              <div className='flex gap-2'>
                {viewCount !== null && (
                  <div className='flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200'>
                    <Eye className='h-5 w-5 mr-1.5' />
                    <span className='font-medium'>{viewCount}</span>
                  </div>
                )}

                <Button variant='outline' onClick={handleShareClick} className='text-gray-600'>
                  <Share2 className='mr-2 h-4 w-4' />
                  Share
                </Button>

                {(fileType === 'image' || fileType === 'video') && (
                  <a href={fileUrl} download={fileName} target='_blank' rel='noopener noreferrer'>
                    <Button>
                      <Download className='mr-2 h-4 w-4' />
                      Download
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Mobile back button - Only visible on small and medium screens */}
            <div className='lg:hidden p-3 border-b border-gray-100'>
              <Button variant='outline' onClick={handleBack} className='text-gray-600' size='sm'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back
              </Button>
            </div>

            <div className='p-6 flex justify-center bg-gray-50'>
              {fileType === 'image' && (
                <div className='max-h-[70vh] overflow-hidden relative w-full h-[60vh] flex items-center justify-center rounded-lg bg-white'>
                  {mediaLoading && (
                    <div className='absolute inset-0 flex items-center justify-center z-10'>
                      <Skeleton className='h-full w-full absolute rounded-lg' />
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
                <div className='w-full h-[60vh] flex items-center justify-center relative rounded-lg bg-white'>
                  {mediaLoading && (
                    <div className='absolute inset-0 flex items-center justify-center z-10 bg-gray-100 rounded-lg'>
                      <Skeleton className='h-full w-full absolute rounded-lg' />
                      <div className='bg-gray-200 rounded-full p-4 w-16 h-16 flex items-center justify-center z-20'>
                        <Play className='h-8 w-8 text-gray-400' />
                      </div>
                    </div>
                  )}
                  <video
                    ref={videoRef}
                    src={fileUrl}
                    controls
                    className='max-w-full max-h-full object-contain rounded-lg'
                    onLoadedData={handleMediaLoad}
                    onError={() => {
                      setFileType('other')
                      setMediaLoading(false)
                    }}
                  />
                </div>
              )}

              {fileType === 'other' && (
                <div className='w-full h-[60vh] flex flex-col items-center justify-center bg-white rounded-lg p-8'>
                  <div className='bg-gray-50 rounded-full p-6 mb-6'>
                    <FileIcon className='h-12 w-12 text-gray-400' />
                  </div>
                  <h2 className='text-xl font-semibold mb-2 text-center'>{fileName}</h2>
                  <p className='text-gray-500 mb-6 text-center'>
                    This file type cannot be previewed directly.
                  </p>
                  <a href={fileUrl} download={fileName} target='_blank' rel='noopener noreferrer'>
                    <Button>
                      <Download className='mr-2 h-4 w-4' />
                      Download File
                    </Button>
                  </a>
                </div>
              )}
            </div>

            {/* Footer - Only visible on small and medium screens */}
            <div className='lg:hidden p-4 border-t border-gray-100 bg-white'>
              <div className='mb-3'>
                <h1 className='text-lg font-medium mb-1 break-words'>{fileName}</h1>

                <div className='flex items-center text-gray-600 text-sm mb-3'>
                  {viewCount !== null && (
                    <div className='flex items-center mr-3'>
                      <Eye className='h-4 w-4 mr-1' />
                      <span>{viewCount} views</span>
                    </div>
                  )}
                </div>
              </div>

              <div className='flex gap-2 flex-wrap'>
                <Button variant='outline' onClick={handleShareClick} className='text-gray-600 flex-1'>
                  <Share2 className='mr-2 h-4 w-4' />
                  Share
                </Button>

                {(fileType === 'image' || fileType === 'video') && (
                  <a
                    href={fileUrl}
                    download={fileName}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex-1'
                  >
                    <Button className='w-full'>
                      <Download className='mr-2 h-4 w-4' />
                      Download
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
