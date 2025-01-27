'use client'

import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { uploadFile } from '../actions/upload'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Check, Copy } from 'lucide-react'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FileUploader() {
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

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

  return (
    <Card className='w-full max-w-xl mx-auto'>
      <CardContent className='p-6'>
        <AnimatePresence>
          {!fileUrl && (
            <motion.div
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='text-center py-4'
            >
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto'></div>
              <p className='mt-2 text-sm text-gray-600'>Uploading...</p>
            </motion.div>
          )}

          {fileUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='space-y-4'
            >
              <div className='flex items-center space-x-2'>
                <Check className='text-green-500' />
                <p className='text-sm text-gray-600'>File uploaded successfully!</p>
              </div>
              <div className='flex items-center space-x-2'>
                <Input value={fileUrl} readOnly className='flex-grow' />
                <Button onClick={copyToClipboard} size='icon'>
                  <Copy className='h-4 w-4' />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
