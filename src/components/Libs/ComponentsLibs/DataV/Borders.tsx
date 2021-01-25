import React, { useMemo, useState } from 'react';
import { BorderBox1 } from '@jiaminghi/data-view-react';

/**
 * 外部:
 * - margin
 * - width / height
 * 内部:
 * - padding
 * - flex alignment
 *  - 内部排列方向
 *  - 主方向对齐
 *  - 次方向对齐
 *  - 弹性权重
 */

const Com = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <BorderBox1 ref={ref}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 300,
          }}
        >
          {props.children}
        </div>
      </BorderBox1>
    </div>
  );
});

const ContainerConfig: VCD.Component = {
  title: 'BorderBox1',
  guid: 'datav-BorderBox1',
  isContainer: true,
  component: Com,
  properties: [
    {
      field: 'alignment',
      type: 'alignment',
      label: '布局',
    },
  ],
  events: [],
  features: [],
};

export default ContainerConfig;
