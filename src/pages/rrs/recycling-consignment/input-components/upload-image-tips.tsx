import { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Upload, Modal } from 'antd';
import { s3UploadUrl } from 'apis/cms';
import { getLocalStorageToken } from 'commons';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';
import { getUploadImageObj } from 'constants/RecyclingConsignment';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface Props {
  max?: number;
  showTips?: boolean;
  onChange?: (data: string[] | string) => void;
  value?: string;
  uploadList?: string[];
}

const UploadImageTips = ({
  max = 2,
  onChange,
  showTips = false,
  uploadList = [],
}: Props) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    if (!uploadList || uploadList.length === 0) return;
    const files = uploadList.map((d: string, i: number) =>
      getUploadImageObj(d, i)
    );
    setFileList(files);
  }, [uploadList]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    );
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  useEffect(() => {
    const list: string[] = [];
    fileList.forEach((d: UploadFile) => {
      if (d.status === 'done') {
        list.push(d.response.data.url);
      }
    });
    if (list.length === 0) {
      if (onChange) onChange('');
      return;
    }
    if (onChange) onChange(JSON.stringify(list));
  }, [fileList]);

  return (
    <div className={styles.UploadImageTips}>
      <Upload
        data={{
          loginToken: getLocalStorageToken(),
        }}
        accept="image/*"
        listType="picture-card"
        action={s3UploadUrl}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={(e) => {
          const { fileList: newFileList } = e;
          setFileList(newFileList);
        }}
      >
        {fileList.length >= max ? null : <UploadOutlined />}
      </Upload>
      {showTips && <div className={styles.tips}>*上传图片最多{max}张</div>}

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};
export default UploadImageTips;
