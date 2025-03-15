import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { shortCode } = params

    // Find the short link in the database by shortCode
    let shortLink = await prisma.shortLink.findUnique({
      where: { shortCode },
    })

    // If not found by shortCode, try finding by ID
    if (!shortLink) {
      shortLink = await prisma.shortLink.findFirst({
        where: { id: shortCode },
      })
    }

    // If still not found, return 404
    if (!shortLink) {
      return NextResponse.json({ error: 'ShortLink not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      visits: shortLink.visits,
    })
  } catch (error) {
    console.error('Error fetching view count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch view count' },
      { status: 500 }
    )
  }
}
