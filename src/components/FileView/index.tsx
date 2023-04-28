import React, { useState, useEffect } from 'react'
import { useS3Context } from '../../contexts/S3Context'
import { listObjects, createObject, deleteObject } from '../../utils/s3'
import { _Object } from '@aws-sdk/client-s3'
import { createObjectWithContent, getFileContent } from '../../utils/s3'
import PromptModal from './PromptModal';

import './FileView.css'

interface FileViewProps {
  currentDir: string
}

const FileView: React.FC<FileViewProps> = ({ currentDir = 'root/' }) => {
  const { s3 } = useS3Context()
  const [objects, setObjects] = useState<_Object[]>([])
  const [updateKey, setUpdateKey] = useState(0)
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  

  useEffect(() => {
    if (s3) {
      listObjects(s3, currentDir).then((data) => setObjects(data.contents));
    }
  }, [s3, currentDir]);

  const handleDeleteObject = async (key: string | undefined) => {
    if (key && s3 ) { 
      await deleteObject(s3, key);
      const updatedObjects = await listObjects(s3, currentDir);
      setObjects(updatedObjects.contents);
      setUpdateKey((prevKey) => prevKey + 1);
    }
  };

  const handleCreateFileSubmit = async (fileName: string, fileContent: string) => {
    if (fileName && s3) {
      if (fileContent && fileContent.length <= 32) {
        await createObjectWithContent(s3, `${currentDir}${fileName}`, fileContent);
        setUpdateKey((prevKey) => prevKey + 1);
      } else {
        alert('File content must be 32 characters or less.');
      }
      const updatedObjects = await listObjects(s3, currentDir);
      setObjects(updatedObjects.contents);
    }
  };

  const handleCreateDirectorySubmit = async (dirName: string) => {
    if (dirName && s3) {
      await createObject(s3, `${currentDir}${dirName}/`, '', 'application/x-directory');
      const updatedObjects = await listObjects(s3, currentDir);
      setObjects(updatedObjects.contents);
      setUpdateKey((prevKey) => prevKey + 1);
      setIsFileModalOpen(true);
    }
  };
  

  const handleFileClick = async (key: string) => {
    setFileName(key); 
    if (s3) {
      const content = await getFileContent(s3, key);
      console.log('Content fetched:', content); 
      setFileContent(content || '');
    }
    setIsContentModalOpen(true);
  };
 

  const isDirectory = (key: string) => key.endsWith('/')

  return (
    <div>
       {s3 && (
        <div className="file-view">
         <p>Current working directory: {currentDir ? currentDir : 'root/'}</p>
               {objects.map((obj: _Object) => (
                    <div
                      key={obj.Key}
                      className="file-view-div"
                      style={{
                        paddingLeft: isDirectory(obj.Key!) ? "10px" : "30px",
                      }}
                    >
                      <div onClick={() => !isDirectory(obj.Key!) && handleFileClick(obj.Key!)}>
                        {isDirectory(obj.Key!) ? (
                          <strong>{obj.Key}</strong>
                        ) : (
                          obj.Key
                        )}
                      </div>
                      <div>
                      {!isDirectory(obj.Key!) && (
                        <button
                          onClick={() => handleDeleteObject(obj.Key)}
                          style={{ marginLeft: "10px" }}
                        >
                          Delete
                        </button>
                      )}
                      </div>
                    </div>
                  ))}
              <div className='button-create'>
            <button onClick={() => setIsFileModalOpen(true)} style={{ marginTop: '10px' }}>
                New File
              </button>
              <button onClick={() => setIsDirectoryModalOpen(true)} style={{ marginTop: '10px' }}>
             New Directory
            </button>
              </div>
          </div>
            )}
          <div>
            <PromptModal
              isOpen={isFileModalOpen}
              title="Enter the file name:"
              titleContent="Enter the file content (up to 32 characters):"
              content="" 
              onSubmit={(fileName, fileContent) => {
                handleCreateFileSubmit(fileName, fileContent);
                setIsFileModalOpen(false);
              }}
              onClose={() => setIsFileModalOpen(false)}
            />
            <PromptModal
              isOpen={isDirectoryModalOpen}
              title="Enter the directory name:"
              titleContent=""
              content="" 
              onSubmit={(dirName, _) => {
                handleCreateDirectorySubmit(dirName);
                setIsDirectoryModalOpen(false);
              }}
              onClose={() => setIsDirectoryModalOpen(false)}
            />
          </div>
          <PromptModal
          isOpen={isContentModalOpen}
          title="File Content"
          titleContent=""
          content={fileContent}
          onSubmit={() => {}}
          onClose={() => setIsContentModalOpen(false)}
          readOnly={true}
          />
      
    </div>
  )
}


export default FileView
