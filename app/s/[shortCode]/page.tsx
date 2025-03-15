import prisma from '@/app/lib/prisma'
import { notFound } from 'next/navigation'

// Client-side component for redirection
export default async function ShortLinkRedirect({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params

  console.log('Redirecting shortCode:', shortCode)

  // Find the short link in the database by shortCode
  let shortLink = await prisma.shortLink.findUnique({
    where: { shortCode },
  })

  // If not found by shortCode, try finding by ID
  if (!shortLink) {
    console.log('ShortLink not found by shortCode, trying by ID')
    shortLink = await prisma.shortLink.findFirst({
      where: { id: shortCode },
    })
  }

  // If still not found, return 404
  if (!shortLink) {
    console.log('ShortLink not found in database')
    return notFound()
  }

  console.log('Found shortLink:', shortLink)

  // If the short link has expired, return 404
  if (shortLink.expiresAt && new Date() > shortLink.expiresAt) {
    console.log('ShortLink has expired')
    return notFound()
  }

  try {
    // Increment the visit count
    await prisma.shortLink.update({
      where: { id: shortLink.id },
      data: { visits: { increment: 1 } },
    })
  } catch (error) {
    // Just log the error but continue with the redirect
    console.error('Error updating visit count:', error)
  }

  // Create the view URL instead of redirecting directly to the file
  const viewUrl = `/view?url=${encodeURIComponent(shortLink.longUrl)}&shortCode=${shortCode}`
  
  console.log('Redirecting to view page:', viewUrl)
  
  // Return an HTML page with a meta refresh for client-side redirection
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0;url=${viewUrl}`} />
        <title>Redirecting to viewer...</title>
      </head>
      <body>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1>Redirecting to file viewer...</h1>
          <p>If you are not redirected automatically, click the link below:</p>
          <a href={viewUrl}>View file</a>
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
          window.location.href = "${viewUrl}";
        `}} />
      </body>
    </html>
  )
}
