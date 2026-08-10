'use server'

import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

const { MINIO_ENDPOINT, REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME } = process.env

if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !REGION || !MINIO_ENDPOINT) {
  throw new Error('Required environment variables are not set')
}

const s3Client = new S3Client({
  endpoint: MINIO_ENDPOINT,
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
})

function contentDisposition(filename: string, type: 'inline' | 'attachment' = 'inline') {
  const fallback = filename.replace(/[^\x20-\x7E]/g, '_').replace(/["\\]/g, '\\$&')
  const encoded = encodeURIComponent(filename).replace(/['()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
  return `${type}; filename="${fallback}"; filename*=UTF-8''${encoded}`
}

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file provided')
  }

  const originalName = file.name
  const buffer = await file.arrayBuffer()
  // UUID folder keeps keys unique; final path segment is the original filename
  // so browsers download it as e.g. "Ramaki GOC.pdf" instead of "uuid-Ramaki GOC.pdf"
  const objectKey = `uploads/${uuidv4()}/${originalName}`
  const disposition = contentDisposition(originalName)

  const putCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
    Body: Buffer.from(buffer),
    ContentType: file.type || 'application/octet-stream',
    ContentDisposition: disposition,
  })

  await s3Client.send(putCommand)

  const getCommand = new GetObjectCommand({
    Key: objectKey,
    Bucket: BUCKET_NAME,
    ResponseContentDisposition: disposition,
    ResponseContentType: file.type || 'application/octet-stream',
  })

  const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 7 * 24 * 60 * 60 }) // URL valid for 7 days

  return { success: true, url, fileName: originalName }
}
