import React from 'react';

const Panel: React.FC<{
  style?: React.CSSProperties;
}> = (props) => {
  return (
    <div
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: 16,
        ...(props.style || {}),
      }}
    >
      {props.children}
    </div>
  );
};

export default Panel;
