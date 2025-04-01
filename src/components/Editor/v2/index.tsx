import { useEffect, useRef, useCallback, useState } from 'react';
import Quill, { Range, EmitterSource } from 'quill';
import { Button, Space } from 'antd';
import Delta from 'quill-delta';
import './index.module.scss';
import commonApi from 'apis/common';
import 'quill/dist/quill.snow.css';
import classNames from 'classnames';
import { LoadingOutlined } from '@ant-design/icons';

// 参见：
// https://codepen.io/quill/pen/QxypzX
// https://quilljs.com/playground/react#codeN4Ig9AggDlB0BWBnEAuEBLAtlA9gJwBcACAJQFMBDAYwIBojgiBXRM8gM3pbIGUCKCZIgF8i7PDkxEA5Hko1pAbgA6AOyy5CRAKIATdAXxiJU6bDB6D+JWrVUcqxMQAiZADb8iAXiIBFJuhubrAa+AQAFNK67vzSAJQqqnYOTkTQUN5E4XHeAHwMakRE9o7EANp4FKoA5mT0rAQkVbUAupncfAJk2YlFJallbhROAMIAFs11RA0AMsME45NtPh38gj2FxSnlchS6APKqbgCe9WSNlAdHx8vMrJ3r7BRurAm2qkVgYEQAqqxEFCIcnYREMAKoVDIiEQoLGQgAjgEgkR0KUqpCiPo5DQTpt+sREYE3Bx2qwOBskh8gecmHgPuFNkUADz6ABuuUZRSITMshjwnK51PYXmAhKCHGEAq5uyuJxFMsOJ0lVMFRWiTyYHgAas8mGQRaoyAB3IiuDwUbJSwUhRxkQiRAAS7jcOHiVq5NtY9ukyjU0nojDheztKCIAEYRHF3UVPXaItIeJIhG6VaqY6ivfHUQZ0M9-QwiAAjHBuXShgh4PWR6NEWPemRR1NpuvxkqCVQEfOMJiqaJ4NyosjlytCYSNtPWjNxyK+1TxZUTogOHjuMg0dAORY1fXABpNbcLicOAAqZAAHgsJtuRbN5lvaofBWAOU3uWzikNoV5lCA2xIXj+L6LkyQyFu4QGLqQlxEIqxwoMA0gyI+E5MqiUBMAQNZFAQxxQPqP5UHCVAANbFmeP5YUQrK6juCrXMhi6bletQiuEZA5F4+R7pcsFsbA-B4LUBCwIRa7EWQuhxAxqrPu6TJgKB4FyYWGGGJSkEfsMiAAHIUJg+G-g4FYlogAC0eDoNUYyYSANY4Xh34gCpBBqRRr6CpuA4kaxHH5MAlHPNOYrEmQ7AibScgdgA-LAQkzGQNQEGM2RvO5XLCNJRQQYuADi5xECMRkJcQ8WJWMclgM5anZVy8lsjVzLvlQn46XpBlOF0gFyU1LW6fpjkdYIpkEAYbhkIBIwRcVpCTCgdXoOy7rAJU25EFFRAAFI8Ps2mwE4Fk1Og7DHOEK21DkobSNo2A4dI0nzYtr4sgtmnQn17VrONIANbVPVae9A2fcNo1fbkcypPeQ4PT9RTAJ+l6TGtm3bbt+2otUR0nfDkOwDgUCIBdMjXVAt33WA9WctDmypcIiRqOemjEOqFCasQ6SKCAtDgLy+AIMgaChFo5DUHQBbsPgRoUHgugcFwrDaOw7BrqL3BzMcOAYQrSs0HLbChSIxiSDIuwKHTqhfDo+h8iiMJVMwqh-iWY26FBItbNgDjFckpSW1YeCZOLeCS9L5KbOEjB0Sc9DM6zOpuHq9AnueCPbonqgrmN65MYjwj0MCvkFKm+JbB2FCDngJIrGSoXhKompuKlgrFzH2o0ZXdx6+w4QtwQcd6o3XLF0nF6Q+33DksPKfnb0g-bEu6erlnqij-rVed+Ey6LyN2fbqlnKqxQ6ua4ryvhNkeSF2mk8r2FVBTR2mTX8xZAzx5C+Z9vy-Pxw4V4JFxA+E3h-DcX9Jiv0jGbQU3Atan3PpxS+qpgS-3-jFBKFBCxjXCAAQkjscAeRRc5EAqKFPOPFrgtD3qmaBJ8aBnwLv5V8xc2xl0NP7HwzDy4-zvn-Yq4C+hzwkn7Qqpdy6ZA4aw2AFAYAJV0OMQIugGRpXEXaXGRpWHOBwHffSHYRK7EENoMa2j4xsniLQKU+DZ4+2CpkQ0Jp-BEjYlbfAwj+DlwDO6JKZB9KXUQKoHARp-RSjHJAxBoVkHTR8MFEJgojpZB7n3Tu4SOw5AYYuYKe1zguOKogbuoUWat3jok7h-8LEEPeGmdJDhwj2KCLAMgrJsmwGPNoAAGseAA+iMB0EBtI5W0PQcIsAhlS2qATC+qSjyqFPCPb+YTinFRioM4ZgkCZ8IgeU1UlTVDVKRMEepjSeDaBmNoEYx4ACSO1OndN6f0rIQzJErPoe6IBysQE3ySQQRZ9yRmrKCZQtMcgCC0npE8tKSD5kPx8HXIIaz+EiIkaiVhDpjwAFkZiZGkDYV8tNOSEOIewCh0TqRArpG+F6wIRTKIrqFYQuRoYz1zmoShPM8CwH0IgKAQxjjvQxSyrF9MzyM0xHk1mvs+Qcy5mAJwxwxqIBEtCVAIARJGX-DCCZ7LOWH1DOwMaZ4Z7FmliGcMUAzzTBLOgF2ABiCEVB9X4D7MNPGoYAAMM8oB7H0DUUMYZnUmsSMqNQyqOyqvMpZayCDMAjNRKZMa7ACChhZoYf17w9qfQjVG1Q3rfWmtdZscWHZTJPEwIEOCRBMAOBwBy6gL81ABtUKmrowMCBjQQfYF0eBQyWoAJw9pnoIC8w0VqIEDpgUMTBpF4CoMMGtqhhAgGEEAA

interface EditorProps {
  defaultValue?: Delta;
  onTextChange?: (...args: any[]) => void;
  onSelectionChange?: (...args: any[]) => void;
  value?: string;
  onChange?: (value: string) => void;
}

export interface EditorHandle {
  getHTML: () => string;
}

let counter = 0;

function base64ToFile(base64: string, filename: string): File {
  const [mimePart, dataPart] = base64.split(',');
  const mimeMatch = mimePart.match(/:(.*?);/);

  if (!mimeMatch) {
    throw new Error('Invalid base64 string');
  }

  const mimeType = mimeMatch[1];
  const binaryData = atob(dataPart);
  const length = binaryData.length;
  const u8arr = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    u8arr[i] = binaryData.charCodeAt(i);
  }

  return new File([u8arr], filename, { type: mimeType });
}

const Editor = ({ value, onChange }: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [state, setState] = useState(0);
  const [loading, setLoading] = useState(false);
  console.log("🚀  Editor  loading:", loading)
  //
  const [selectionChange, setSelectionChange] =
    useState<[Range, Range, EmitterSource]>();
  const [textChange, setTextChange] = useState<[Delta, Delta, EmitterSource]>();

  const handleImageUploadGetUrl = async (file: File) => {
    setLoading(true);
    return commonApi
      .uploadFile(file)
      .then(({ url }) => {
        return url;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 图片处理
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    if (input.files) {
      input.onchange = async () => {
        // @ts-ignore
        const file = input.files[0];
        const url = await handleImageUploadGetUrl(file);
        // @ts-ignore
        const range = quillRef.current?.getSelection(true);
        // @ts-ignore
        quillRef.current?.insertEmbed(range.index, 'image', url);
      };
    }
  }, []);

  // Mount 初始化
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div')
    );

    const quill = new Quill(editorContainer, {
      theme: 'snow',
      modules: {
        toolbar: {
          container: [
            [{ table: true }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ size: ['small', false, 'large', 'huge', '+1', '-1'] }],
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
        table: true,
      },
    });
    quillRef.current = quill;
    // 设置两个Ref 后刷新下
    setState((old) => old++);

    quill.on(Quill.events.TEXT_CHANGE, (...args) => {
      setTextChange(args);
    });
    quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
      setSelectionChange(args);
    });
    quill.on('text-change', (delta, oldDelta, source) => {
      if (source === 'user') {
        const ops = delta.ops;
        ops.forEach((op) => {
          // @ts-ignore
          if (op.insert && op.insert.image) {
            // @ts-ignore
            const file = base64ToFile(op.insert.image, 'image.png');
            handleImageUploadGetUrl(file).then((e) => {
              // @ts-ignore
              quill.deleteText(quill.getSelection().index - 1, 1); // 移除默认插入的图片
              const range = quillRef.current?.getSelection(true);
              // @ts-ignore
              quill.insertEmbed(range.index, 'image', e); // 插入图片到当前光标位置
            });
          }
        });
      }
    });

    return () => {
      quillRef.current = null;
      container.innerHTML = '';
    };
  }, [imageHandler]);

  // 默认值改变
  useEffect(() => {
    if (value && quillRef.current && counter === 0) {
      const htmlString = quillRef.current.clipboard.convert({
        html: value,
      }) as Delta;
      quillRef.current.setContents(htmlString);
      counter++;
    }
  }, [state, value]);

  // 内容改变后 传递出去
  useEffect(() => {
    if (textChange && quillRef.current) {
      onChange?.(quillRef.current.root.innerHTML);
    }
  }, [state, onChange, textChange]);

  //
  return (
    <div className="relative flex">
      <div ref={containerRef} className="h-[80vh] w-full"></div>
      <div
        className={classNames(
          'h-[80vh] w-full absolute justify-center items-center',
          !loading ? 'hidden' : 'flex'
        )}
        style={{ background: 'rgba(238, 238, 238,.4)' }}
      >
        <LoadingOutlined className="text-5xl" />
      </div>
      <div
        className={classNames(
          'h-[80vh] flex items-center justify-center',
          'absolute xl:right-[-140px] lg:right-[-120px] md:right-0 bottom-0'
        )}
      >
        <div className="flex flex-col">
          <Button
            size="small"
            onClick={() => {
              const table = quillRef.current?.getModule('table');
              // @ts-ignore
              table?.insertTable(3, 3);
            }}
          >
            Insert Table
          </Button>
          <Button
            size="small"
            onClick={() => {
              const table = quillRef.current?.getModule('table');
              // @ts-ignore
              table?.insertRowAbove();
            }}
          >
            Insert Row Above
          </Button>
          <Button
            size="small"
            onClick={() => {
              const table = quillRef.current?.getModule('table');
              // @ts-ignore
              table?.insertRowBelow();
            }}
          >
            Insert Row Below
          </Button>
          <Button
            size="small"
            onClick={() => {
              const table = quillRef.current?.getModule('table');
              // @ts-ignore
              table?.insertColumnLeft();
            }}
          >
            Insert Column Left
          </Button>
          <Button
            size="small"
            onClick={() => {
              const table = quillRef.current?.getModule('table');
              // @ts-ignore
              table?.insertColumnRight();
            }}
          >
            Insert Column Right
          </Button>
          <Button
            size="small"
            onClick={() => {
              const table = quillRef.current?.getModule('table');
              // @ts-ignore
              table?.deleteRow();
            }}
          >
            Delete Row
          </Button>
          <Button
            size="small"
            onClick={() => {
              const table = quillRef.current?.getModule('table');
              // @ts-ignore
              table?.deleteColumn();
            }}
          >
            Delete Column
          </Button>
          <Button
            size="small"
            onClick={() => {
              const table = quillRef.current?.getModule('table');
              // @ts-ignore
              table?.deleteTable();
            }}
          >
            Delete Table
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
