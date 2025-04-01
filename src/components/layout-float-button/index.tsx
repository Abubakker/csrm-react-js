import { RollbackOutlined, SyncOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

const LayoutFloatButton = () => {
  // 处理返回顶部的点击事件
  //   const scrollToTop = () => {
  //     console.log('🚀  scrollToTop  scrollToTop:');
  //     window.scrollTo({
  //       top: 0,
  //       behavior: 'smooth', // 添加平滑滚动效果
  //     });
  //   };

  return (
    <div className="hidden md:block">
      <FloatButton.Group shape="square" style={{ right: 94 }}>
        <FloatButton
          icon={<RollbackOutlined />}
          onClick={() => window.history.back()}
        />
        <FloatButton
          icon={<SyncOutlined />}
          onClick={() => window.location.reload()}
        />
        {/* <FloatButton.BackTop
          visibilityHeight={0}
          onClick={() => scrollToTop()}
        /> */}
      </FloatButton.Group>
    </div>
  );
};

export default LayoutFloatButton;
