import React from 'react';
import Dropzone from 'react-dropzone';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const FileUpload = ({
  children, disableClick, channelId, mutate, style,
}) => (
  <Dropzone
    style={style}
    className="ignore"
    disableClick={disableClick}
    onDrop={async ([file]) => {
      const response = await mutate({
        variables: {
          channelId,
          file,
        },
      });
      console.log(response);
    }}
  >
    {children}
  </Dropzone>
);

const createFileMessageMutation = gql`
  mutation($channelId: Int!, $file: Upload) {
    createMessage(channelId: $channelId, file: $file)
  }
`;

export default graphql(createFileMessageMutation)(FileUpload);
