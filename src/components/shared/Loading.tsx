import { Spin } from 'antd';

const Loading: React.FC = () => {
    return (
        <div className="min-h-[80vh] flex justify-center items-center">
            <Spin size="large" />
        </div>
    );
};

export default Loading;