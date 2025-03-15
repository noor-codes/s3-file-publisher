'use client'

import Link from 'next/link'

import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { uploadFile } from '../actions/upload'
import { ScaleLoader } from 'react-spinners'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import { Check, Copy, Eye, Link as LinkIcon, FileUp, RefreshCw } from 'lucide-react'

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
    <Card className='w-full max-w-xl mx-auto shadow-sm border border-gray-200 rounded-xl overflow-hidden'>
      <CardContent className='p-8'>
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
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all hover:bg-gray-50 ${
                  isDragActive ? 'border-primary bg-primary/10 scale-[0.98]' : 'border-gray-300'
                }`}
              >
                <input {...getInputProps()} />
                <div className='bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center'>
                  <FileUp className='h-10 w-10 text-gray-500' />
                </div>
                <h3 className='text-lg font-medium mb-2'>Upload your file</h3>
                <p className='text-sm text-gray-600 mb-2'>Drag and drop a file here, or click to select</p>
                <p className='text-xs text-gray-500'>Recommended for files larger than 10 MB</p>
              </div>
            </motion.div>
          )}

          {isUploading && (
            <motion.div
              key='uploading-spinner'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='text-center py-10'
            >
              <ScaleLoader color={'#6b7280'} className='mx-auto' />
              <p className='mt-4 text-sm text-gray-600'>Uploading your file...</p>
              <p className='mt-1 text-xs text-gray-500'>This may take a moment for larger files</p>
            </motion.div>
          )}

          {fileUrl && (
            <motion.div
              key='upload-success'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='space-y-6'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='bg-green-50 rounded-full p-2 mr-3'>
                    <Check className='text-green-500 h-5 w-5' />
                  </div>
                  <div>
                    <h3 className='font-medium'>File uploaded successfully!</h3>
                    <p className='text-xs text-gray-500'>Your file is ready to share</p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={resetUpload}
                  className='flex items-center gap-1 hover:bg-gray-50'
                >
                  <RefreshCw className='h-3.5 w-3.5' />
                  <span>New Upload</span>
                </Button>
              </div>

              <div className='space-y-5 bg-gray-50 p-4 rounded-lg'>
                <div className='space-y-2'>
                  <p className='text-xs text-gray-500 font-medium'>Direct File URL:</p>
                  <div className='flex items-center space-x-2'>
                    <Input value={fileUrl} readOnly className='flex-grow text-sm bg-white' />
                    <Button
                      onClick={copyToClipboard}
                      size='icon'
                      title='Copy direct URL'
                      className='bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                    >
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
                      className='flex-grow text-sm bg-white'
                    />
                    <Button
                      onClick={copyViewLinkToClipboard}
                      size='icon'
                      title='Copy view page URL'
                      className='bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                    >
                      <LinkIcon className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>

              <Link href={`/view?url=${encodeURIComponent(fileUrl)}`} className='block w-full'>
                <Button variant='default' className='w-full'>
                  <Eye className='h-4 w-4 mr-2' />
                  View File
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
