// @flow

import React from 'react';
import { Editor } from 'react-draft-wysiwyg';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './styles.scss';

const CustomEditor = (props: Object) => (
  <Editor
    {...props}
    toolbar={{
      options: ['inline', 'list', 'textAlign', 'colorPicker', 'history'],
      inline: {
        inDropdown: false,
        options: ['bold', 'italic', 'underline', 'strikethrough'],
      },
    }}
  />
);

export default CustomEditor;
