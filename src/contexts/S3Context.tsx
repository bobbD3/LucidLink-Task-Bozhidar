import React, { createContext, useContext, useState } from 'react'
import { S3 } from '@aws-sdk/client-s3'

interface S3ContextValue {
  s3: S3 | null
  setS3: React.Dispatch<React.SetStateAction<S3 | null>>
}

export const S3Context = createContext<S3ContextValue>({
  s3: null,
  setS3: () => {}
})

interface S3ProviderProps {
  children: React.ReactNode
}

export const S3Provider: React.FC<S3ProviderProps> = ({ children }) => {
  const [s3, setS3] = useState<S3 | null>(null)

  return <S3Context.Provider value={{ s3, setS3 }}>{children}</S3Context.Provider>
}

export const useS3Context = () => useContext(S3Context)
