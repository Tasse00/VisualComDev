import React from 'react';
// @ts-ignore
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

function hex2int(hex: string) {
  let len = hex.length, a = new Array(len), code;
  for (let i = 0; i < len; i++) {
    code = hex.charCodeAt(i);
    if (48 <= code && code < 58) {
      code -= 48;
    } else {
      code = (code & 0xdf) - 65 + 10;
    }
    a[i] = code;
  }

  return a.reduce(function (acc, c) {
    acc = 16 * acc + c;
    return acc;
  }, 0);
}

function debounce(fn: Function, delay: number) {
  let timer: number | null = null //借助闭包
  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer)
    }
    const cb: TimerHandler = ()=>{
      fn(...args);
    };
    timer = setTimeout(cb, delay) // 简化写法
  }
}


const Color: VCD.PropertyEditorComponent<string, any> = props => {
  const { update, value, params } = props;
  let alpha = 100;
  let color = "#FFFFFF";

  if ((value||'').match(/^#[0-9|a-z|A-Z]{8}$/)) {
    alpha = hex2int(value.slice(7, 9)) / 255 * 100;
    color = value.slice(0, 7)
  } else {
    color = value;
  }

  const onUpdate = debounce(({ color, alpha }) => {
      
    const colorWithAlpha = color + Math.round(alpha / 100 * 255).toString(16)
    update(colorWithAlpha);
  }, 200);
  return (
    <ColorPicker color={color} alpha={alpha} onChange={onUpdate} />
  )
}

export default Color;