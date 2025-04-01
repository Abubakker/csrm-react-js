import React from 'react';
import styles from './index.module.scss';

/**
 * 0、二十四栅格由于是百分比的形式，存在比例不一致的情况
 * 1、优化FormLabel的显示样式。Form样式比较复杂的时候再用
 * 2、使用此组件，必须在<Form />组件增加样式 className="renderLabel"
 *
 * @param param0
 * @returns
 */
export const RenderLabel = ({
  children,
  required,
  width = 110,
}: {
  children: any;
  required?: boolean;
  width?: number;
}) => (
  <div className={styles.form_label} style={{ width }}>
    {required && <div className={styles.form_required}></div>}
    {children}
  </div>
);

export default RenderLabel;
