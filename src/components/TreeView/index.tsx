import React, { useState, useEffect } from 'react'
import { useS3Context } from '../../contexts/S3Context'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import Directory from './Directory'
import { listObjects } from '../../utils/s3'

interface TreeViewProps {
  onSelect: (prefix: string) => void
  bucketName: string
  updateKey: number
  selectedDir: string
}

const TreeView: React.FC<TreeViewProps> = ({ onSelect, bucketName, updateKey, selectedDir }) => {
  const { s3 } = useS3Context()
  const [directories, setDirectories] = useState<string[]>([])
  
  useEffect(() => {
    const createRootFolder = async () => {
      if (s3) {
        const putObjectCommand = new PutObjectCommand({ Bucket: bucketName, Key: 'root/' });
        await s3.send(putObjectCommand);
      }
    };
    

    const fetchDirectories = async () => {
      if (s3) {
        const { commonPrefixes } = await listObjects(s3, '', '/')
        if (commonPrefixes.length === 0) {
          await createRootFolder()
          setDirectories(['root/'])
        } else {
          setDirectories(commonPrefixes.map(cp => cp.Prefix))
        }
      }
    }
    fetchDirectories()
  }, [s3, updateKey, bucketName])

  return (
    <div>
      {directories.map(dir => (
        <Directory key={dir} prefix={dir} onSelect={onSelect} bucketName={bucketName} selectedDir={selectedDir} updateKey={updateKey} />
      ))}
    </div>
  )
}

export default TreeView