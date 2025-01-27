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

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file provided')
  }

  const buffer = await file.arrayBuffer()
  const fileName = `uploads/${uuidv4()}-${file.name}` // Upload to /uploads folder

  const putCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(buffer),
  })

  await s3Client.send(putCommand)

  const getCommand = new GetObjectCommand({
    Key: fileName,
    Bucket: BUCKET_NAME,
  })

  const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 7 * 24 * 60 * 60 }) // URL valid for 7 days

  return { success: true, url }
}
