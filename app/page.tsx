import Link from 'next/link'
import FileUploader from './components/file-uploader'

import { SquareArrowOutUpRight } from 'lucide-react'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24 px-4 mt-20'>
      <h1 className='text-3xl font-bold mb-8'>S3 File Publisher</h1>
      <FileUploader />

      <span className='flex items-center justify-center mt-4 text-[14px] text-gray-500 pt-72 cursor-default'>
        Built by: Noorullah Ahmadzai
        <Link href='https://noorullah.dev' target='_blank' className='ml-2'>
          <SquareArrowOutUpRight size={16} />
        </Link>
      </span>
    </main>
  )
}
