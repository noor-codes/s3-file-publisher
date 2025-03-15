import prisma from '@/app/lib/prisma'

import { nanoid } from 'nanoid'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Generate a short code
    const shortCode = nanoid(8) // 8 characters is a good balance between brevity and uniqueness

    // Set expiration date to 7 days from now (matching the S3 URL expiration)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Create a new short link in the database
    const shortLink = await prisma.shortLink.create({
      data: {
        shortCode,
        longUrl: url,
        expiresAt,
      },
    })

    const shortUrl = `${request.nextUrl.origin}/s/${shortLink.shortCode}`;
    
    console.log('Created shortlink:', {
      id: shortLink.id,
      shortCode: shortLink.shortCode,
      shortUrl: shortUrl
    });

    return NextResponse.json({
      success: true,
      id: shortLink.id,
      shortCode: shortLink.shortCode,
      shortUrl: shortUrl,
    })
  } catch (error) {
    console.error('Error creating short link:', error)
    return NextResponse.json({ error: 'Failed to create short link' }, { status: 500 })
  }
}
