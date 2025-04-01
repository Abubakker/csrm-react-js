import { Upload, Image, Button, Modal, Checkbox } from 'antd';
import { getLocalStorageToken } from 'commons';
import styles from './index.module.scss';
import { s3UploadUrl } from 'apis/cms';
import {
  PlusOutlined,
  SelectOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
  SortableHandle,
} from 'react-sortable-hoc';
import commonApi from 'apis/common';
import { useToggle } from 'react-use';
import useResource from 'commons/hooks/useResource';
import { useEffect, useState } from 'react';

interface ImageType {
  url: string;
  name: string;
}

type ImageUploaderProps = {
  // 单张图片还是图片列表
  mode?: 'single' | 'multiple';
  // 图片 src 列表
  imgList: ImageType[];
  // 回调函数
  onChange: (list: ImageUploaderProps['imgList']) => void;

  autoSort?: boolean;

  showRemoveBackground?: boolean;

  max?: number;
};

const RemoveBackgroundButton = ({
  url,
  onSuccess,
}: {
  url: string;
  onSuccess: (url: string) => void;
}) => {
  const [loading, toggleLoading] = useToggle(false);
  const [open, toggleOpen] = useToggle(false);
  const [addShadow, toggleAddShadow] = useToggle(true);

  return (
    <>
      <Modal
        title="画像編集"
        confirmLoading={loading}
        open={open}
        onOk={async () => {
          toggleLoading();
          const newUrl = await commonApi.photoRoomRemoveBackground({
            url,
            addShadow,
          });
          toggleLoading();
          toggleOpen();
          onSuccess(newUrl);
        }}
        onCancel={toggleOpen}
      >
        <div className="flex">
          影を追加する：
          <Checkbox
            checked={addShadow}
            onChange={(e) => {
              toggleAddShadow(e.target.checked);
            }}
          ></Checkbox>
        </div>
      </Modal>
      <Button
        onClick={toggleOpen}
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="w-4 h-4 mt-[2px]"
          >
            <path
              fillRule="evenodd"
              d="M2 11H3V6C3 4.34314 4.34326 3 6 3H18C19.6567 3 21 4.34314 21 6V11H22C22.5522 11 23 11.4477 23 12C23 12.5523 22.5522 13 22 13H21V18C21 19.6569 19.6567 21 18 21H6C4.34326 21 3 19.6569 3 18V13H2C1.44775 13 1 12.5523 1 12C1 11.4477 1.44775 11 2 11ZM18 5H6C5.44775 5 5 5.44769 5 6V11H19V6C19 5.44769 18.5522 5 18 5ZM16.2929 13H13.7071L7.70711 19H10.2929L16.2929 13ZM11.7071 19L17.7071 13H19V14.2929L14.2929 19H11.7071ZM15.7071 19H18C18.5522 19 19 18.5523 19 18V15.7071L15.7071 19ZM6.29289 19L12.2929 13H9.70711L5 17.7071V18C5 18.5523 5.44775 19 6 19H6.29289ZM5 16.2929L8.29289 13H5V16.2929Z"
              clipRule="evenodd"
            ></path>
          </svg>
        }
      ></Button>
    </>
  );
};

const ImageUploader = ({
  mode,
  imgList,
  onChange,
  autoSort = true,
  showRemoveBackground = true,
  max,
}: ImageUploaderProps) => {
  const DragHandle = SortableHandle(() => <Button icon={<SelectOutlined />} />);
  const canRemoveBackground = useResource('product-image-remove-background');

  const SortableItem = SortableElement(({ value }: { value: string }) => {
    return (
      <div className="flex flex-col ml-2">
        <div className="flex w-32 h-32 object-contain">
          <Image
            className="object-contain w-32 h-32"
            width={128}
            height={128}
            key={value}
            src={value}
            alt={value}
          />
        </div>
        <div className="flex justify-between mt-2">
          <DragHandle />

          {canRemoveBackground && showRemoveBackground && (
            <RemoveBackgroundButton
              url={value}
              onSuccess={(newUrl) => {
                const list = [...imgList];
                const i = list.findIndex((d) => d.url === value);
                list[i].url = newUrl;
                onChange(list);
              }}
            />
          )}
          <Button
            icon={<DeleteOutlined />}
            onClick={() => onChange(imgList.filter((d) => d.url !== value))}
          />
        </div>
      </div>
    );
  });

  const SortableList = SortableContainer(
    ({ items }: { items: ImageUploaderProps['imgList'] }) => {
      return (
        <div className="flex">
          <Image.PreviewGroup
            preview={{
              onChange: (current, prev) =>
                console.log(`current index: ${current}, prev index: ${prev}`),
            }}
          >
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
              {items.map((value, index) => (
                <SortableItem
                  key={`item-${value}`}
                  index={index}
                  // @ts-ignore
                  value={value}
                />
              ))}
            </div>
          </Image.PreviewGroup>
        </div>
      );
    }
  );

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    onChange(arrayMove(imgList, oldIndex, newIndex));
  };

  const isMultiple = { multiple: mode === 'multiple' };
  const [sortedList, setSortedList] = useState<ImageType[]>([]);

  useEffect(() => {
    setSortedList(imgList);
  }, [imgList]);

  // 提取文件名中的数字部分
  const extractNumber = (fileName: string) => {
    const match = fileName.match(/(?:_)?(\d+)\./);
    return match ? parseInt(match[1], 10) : 0;
  };

  // 排序函数
  const sortByFileName = (list: ImageType[]) => {
    return list.sort((a, b) => extractNumber(a.name) - extractNumber(b.name));
  };

  return (
    <div>
      <SortableList
        // @ts-ignore
        items={sortedList.map((d) => d.url)}
        pressDelay={1}
        onSortEnd={onSortEnd}
        axis="xy"
        useDragHandle
      />

      {!!max && imgList.length >= max ? null : (
        <div className="mr-2 mt-2">
          <Upload
            data={{
              loginToken: getLocalStorageToken(),
            }}
            {...isMultiple}
            className={styles.imageUploader}
            listType="picture-card"
            showUploadList={false}
            action={s3UploadUrl}
            onChange={(e) => {
              const url = e.file?.response?.data?.url;
              const name = e.file?.name;
              if (url) {
                if (mode === 'single') {
                  // 单图模式：直接替换现有值
                  const updatedList = [{ url, name }];
                  setSortedList(updatedList);
                  onChange(updatedList);
                } else {
                  // 多图模式：按文件名排序并更新
                  const updatedList = autoSort
                    ? sortByFileName([...sortedList, { url, name: name }])
                    : [...sortedList, { url, name: name }];
                  setSortedList(updatedList);
                  onChange(updatedList);
                }
              }
            }}
          >
            <PlusOutlined />
          </Upload>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
