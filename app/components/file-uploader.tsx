'use client'

import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { uploadFile } from '../actions/upload'
import { ScaleLoader } from 'react-spinners' // Import the spinner
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Check, Copy, Eye, Link as LinkIcon } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function FileUploader() {
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Load saved file URL from localStorage on component mount
  useEffect(() => {
    const savedFileUrl = localStorage.getItem('lastUploadedFileUrl')
    if (savedFileUrl) {
      setFileUrl(savedFileUrl)
    }
  }, [])

  // Save file URL to localStorage whenever it changes
  useEffect(() => {
    if (fileUrl) {
      localStorage.setItem('lastUploadedFileUrl', fileUrl)
    }
  }, [fileUrl])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])

      try {
        const result = await uploadFile(formData)
        if (result.success) {
          setFileUrl(result.url)

          toast.message('File uploaded successfully!', {
            description: 'You can now share the link with others',
          })
        }
      } catch (error) {
        console.error('Upload failed:', error)

        toast.error('Upload failed', {
          description: 'Please try again later.',
        })
      } finally {
        setIsUploading(false)
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const copyToClipboard = () => {
    if (fileUrl) {
      navigator.clipboard.writeText(fileUrl)

      toast.success('Link copied!', {
        description: 'The file URL has been copied to your clipboard.',
      })
    }
  }

  const copyViewLinkToClipboard = () => {
    if (fileUrl) {
      // Get the current origin (protocol + hostname + port)
      const origin = window.location.origin
      const viewUrl = `${origin}/view?url=${encodeURIComponent(fileUrl)}`

      navigator.clipboard.writeText(viewUrl)

      toast.success('View link copied!', {
        description: 'The view page URL has been copied to your clipboard.',
      })
    }
  }

  const resetUpload = () => {
    setFileUrl(null)
    localStorage.removeItem('lastUploadedFileUrl')
    toast.info('Upload reset', {
      description: 'You can now upload a new file.',
    })
  }

  return (
    <Card className='w-full max-w-xl mx-auto'>
      <CardContent className='p-6'>
        <AnimatePresence mode='wait'>
          {!fileUrl && (
            <motion.div
              key='upload-area'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className='mx-auto h-12 w-12 text-gray-400' />
                <p className='mt-2 text-sm text-gray-600'>
                  Drag and drop a file here, or click to select a file
                </p>
              </div>
              <span className='flex items-center justify-center mt-4 text-[12px] text-gray-500'>
                Recommended for files larger than 10 MB.
              </span>
            </motion.div>
          )}

          {isUploading && (
            <motion.div
              key='uploading-spinner'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='text-center py-4 mt-5'
            >
              <ScaleLoader color={'#6b7280'} className='mx-auto' /> {/* Better-looking spinner */}
              <p className='mt-2 text-sm text-gray-600'>Uploading...</p>
            </motion.div>
          )}

          {fileUrl && (
            <motion.div
              key='upload-success'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='space-y-4'
            >
              <div className='flex items-center space-x-2'>
                <Check className='text-green-500' />
                <p className='text-sm text-gray-600'>File uploaded successfully!</p>
                <div className='flex-grow'></div>
                <Button
                  variant='default'
                  size='sm'
                  onClick={resetUpload}
                  className='bg-black hover:bg-gray-800'
                >
                  Upload
                </Button>
              </div>

              <div className='space-y-2'>
                <p className='text-xs text-gray-500 font-medium'>Direct File URL:</p>
                <div className='flex items-center space-x-2'>
                  <Input value={fileUrl} readOnly className='flex-grow' />
                  <Button onClick={copyToClipboard} size='icon' title='Copy direct URL'>
                    <Copy className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              <div className='space-y-2'>
                <p className='text-xs text-gray-500 font-medium'>View Page URL:</p>
                <div className='flex items-center space-x-2'>
                  <Input
                    value={
                      typeof window !== 'undefined'
                        ? `${window.location.origin}/view?url=${encodeURIComponent(fileUrl)}`
                        : ''
                    }
                    readOnly
                    className='flex-grow'
                  />
                  <Button onClick={copyViewLinkToClipboard} size='icon' title='Copy view page URL'>
                    <LinkIcon className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              <div className='flex items-center space-x-2 mt-4'>
                <Link href={`/view?url=${encodeURIComponent(fileUrl)}`} className='flex-grow'>
                  <Button variant='outline' className='w-full'>
                    <Eye className='h-4 w-4 mr-2' />
                    View File
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
