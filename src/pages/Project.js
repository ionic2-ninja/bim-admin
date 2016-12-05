/**
 * Created by ruimin on 2016/12/5.
 */

'use strict';

import React, {Component} from 'react';
import {login, loadModel} from '../services/BimService';

import {Row, Col, Tree} from 'antd';
const TreeNode = Tree.TreeNode;


export default class Project extends Component {

  constructor(props) {
    super(props);

    this.state = {
      viewControl: null,
      treeData: null,
      selectedKeys: [],
    };
  }

  componentDidMount() {
    login().then(() => {
      loadModel(this.props.location.query.oid, this.props.location.query.lastRevisionId, 'bim').then((viewControl) => {
        viewControl.getTree().then((data) => {
          console.log('viewControl.getTree()', data);
          this.setState({
            viewControl: viewControl,
            treeData: data,
          });

          viewControl.onModelSelect(this.onModelSelect.bind(this));
        });
      });
    })
  }

  render() {
    return (
      <Row type="flex" justify="space-between">
        <Col span={6}>
          {this._renderTree()}
        </Col>
        <Col span={18}>
          <div id="bim" />
        </Col>
      </Row>
    );
  }

  _renderTree() {
    if (!this.state.treeData) {
      return null;
    }
    console.log('this.state.selectedKeys', this.state.selectedKeys);

    return (
      <Tree className="myCls" showLine defaultExpandAll
            defaultExpandedKeys={[]}
            onSelect={this.onSelect.bind(this)}
            selectedKeys={this.state.selectedKeys}
      >
        {this._renderTreeNodes(this.state.treeData)}
      </Tree>
    );
  }

  _renderTreeNodes(data) {
    if (data.children) {
      return (
        <TreeNode title={data.name} key={`${this.props.location.query.lastRevisionId}:${data.id}`}>
          {data.children.map((item) => (this._renderTreeNodes(item)))}
        </TreeNode>
      );
    }

    return <TreeNode title={data.name} key={`${this.props.location.query.lastRevisionId}:${data.id}`}/>
  }

  onSelect(node) {
    console.log('select node', node);
    this.state.viewControl.setSelection([node]);
  }

  onModelSelect(node) {
    console.log('onModelSelect', node);
    this.setState({
      selectedKeys: node,
    })
  }
}