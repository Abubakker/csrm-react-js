// Importing helper modules
import { useCallback, useMemo, useRef, useState } from 'react';

// Importing core components
import QuillEditor, { Quill } from 'react-quill';
// @ts-ignore
import QuillBetterTable from 'quill-better-table';

// Importing styles
import 'react-quill/dist/quill.snow.css';
import styles from './styles.module.css';

import commonApi from 'apis/common';

// Quill.register('modules/better-table', QuillBetterTable);

interface Props {
  onChange?: (value: string) => void;
  value?: string;
}

const Editor = ({ value, onChange }: Props) => {
  console.log('🚀  Editor  value:', value);
  // Editor state
  const [value1, setValue1] = useState('');
  console.log('🚀  Editor  value1:', value1);

  // Editor ref
  // @ts-ignore
  const quill = useRef<QuillType | null>(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    if (input.files) {
      input.onchange = async () => {
        // @ts-ignore
        const file = input.files[0];
        const { url } = await commonApi.uploadFile(file);
        const quillEditor = quill.current.getEditor();
        const range = quillEditor.getSelection(true);
        quillEditor.insertEmbed(range.index, 'image', url);
      };
    }
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ table: true }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote'],
          ['link', 'image'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ align: [] }],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    [imageHandler]
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
    'clean',
  ];

  return (
    <QuillEditor
      ref={(el) => (quill.current = el)}
      className={styles.editor}
      theme="snow"
      value={value}
      formats={formats}
      modules={modules}
      onChange={(value) => {
        onChange?.(value);
        setValue1(value);
      }}
    />
  );
};

export default Editor;
