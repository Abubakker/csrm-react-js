import { Image } from 'antd';
import styles from './index.module.scss';
import { memo, CSSProperties, useState, useEffect } from 'react';

type Props = {
  // 图片 src 列表
  imgList: string[];
  // 显示 分割开始的下标
  startSliceNumber?: number;
  // 显示 分割结束的下标
  endSliceNumber?: number;
  // 宽度
  width?: number;
  // 样式
  style?: CSSProperties;
};

const ImageSliceShow = ({
  imgList = [],
  startSliceNumber = 0,
  endSliceNumber = 3,
  width = 64,
  style = { marginRight: 6 },
}: Props) => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    return () => {
      setCurrent(0);
    };
  }, []);

  return (
    <div className={styles.ImageSliceShow}>
      <Image.PreviewGroup
        items={imgList}
        preview={{
          visible,
          current,
          movable: false,
          onChange: (current) => setCurrent(current),
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      >
        {imgList.slice(startSliceNumber, endSliceNumber).map((d, i) => (
          <div style={{ ...style }} key={d}>
            <Image
              width={width}
              height={width}
              src={d}
              style={{ objectFit: 'contain' }}
              onClick={(e) => {
                setCurrent(i);
              }}
            />
          </div>
        ))}
      </Image.PreviewGroup>
      {/* {endSliceNumber < imgList.length && endSliceNumber !== imgList.length ? (
        <div
          className={styles.more}
          onClick={() => {
            setVisible(true);
            setCurrent(endSliceNumber);
          }}
        >
          {i18n.t('view')}
        </div>
      ) : null} */}
    </div>
  );
};

export default memo(ImageSliceShow);
