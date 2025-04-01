import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { filesize } from 'filesize';
import { useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import linkifyHtml from 'linkify-html';
import { Spin, Input } from 'antd';
import {
  useCreateMessageMutation,
  useSendMediaUserMessageMutation,
  useUploadAttachmentMutation,
} from '../../../store/im-chat-stores/imManagerChatApi.js';
import {
  AttachmentIcon,
  CreateMessageIconActive,
  CreateMessageIconMuted,
  DocumentsIcon,
  EmojiIcon,
} from '../assets/IMChatIcons.jsx';
import AttachmentUploadComponent from '../AttachmentUploadComponent';
import EmojiUpload from '../EmojiUpload';
import { shortenString } from '../helpers/utils';
import 'react-quill/dist/quill.snow.css';

export enum AttachmentType {
  DOCUMENT = 'doc',
  PHOTO = 'photo',
}

interface MessageFormProps {
  inputRef: any;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
}

export const MessageForm = ({
  inputRef,
  inputValue,
  setInputValue,
}: MessageFormProps) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [activeEmoji, setActiveEmoji] = useState(false);
  const [attachments, setAttachments] = useState({ documents: [], photos: [] });
  const [errorMessage, setErrorMessage] = useState('');
  const [textCount, setTextCount] = useState(0);
  const [openAttachmentModal, setOpenAttachmentModal] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [imChatLoading, setImChatLoading] = useState(false);
  const [inputDelta, setInputDelta] = useState<any>({ ops: [] });

  const quillRef = useRef(null);
  const { TextArea } = Input;

  const { t } = useTranslation();
  const session = useSelector(
    (state: any) => state.imManagerSettings.selectedSession
  );
  const customer = useSelector(
    (state: any) => state.imManagerSettings.selectedCustomer
  );

  const [uploadAttachment] = useUploadAttachmentMutation();
  const [uploadTextMessage] = useCreateMessageMutation();
  const [sendMediaUserMessage, { isLoading, isSuccess }] =
    useSendMediaUserMessageMutation();

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  useEffect(() => {
    const editorToolbar = document.querySelector(
      '#inbox-input .ql-toolbar'
    ) as HTMLElement;

    if (editorToolbar) {
      if (isFocused) {
        editorToolbar.style.display = 'block';
      } else {
        editorToolbar.style.display = 'none';
      }
    }
  }, [isFocused]);

  useEffect(() => {
    const trimmedInput = inputValue.trim();
    let error = '';

    if (trimmedInput.length > 1000) {
      error = 'Message exceeds 1000 characters.';
      setErrorMessage(error);
    } else if (
      errorMessage !== 'Some files were too large. Limit is 10MB each'
    ) {
      setErrorMessage('');
    }

    setIsButtonDisabled(
      !(
        (trimmedInput.length > 0 && trimmedInput.length <= 1000) ||
        attachments.photos.length > 0 ||
        attachments.documents.length > 0
      ) || !!error
    );
  }, [inputValue, attachments, errorMessage]);

  const handleAttachmentUpload = (docs: any, from: any) => {
    const files = Array.from(docs);
    const maxFileSize = 10 * 1024 * 1024;

    const validFiles = files.filter(
      (file: any) => file.size <= maxFileSize
    ) as any;
    const invalidFiles = files.filter((file: any) => file.size > maxFileSize);

    if (invalidFiles.length > 0) {
      setErrorMessage(`Some files were too large. Limit is 10MB each`);
    } else {
      setErrorMessage('');
    }

    if (from === 'document-upload') {
      setAttachments({
        documents: validFiles,
        photos: attachments.photos,
      });
    } else if (from === 'photo-upload') {
      setAttachments({
        documents: attachments.documents,
        photos: [...attachments.photos, ...validFiles].slice(0, 9) as any,
      });
    }
  };

  const createMessage = async (blockList: any) => {
    await uploadTextMessage({
      session: session,
      data: {
        blockList: blockList,
      },
    }).unwrap();
  };

  const uploadFiles = async (photos: any) => {
    let uploadPromises = [] as any;

    photos.forEach((photo: any) => {
      uploadPromises.push(uploadAttachment({ file: photo }).unwrap());
    });

    let response = await Promise.allSettled(uploadPromises);

    let blockList = response
      .filter((response) => response.status === 'fulfilled')
      .map((response) => ({
        type: 'file',
        url: response.value.url,
        contentType: response.value.mimetype,
        originalName: response.value.originalname,
        sizeString: filesize(response.value.size, { standard: 'jedec' }),
      }));

    if (blockList?.length > 0) {
      await createMessage(blockList);
    }
  };

  const handleInputChange = (value: any) => {
    if (value.length <= 1000) {
      setTextCount(value.length);
      setInputValue(value);
    }
  };

  const handleEditorChange = (
    value: any,
    delta: any,
    source: any,
    editor: any
  ) => {
    setInputDelta(editor.getContents());

    if (value.length <= 1000) {
      setTextCount(value.length);

      const linkedContent = linkifyHtml(value, {
        defaultProtocol: 'https',
      });
      setInputValue(linkedContent);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const hasInput = inputValue.trim().length > 0;
    const hasAttachments =
      attachments.photos.length > 0 || attachments.documents.length > 0;

    if (hasInput || hasAttachments) {
      if (customer.media_type === 'im chat') {
        setImChatLoading(true);
        if (isButtonDisabled) return;
        if (attachments.photos.length) {
          await uploadFiles(attachments.photos);
        } else if (attachments.documents.length) {
          await uploadFiles(attachments.documents);
        } else if (
          inputValue.trim().length > 0 &&
          inputValue.trim().length <= 250
        ) {
          let blockList = [
            {
              type: 'text',
              value: JSON.stringify(inputDelta.ops),
            },
          ];
          await createMessage(blockList);
        }
        setInputValue('');
        setAttachments({ documents: [], photos: [] });
        setErrorMessage('');
        setImChatLoading(false);
      } else {
        const files = [...attachments.photos, ...attachments.documents].flat();

        const formData = new FormData();
        formData.append('recipientId', session?.identifier);
        formData.append('messageText', inputValue);

        if (inputValue.trim().length > 0) {
          formData.append('type', 'text');
        } else {
          formData.append('type', 'media');
        }

        formData.append('mediaType', customer?.media_type);

        files.forEach((file) => {
          formData.append('files', file);
        });

        sendMediaUserMessage({
          data: formData,
          mediaType: customer?.media_type,
        });
      }
    }
  };

  const handleKeyDown = (e: any) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setInputValue('');
      setAttachments({ documents: [], photos: [] });
      setErrorMessage('');
    }
  }, [isSuccess, setInputValue, setAttachments, setErrorMessage]);

  const formatFileSize = (bytes: any) => {
    if (bytes === 0) return '0 Bytes';

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const cancelAttachment = (type: any, index: number) => {
    if (type === 'doc') {
      const remainingDocs = attachments.documents.filter((_, i) => i !== index);
      setAttachments((prev) => ({ ...prev, documents: remainingDocs }));
    } else {
      const remainingPhotos = attachments.photos.filter((_, i) => i !== index);
      setAttachments((prev) => ({ ...prev, photos: remainingPhotos }));
    }
  };

  const handleDrop = (event: any) => {
    event.preventDefault();

    const files = Array.from(event.dataTransfer.files);
    handleAttachmentUpload(files, 'photo-upload');
  };

  const handlePaste = (event: any) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;
    for (const item of items) {
      if (item.kind === 'file') {
        handleAttachmentUpload([item.getAsFile()], 'photo-upload');
      }
    }
  };

  return (
    <div className="p-3 bg-white">
      <form
        className="flex gap-3 justify-between items-end"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-[10px] w-[58px]">
          <button
            type="button"
            disabled={isLoading}
            className="relative bg-transparent w-6 h-6 flex items-center justify-center p-0"
            onClick={() => {
              // setAttachments({ documents: [], photos: [] });
              setErrorMessage('');
              setOpenAttachmentModal((prevState) => !prevState);
            }}
          >
            <AttachmentIcon />
          </button>
          <button
            type="button"
            disabled={isLoading}
            className="relative bg-transparent w-6 h-6 flex items-center justify-center p-0"
            onClick={() => setActiveEmoji(!activeEmoji)}
          >
            <EmojiIcon />
          </button>
          <EmojiUpload
            activeEmoji={activeEmoji}
            onClose={() => setActiveEmoji(false)}
            setInputValue={setInputValue}
            quillRef={quillRef}
          />
          <AttachmentUploadComponent
            onClose={() => setOpenAttachmentModal(false)}
            handleAttachmentUpload={handleAttachmentUpload}
            opened={openAttachmentModal}
          />
        </div>
        <div
          id="inbox-input"
          className="rounded-[10px] min-h-10 max-h-[125px] border border-[#DADDEB] px-3 py-1 w-[calc(100%-122px)] font-NotoSans flex items-end justify-between gap-2 relative"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onPaste={handlePaste}
        >
          <div className="w-[calc(100%-55px)]">
            {customer.media_type === 'im chat' ? (
              <ReactQuill
                ref={quillRef}
                theme="snow"
                placeholder={`${t('write_your_message')}`}
                value={inputValue}
                onChange={handleEditorChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline', { list: 'bullet' }, 'link'],
                  ],
                }}
                formats={['bold', 'italic', 'underline', 'bullet', 'link']}
              />
            ) : (
              <TextArea
                className="w-full !min-h-8 border-none focus:outline-none focus:ring-0 resize-none outline-none hover:outline-none hover:border-none p-0 no-scrollbar"
                placeholder={`${t('write_your_message')}`}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                autoSize={{
                  maxRows: 3,
                  minRows: 1,
                }}
              />
            )}
            <div>
              <div className="flex gap-2">
                {attachments.documents?.map((doc: any, index: number) => (
                  <div
                    key={index}
                    className="bg-[#EBEDF7] rounded-[10px] p-3 flex gap-3 items-center relative h-[62px] mt-1"
                  >
                    <div
                      onClick={() => cancelAttachment('doc', index)}
                      className="absolute w-5 h-5 p-1 rounded-full bg-[#9EA1B5] text-white flex justify-center items-center right-[-8px] top-[-8px] cursor-pointer"
                    >
                      x
                    </div>
                    <div className="p-[4px] rounded-full bg-[#FFFFFF] flex justify-center items-center w-8 h-8">
                      <DocumentsIcon />
                    </div>
                    <div>
                      <p className="text-[#3F4252] font-bold mb-0 leading-[20px] text-[14px]">
                        {shortenString(doc.name, 20)}
                      </p>
                      <p className="text-[#9EA1B5] font-medium mb-0 leading-[18px] text-[12px]">
                        {formatFileSize(doc.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-[10px] items-end overflow-x-auto vertical-scrollbar py-1">
                {attachments.photos?.map((photo, index) => (
                  <div className="relative border rounded-[10px] border-[#EBEDF7] mt-1">
                    <div
                      onClick={() => cancelAttachment('photo', index)}
                      className="absolute w-5 h-5 p-1 rounded-full bg-[#9EA1B5] text-white flex justify-center items-center right-[-8px] top-[-8px] cursor-pointer"
                    >
                      x
                    </div>
                    <div className="w-[60px] h-[60px] overflow-hidden">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt=""
                        className="w-full h-full rounded-[10px] object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-[#C5C8D9] text-[10px] mb-0">{textCount}/1000</p>
        </div>
        <button
          className="flex items-center justify-center bg-transparent w-10 p-0"
          type="submit"
          disabled={isButtonDisabled || isLoading || imChatLoading}
        >
          {(isLoading || imChatLoading) && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
            />
          )}
          {!isLoading &&
            !imChatLoading &&
            (isButtonDisabled ? (
              <CreateMessageIconMuted />
            ) : (
              <CreateMessageIconActive />
            ))}
        </button>
      </form>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1 ml-14">{errorMessage}</p>
      )}
    </div>
  );
};
