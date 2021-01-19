import React from 'react';


const TextComponent: React.FC<{
    text: string;
    size: string;
    color: string;
    family: string;
    align: 'left' | 'right' | 'justify' | 'center';
}> = (props) => {
    const {text, size, color, family, align} = props;
    return (
        <div style={{ fontSize: size, color: color, fontFamily: family, textAlign: align}}>
            {text}
        </div>
    );
};

const TextConfig: VCD.Component = {
    guid: 'text',
    title: '文本',
    component: TextComponent,
    properties: [
        { field: 'text', label: '文本', type: 'string', default: '文本' },
        { field: 'size', label: '字号', type: 'string' },
        { field: 'color', label: '颜色', type: 'string' },
        { field: 'align', label: '对齐', type: 'select', default: 'left', params: [
            {label: '左对齐', value: 'left'},
            {label: '右对齐', value: 'right'},
            {label: '居中', value: 'center'},
            {label: '两端对齐', value: 'justify'}
        ]},
        { field: 'family', label: '字体', type: 'string' },
        {
            field: 'weight', label: '粗细', type: 'select', params: [
                { value: 'normal', label: 'normal' },
                { value: 'bold', label: 'bold' },
                { value: 'bolder', label: 'bolder' },
                { value: 'lighter', label: 'lighter' },
                { value: '100', label: '100' },
                { value: '200', label: '200' },
                { value: '300', label: '300' },
                { value: '400', label: '400' },
                { value: '500', label: '500' },
                { value: '600', label: '600' },
                { value: '700', label: '700' },
                { value: '800', label: '800' },
                { value: '900', label: '900' },

            ]
        }
    ],
}


export default TextConfig