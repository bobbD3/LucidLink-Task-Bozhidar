import { S3 } from '@aws-sdk/client-s3'
import { ListObjectsCommand, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { GetObjectCommand } from '@aws-sdk/client-s3'

const bucketName = 'frontend-task-b-donchev'
export async function listObjects(s3: S3, prefix?: string, delimiter?: string) {
  try {
    const params = {
      Bucket: bucketName,
      Prefix: prefix,
      Delimiter: delimiter
    }
    const data = await s3.send(new ListObjectsCommand(params))
    return {
      contents: data.Contents || [],
      commonPrefixes: (data.CommonPrefixes || []).map(cp => ({ Prefix: cp.Prefix || '' }))
    }
  } catch (error) {
    console.error(error)
    return { contents: [], commonPrefixes: [] }
  }
}

export async function createObject(s3: S3, key: string, body = '', contentType?: string) {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType
    }
    await s3.send(new PutObjectCommand(params))
  } catch (error) {
    console.error(error)
  }
}

export async function deleteObject(s3: S3, key: string) {
  try {
    const params = {
      Bucket: bucketName,
      Key: key
    }
    await s3.send(new DeleteObjectCommand(params))
  } catch (error) {
    console.error(error)
  }
}

async function streamToString(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");
  let result = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  return result;
}

export const createObjectWithContent = async (s3: S3, key: string, content: string) => {
  await s3.send(new PutObjectCommand({ Bucket: bucketName, Key: key, Body: content }))
}

export async function getFileContent(s3: S3, key: string): Promise<string | null> {
  try {
    const data = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));
    if (data.Body) {
      const stream = data.Body as ReadableStream;
      const content = await streamToString(stream);
      return content;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

