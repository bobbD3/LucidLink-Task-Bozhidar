import React from 'react'

interface FileProps {
  key: string
  name: string
  size: number
  content?: string | null
  onDoubleClick?: () => void
}

const File: React.FC<FileProps> = ({ name, content, onDoubleClick }) => {
  return (
    <div onDoubleClick={onDoubleClick} title={content || 'No content'}>
      {name}
    </div>
  )
}

export default File
