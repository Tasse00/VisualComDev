import React from 'react';
import Icon from '@ant-design/icons';

const SVG = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <title>background</title>
      <rect
        fill="#fff"
        id="canvas_background"
        height="50"
        width="50"
        y="-1"
        x="-1"
      />
      <g
        display="none"
        overflow="visible"
        y="0"
        x="0"
        height="100%"
        width="100%"
        id="canvasGrid"
      >
        <rect
          fill="url(#gridpattern)"
          strokeWidth="0"
          y="0"
          x="0"
          height="100%"
          width="100%"
        />
      </g>
    </g>
    <g>
      <title>Layer 1</title>

      <rect
        id="svg_1"
        height="28"
        width="6"
        y="10"
        x="13"
        strokeWidth="1.5"
        fill="#000000"
      />
      <rect
        id="svg_2"
        height="28"
        width="6"
        y="10"
        x="29"
        strokeWidth="1.5"
        fill="#000000"
      />

      <rect
        id="svg_9"
        height="4"
        width="48"
        y="0"
        x="0"
        strokeOpacity="null"
        strokeWidth="0"
        stroke="#cccccc"
        fill="#7f7f7f"
      />
      <rect
        id="svg_10"
        height="4"
        width="48"
        y="44"
        x="0"
        strokeOpacity="null"
        strokeWidth="0"
        stroke="#cccccc"
        fill="#7f7f7f"
      />

      <line
        x1="0"
        y1="20"
        x2="48"
        y2="20"
        strokeWidth="4"
        stroke="grey"
        strokeDasharray="2,2"
      />
    </g>
  </svg>
);
// @ts-ignore
export default (props) => <Icon component={SVG} {...props} />;
