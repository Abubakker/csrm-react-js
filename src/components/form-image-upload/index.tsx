import { PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { s3UploadUrl } from 'apis/cms';
import { getLocalStorageToken } from 'commons';
import { useMemo } from 'react';

const FormImageUpload = ({
  value,
  onChange,
  maxCount = 1,
}: {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  maxCount?: number;
}) => {
  const arr = useMemo(() => {
    if (!value) return [];

    return Array.isArray(value) ? value : [value];
  }, [value]);

  return (
    <div className="flex gap-4">
      {arr.map((url) => {
        return (
          <img
            key={url}
            src={url}
            alt=""
            className="w-36 object-contain border border-dashed"
          />
        );
      })}
      <Upload
        className="w-36 h-36 flex justify-center items-center border border-dashed rounded cursor-pointer"
        data={{
          loginToken: getLocalStorageToken(),
        }}
        action={s3UploadUrl}
        showUploadList={false}
        onChange={(e) => {
          const url = e.file?.response?.data?.url;

          if (!url) return;
          if (!onChange) return;

          if (maxCount === 1) {
            onChange(url);
          } else {
            if (!value) {
              onChange([url]);
            } else if (Array.isArray(value)) {
              onChange([...value, url]);
            } else {
              throw Error('当 value 为 string时, maxCount 必须为 1');
            }
          }
        }}
      >
        <PlusOutlined className="w-36 h-36 flex justify-center items-center" />
      </Upload>
    </div>
  );
};

export default FormImageUpload;
