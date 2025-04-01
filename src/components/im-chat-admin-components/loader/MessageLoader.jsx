import { LoadingOutlined } from '@ant-design/icons';
import { Space, Spin } from 'antd';

export const MessageLoader = () => (
  <Space className="flex justify-center items-center h-[500px]">
    <Spin
      indicator={
        <LoadingOutlined
          style={{ fontSize: 50, animationDuration: '0.5s' }}
          spin
        />
      }
    />
  </Space>
);
