import React, { useState } from 'react'
import { S3, S3ClientConfig } from '@aws-sdk/client-s3'
import { useS3Context } from '../../contexts/S3Context'
import './Config.css'

const Config = () => {
  const { setS3 } = useS3Context()

  const [accessKeyId, setAccessKeyId] = useState(() => localStorage.getItem('accessKeyId') || '');
  const [secretAccessKey, setSecretAccessKey] = useState(() => localStorage.getItem('secretAccessKey') || '');
  const [bucketName, setBucketName] = useState(() => localStorage.getItem('bucketName') || '');
  const [fadeInOut, setFadeInOut] = useState(true)
  const [buttonText, setButtonText] = useState('Login')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const s3Config: S3ClientConfig = {
      region: 'eu-central-1',
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    }

    setS3(new S3(s3Config))

    localStorage.setItem('accessKeyId', accessKeyId);
    localStorage.setItem('secretAccessKey', secretAccessKey);
    localStorage.setItem('bucketName', bucketName);
  }

  const handleAnimation = () => {
    setFadeInOut(!fadeInOut)
    setButtonText(buttonText === 'Hide' ? 'Login' : 'Hide')
  }

  return (
    <div>
      <div className='credentials-button-container'>
        <button className='credentials-button' onClick={handleAnimation}>
          {buttonText}
        </button>
      </div>
      <div className={`config-container ${fadeInOut ? 'fade' : ''}`}>
        <form onSubmit={handleSubmit} className='form-container'>
          <input type='text' placeholder='Access Key ID' value={accessKeyId} onChange={e => setAccessKeyId(e.target.value)} />
          <input type='text' placeholder='Secret Access Key' value={secretAccessKey} onChange={e => setSecretAccessKey(e.target.value)} />
          <input type='text' placeholder='Bucket Name' value={bucketName} onChange={e => setBucketName(e.target.value)} />
          <button type='submit'>Connect</button>
        </form>
      </div>
    </div>
  )
}

export default Config
