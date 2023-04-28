import React from 'react'
import './App.css'
import Config from './components/Config'
import FileBrowser from './components/FileBrowser'
import { S3Provider } from './contexts/S3Context'

function App() {
  return (
    <S3Provider>
      <div className='App'>
        <Config />
        <FileBrowser />
      </div>
    </S3Provider>
  )
}

export default App
