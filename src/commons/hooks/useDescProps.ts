import useIsMobile from 'commons/hooks/useIsMobile';
import type { Breakpoint } from 'antd';
import { MOBILE_BREAKPOINT_1 } from 'commons';
import { useState, useLayoutEffect } from 'react';

interface DescProps {
  size: 'middle' | 'small' | 'default';
  labelStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  column: number | Partial<Record<Breakpoint, number>>;
}

interface Props {
  mode?: number;
}

export const useDescProps = ({ mode = 1 }: Props) => {
  const isMobile = useIsMobile();
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  useLayoutEffect(() => {
    const update = () => {
      setInnerWidth(window.innerWidth);
    };

    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
    };
  }, []);

  if (isMobile && mode === 1) {
    const props: DescProps = {
      labelStyle: { width: '40%' },
      contentStyle: { width: '60%' },
      size: 'middle',
      column: 1,
    };
    return props;
  } else if(mode === 2) {
    if (innerWidth >= MOBILE_BREAKPOINT_1) {
      const props: DescProps = {
        labelStyle: { width: '15%' },
        contentStyle: { width: '35%' },
        size: 'middle',
        column: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2 },
      };
      return props;
    }
  }
  return undefined;
};
