import { Input, InputNumber, Table } from 'antd';
import React, { useCallback, useContext } from 'react';
import { ActTypes, VisualDispatcherContext, Widget } from './Visual';
import widgetSpecs from './widgets';

const StyleEditor: React.FC<{
    widget: Widget;
}> = props => {

    const dispatch = useContext(VisualDispatcherContext);

    const valueRenderFunc = useCallback((v, item) => {
        if (['flex'].includes(item.field)) {
            return (<InputNumber
                placeholder='default'
                min={0}
                style={{width: '100%'}}
                value={v}
                onChange={(v) => {
                    dispatch({
                        type: ActTypes.UPDATE_STYLE,
                        payload: {
                            widgetId: props.widget.id,
                            field: item.field,
                            value: v ? v.toString() : '',
                        }
                    });
                }}
            />)
        } else {
            return (
                <Input placeholder='default' value={v}
                    onChange={(v) => {
                        const value = v.target.value;
                        dispatch({
                            type: ActTypes.UPDATE_STYLE,
                            payload: {
                                widgetId: props.widget.id,
                                field: item.field,
                                value: value,
                            }
                        });
                    }}
                />)
        }

    }, [props.widget]);


    return (
        <Table size='small' pagination={false} dataSource={[
            { key: 'flex', field: 'flex', value: props.widget.style.flex },
            { key: 'width', field: 'width', value: props.widget.style.width },
            { key: 'height', field: 'height', value: props.widget.style.height },
        ]} showHeader={false}>
            <Table.Column title="field" dataIndex="field" key="field" />
            <Table.Column title="value" dataIndex="value" key="value" render={valueRenderFunc} />
        </Table>

    )
}


export default StyleEditor;