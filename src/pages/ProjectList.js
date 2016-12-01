/**
 * Created by ruimin on 2016/11/30.
 */

'use strict';

import React, { Component } from 'react';

import { Table, Icon, Modal, Form, Input, Tooltip, Upload, message, Button } from 'antd';
const FormItem = Form.Item;

const columns = [{
  title: '名称',
  dataIndex: 'name',
  key: 'name',
  render: text => <a href="#">{text}</a>,
},  {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="#">进入 一 {record.name}</a>
      <span className="ant-divider" />
      <a href="#">删除</a>
      <span className="ant-divider" />
      <a href="#" className="ant-dropdown-link">
        更多操作<Icon type="down" />
      </a>
    </span>
  ),
}];

const data = [{
  key: '1',
  name: 'xx车站图',
}, {
  key: '2',
  name: 'yy市郊野汽车站图',
}, {
  key: '3',
  name: 'zz区中心站图',
}];

class ProjectList extends Component {

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
      <Modal title="新增项目" visible={true}
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
            label="导入IFC"
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
                <Input type="textarea" rows={10} placeholder="详细说明" />
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

export default ProjectList = Form.create()(ProjectList);