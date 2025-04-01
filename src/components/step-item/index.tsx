import React from 'react';
import { CheckOutlined } from '@ant-design/icons';
import classNames from 'classnames';

const StepItem = ({
  index,
  title,
  isCompleted,
  children,
  tips,
}: {
  index: number;
  title: string;
  isCompleted: boolean;
  children?: React.ReactNode;
  tips?: string;
}) => {
  return (
    <div>
      <div className="flex items-center border-b p-3 border-b-gray-200">
        <div
          className={classNames(
            'w-6 h-6 rounded-full text-white flex justify-center items-center mr-4 shrink-0',
            isCompleted ? 'bg-green-500' : 'bg-black'
          )}
        >
          {isCompleted ? <CheckOutlined /> : index}
        </div>

        <h3 className="mb-0 text-base shrink-0">{title}</h3>
        {tips && (
          <div className="text-xs lg:text-sm text-red-500 ml-4">{tips}</div>
        )}
      </div>

      <div>{children}</div>
    </div>
  );
};

export default StepItem;
