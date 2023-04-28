import React, { useState } from 'react'
import { S3Context } from './S3Context' 
import { S3 } from '@aws-sdk/client-s3'

interface S3ProviderProps {
  children: React.ReactNode
}

export const S3Provider: React.FC<S3ProviderProps> = ({ children }) => {
  const [s3, setS3] = useState<S3 | null>(null)

  return <S3Context.Provider value={{ s3, setS3 }}>{children}</S3Context.Provider>
}
