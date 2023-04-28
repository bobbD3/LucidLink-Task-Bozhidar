import React, { useState } from 'react'
import FileView from '../FileView'
import TreeView from '../TreeView'
import './FileBrowser.css'

const FileBrowser = () => {
  const [currentDir, setCurrentDir] = useState('')
  const [updateKey, setUpdateKey] = useState(0)
  const bucketName = 'frontend-task-b-donchev'

  return (
    <div className='file-browser'>
      <TreeView onSelect={setCurrentDir} bucketName={bucketName} updateKey={updateKey} selectedDir={currentDir} />
      <FileView currentDir={currentDir} />
    </div>
  )
}

export default FileBrowser
