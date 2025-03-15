import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileX } from 'lucide-react'

export default function ShortLinkNotFound() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-6 py-10 bg-gradient-to-b from-white to-gray-50'>
      <Card className='w-full max-w-xl shadow-sm border border-gray-200 rounded-xl overflow-hidden'>
        <CardContent className='p-8'>
          <div className='text-center'>
            <div className='bg-red-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center'>
              <FileX className='h-10 w-10 text-red-400' />
            </div>
            <h2 className='text-xl font-semibold mb-2'>Link Not Found</h2>
            <p className='text-gray-600 mb-6'>
              The short link you are trying to access does not exist or has expired.
            </p>
            <Link href='/'>
              <Button className='px-6'>Go to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
