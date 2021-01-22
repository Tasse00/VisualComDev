import { Button, Card, Form, Input, List, Popconfirm, Select, Typography } from 'antd';
import React from 'react';
import { useEditor, useStoredPages } from '../Providers/Editor/hooks';
import dayjs from 'dayjs';
import { useComponentRegistryState } from '../Providers/ComponentRegistry/hooks';
const Creator: React.FC<{

}> = props => {
  const { stores, remove } = useStoredPages();

  const { components } = useComponentRegistryState();
  const dispatch = useEditor();


  const [form] = Form.useForm();

  const containerComponents = components.filter(com => com.isContainer);
  return (
    <>
      <Card
        title={<Typography.Title level={5}>新建页面</Typography.Title>}
        extra={<Button onClick={() => {
          form.validateFields().then(({ comId, name }) => {
            dispatch({
              type: 'init-editor',
              payload: { name, comId }
            })
          }).catch(e=>{});
        }} type='primary'>创建</Button>}
      >
        {/* 1. 新建 -> 选择Root */}

        <Form
          layout='horizontal'
          form={form}
          size='middle'
          initialValues={{ name: '', comId: '' }}
          requiredMark={false}
        >
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入页面名称' }]}>
            <Input placeholder='新页面名称...' />
          </Form.Item>
          <Form.Item label="容器" name='comId' required rules={[{ required: true, message: '请选择页面容器' }]}>
            <Select style={{ minWidth: 120 }} options={containerComponents.map(com => ({ label: com.title, value: com.guid }))} placeholder='页面容器...' />
          </Form.Item>
        </Form>
      </Card>
      <Card style={{ marginTop: 16 }}>
        {/* 2. 显示本地存储，从本地复制 */}
        <Typography.Title level={4}>本地存储</Typography.Title>

        <List
          style={{ marginTop: 8 }}
          // bordered
          dataSource={stores}
          renderItem={(store) => (
            <List.Item
              actions={[
                <Button key="load" size="small" onClick={() => {
                  dispatch({
                    type: 'load-tree',
                    payload: { tree: store.tree },
                  });
                }}>
                  加载
              </Button>
                ,

                <Popconfirm
                  key="save"
                  title="确认删除？"
                  onConfirm={() => remove(store.guid)}
                >
                  <Button size="small">删除</Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta title={store.name} description={dayjs(store.timestamp).format('YYYY-MM-DD HH:mm:ss')} />
            </List.Item>
          )}
        />
      </Card>
    </>
  )
}

export default Creator;