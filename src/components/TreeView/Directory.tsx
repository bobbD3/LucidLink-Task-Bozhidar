import React, { useState, useEffect } from 'react'
import { useS3Context } from '../../contexts/S3Context'
import { listObjects } from '../../utils/s3'
import File from './File'
import { getFileContent } from '../../utils/s3'
import './Directory.css'

type S3Object = Partial<{
  Key: string
  Size: number
}>

interface DirectoryProps {
  prefix: string
  onSelect: (prefix: string) => void
  bucketName: string
  selectedDir: string
  updateKey: number
}

const Directory: React.FC<DirectoryProps> = ({ prefix, onSelect, bucketName, selectedDir, updateKey  }) => {
  const { s3 } = useS3Context()
  const [expanded, setExpanded] = useState(false)
  const [subdirs, setSubdirs] = useState<string[]>([])
  const [files, setFiles] = useState<S3Object[]>([])
  const [contentMap, setContentMap] = useState<{ [key: string]: string | null }>({})

  const fetchContent = async () => {
    const tempContentMap: { [key: string]: string | null } = {};
    for (const file of files) {
      const key = file.Key || '';
      if (s3 && key) {
        const content = await getFileContent(s3, key);
        console.log(`Fetched content for key '${key}':`, content);
        tempContentMap[key] = content;
      }
    }
    setContentMap(tempContentMap);
    console.log('Updated contentMap:', tempContentMap);
  };

  useEffect(() => {
    fetchContent()
  }, [s3, files, bucketName, updateKey])


  const handleClick = async () => {
    setExpanded(!expanded)

    if (!expanded && s3) {
      const { commonPrefixes, contents } = await listObjects(s3, prefix, '/')
      setSubdirs(commonPrefixes.map(cp => cp.Prefix))
      setFiles(contents.filter(content => content.Key !== prefix))
    }
  }

const handleFileClick = (key: string) => {
  const content = contentMap[key];
  console.log(`Content fetched: ${content}`);
};

  const handleDoubleClick = () => {
    onSelect(prefix)
  }


  return (
    <div className='directory-container'>
      <div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        style={{
          backgroundColor: selectedDir.startsWith(prefix) ? '#2e7d32' : 'transparent',
          cursor: 'pointer'
        }}
      >
        {expanded ? '-' : '+'} {prefix}
      </div>
      {expanded && (
        <div className='children-container'>
          {subdirs.map(subdir => (
            <Directory key={subdir} prefix={subdir} onSelect={onSelect} bucketName={bucketName} selectedDir={selectedDir} updateKey={updateKey}/>
          ))}
          {files.map(file => {
            const key = file.Key || ''
            const size = file.Size || 0
            return <File key={key} name={key.split('/').pop() || ''} onDoubleClick={() => handleFileClick(key)} size={size} content={contentMap[key]} />
          })}
        </div>
      )}
    </div>
  )
}

export default Directory
