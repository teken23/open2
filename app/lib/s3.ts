
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createS3Client, getBucketConfig } from "./aws-config";

const s3Client = createS3Client();
const { bucketName, folderPrefix } = getBucketConfig();

export async function uploadFile(buffer: Buffer, fileName: string): Promise<string> {
  const key = `${folderPrefix}wordlists/${Date.now()}-${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: 'text/plain',
  });

  await s3Client.send(command);
  return key;
}

export async function downloadFile(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return signedUrl;
}

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await s3Client.send(command);
}

export async function renameFile(oldKey: string, newKey: string): Promise<string> {
  // S3 doesn't support rename directly, so we copy and delete
  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: oldKey,
  });

  const response = await s3Client.send(getCommand);
  const buffer = Buffer.from(await response.Body!.transformToByteArray());
  
  // Upload with new key
  const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: newKey,
    Body: buffer,
    ContentType: 'text/plain',
  });

  await s3Client.send(putCommand);
  
  // Delete old file
  await deleteFile(oldKey);
  
  return newKey;
}
