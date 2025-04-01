import { MOBILE_BREAKPOINT } from 'commons';
import { useLayoutEffect, useState } from 'react';

const useIsMobile = (breakPoint: number = MOBILE_BREAKPOINT) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakPoint);

  useLayoutEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < breakPoint);
    };

    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
    };
  }, [breakPoint]);

  return isMobile;
};

export default useIsMobile;
