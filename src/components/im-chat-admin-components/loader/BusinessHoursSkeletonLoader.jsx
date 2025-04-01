import { Skeleton } from 'antd';

const BusinessHoursSkeletonLoader = () => {
  return (
    <div className="px-3">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="bg-[#EBEDF7] w-[316px] mt-2 rounded-lg p-3 flex justify-between items-center">
          <div className="flex flex-col">
            <Skeleton.Input style={{ width: 150 }} active size="small" />
            <Skeleton.Input style={{ width: 200, marginTop: 8 }} active size="small" />
          </div>
          <Skeleton.Button style={{ width: 32, height: 32 }} active shape="circle" />
        </div>
      ))}
    </div>
  );
};

export default BusinessHoursSkeletonLoader;
