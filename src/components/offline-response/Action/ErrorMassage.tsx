import { PropsWithChildren } from 'react';

const ErrorMassage = ({ children }: PropsWithChildren) => {
  return <div className="text-red-500 text-xs mt-2">{children}</div>;
};
export default ErrorMassage;
