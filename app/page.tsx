import Link from 'next/link'
import FileUploader from './components/file-uploader'

import { SquareArrowOutUpRight } from 'lucide-react'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-6 py-10'>
      <div className='flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>S3 File Publisher</h1>
        <FileUploader />
      </div>

      <footer className='w-full mt-8 flex items-center justify-center text-[14px] text-gray-500 py-4'>
        Built by: Noorullah Ahmadzai
        <Link href='https://noorullah.dev' target='_blank' className='ml-2'>
          <SquareArrowOutUpRight size={16} />
        </Link>
      </footer>
    </main>
  )
}
