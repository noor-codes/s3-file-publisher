import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FileIcon } from 'lucide-react'

export default function ShortLinkLoading() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-6 py-10 bg-gradient-to-b from-white to-gray-50'>
      <Card className='w-full max-w-xl shadow-sm border border-gray-200 rounded-xl overflow-hidden'>
        <CardContent className='p-8'>
          <div className='text-center'>
            <div className='bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center'>
              <FileIcon className='h-10 w-10 text-gray-400' />
            </div>
            <h2 className='text-xl font-semibold mb-2'>Redirecting...</h2>
            <Skeleton className='h-4 w-3/4 mx-auto mb-6' />
            <Skeleton className='h-10 w-32 mx-auto' />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
