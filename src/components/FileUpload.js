import React from 'react';
import Dropzone from 'react-dropzone';

const FileUpload = ({ children, disableClick }) => (
  <Dropzone
    className="ignore"
    onDrop={files => console.log('File Dropped!', files)}
    disableClick={disableClick}
  >
    {children}
  </Dropzone>
);

export default FileUpload;
