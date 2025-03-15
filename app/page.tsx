import Link from 'next/link'
import FileUploader from './components/file-uploader'
import { SquareArrowOutUpRight } from 'lucide-react'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-6 py-10 bg-gradient-to-b from-white to-gray-50'>
      <div className='flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto'>
        <h1 className='text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600'>S3 File Publisher</h1>
        <p className='text-gray-500 mb-8 text-center'>Securely upload and share files with anyone</p>
        <FileUploader />
      </div>

      <footer className='w-full mt-12 flex items-center justify-center text-[14px] text-gray-500 py-4 border-t border-gray-100'>
        <div className='flex items-center'>
          Built by: <span className='font-medium mx-1'>Noorullah Ahmadzai</span>
          <Link href='https://noorullah.dev' target='_blank' className='ml-1 flex items-center hover:text-gray-700 transition-colors'>
            <SquareArrowOutUpRight size={16} />
          </Link>
        </div>
      </footer>
    </main>
  )
}
