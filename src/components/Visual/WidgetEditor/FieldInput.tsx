import { Input, InputNumber, Select, Switch } from 'antd';
import React from 'react';


const FieldInputs: {
    [type: string]: (value: any, handler: (v: any) => void, params: any) => React.ReactNode;
} = {
    'string': (value, handler) => (
        <Input placeholder='default' value={value}
            onChange={(v) => handler(v.target.value)}
        />
    ),
    'number': (value, handler) => (
        <InputNumber
            placeholder='default'
            min={0}
            style={{ width: '100%' }}
            value={value ? parseInt(value) : undefined}
            onChange={(v) => handler(v)}
        />
    ),
    'switch': (value, handler) => (
        <Switch checked={value} onChange={v => handler(v)} />
    ),
    'select': (value, handler, params: { label: string; value: string }[]) => (
        <Select options={params} value={value} onChange={handler} style={{ width: '100%' }} />
    ),
}

export default FieldInputs;