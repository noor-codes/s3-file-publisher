import prisma from '@/app/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default async function DebugPage() {
  // Get all shortlinks from the database
  const shortLinks = await prisma.shortLink.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main className='flex min-h-screen flex-col items-center p-6 py-10 bg-gradient-to-b from-white to-gray-50'>
      <div className='w-full max-w-5xl'>
        <h1 className='text-3xl font-bold mb-6'>Debug ShortLinks</h1>
        
        {shortLinks.length === 0 ? (
          <p>No shortlinks found in the database.</p>
        ) : (
          <div className='space-y-4'>
            {shortLinks.map((link) => (
              <Card key={link.id} className='overflow-hidden'>
                <CardContent className='p-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <h3 className='font-medium text-lg'>ShortLink Info</h3>
                      <p><strong>ID:</strong> {link.id}</p>
                      <p><strong>ShortCode:</strong> {link.shortCode}</p>
                      <p><strong>Created:</strong> {new Date(link.createdAt).toLocaleString()}</p>
                      <p><strong>Expires:</strong> {link.expiresAt ? new Date(link.expiresAt).toLocaleString() : 'Never'}</p>
                      <p><strong>Visits:</strong> {link.visits}</p>
                      <div className='mt-4'>
                        <Link 
                          href={`/s/${link.shortCode}`}
                          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                          target="_blank"
                        >
                          Test Redirect
                        </Link>
                      </div>
                    </div>
                    <div>
                      <h3 className='font-medium text-lg'>Long URL</h3>
                      <div className='bg-gray-100 p-3 rounded-md mt-2 break-all'>
                        <code className='text-sm'>{link.longUrl}</code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
