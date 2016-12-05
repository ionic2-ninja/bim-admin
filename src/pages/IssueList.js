/**
 * Created by ruimin on 2016/11/30.
 */

'use strict';

import React, { Component } from 'react';

import { Table, Icon, Modal, Form, Input, Tooltip, Upload, message, Button } from 'antd';
const FormItem = Form.Item;

const columns = [{
  title: '名称',
  dataIndex: 'title',
  key: 'title',
  render: text => <a href="#">{text}</a>,
}, {
  title: '对应组件',
  dataIndex: 'img',
  key: 'img',
  render: text => <img width={200} src={text} />,
},  {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="#">标记为已解决</a>
      <span className="ant-divider" />
      <a href="#">删除</a>
      <span className="ant-divider" />
      <a href="#" className="ant-dropdown-link">
        更多操作<Icon type="down" />bimsurfer
      </a>
    </span>
  ),
}];

const data = [{
  key: '1',
  title: '此处尚未完成',
  block: 'Door',
  img: '/door.png',
}, {
  key: '2',
  title: '这个地方有漏洞，需要解决！！',
  block: 'Outer Wall V',
  img: '/img1.png',
}];

class IssueList extends Component {

  render() {
    return (
      <div>
        <Table columns={columns} dataSource={data} />
        {this._renderModal()}
      </div>
    );
  }

  _renderModal() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const requireRule = {required: true, message: '真的不打算写点什么吗？'};
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal title="新增报告" visible={false}
             onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}
      >
        <Form horizontal>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="名称"
          >
            {
              getFieldDecorator('name', { rules: [requireRule] })(
                <Input type="text" placeholder="请输入名称" />
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="报告所属组件"
          >
            {
              getFieldDecorator('block', { rules: [requireRule] })(
                <Input type="text" placeholder="" />
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="上传图片或视频"
          >
            <Upload {...this.uploadProps}>
              <Button type="ghost">
                <Icon type="upload" /> ------ 点击上传 ------
              </Button>
            </Upload>
          </FormItem>
          <FormItem
            {...formItemLayout}
            hasFeedback
            label="详细说明"
          >
            {
              getFieldDecorator('content', {  })(
                <Input type="textarea" rows={5} placeholder="详细说明" />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }

  handleOk() {
    console.log('Clicked OK');
    this.setState({
      visible: false,
    });
  }

  handleCancel(e) {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

}

export default IssueList = Form.create()(IssueList);