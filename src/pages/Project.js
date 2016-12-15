/**
 * Created by ruimin on 2016/12/5.
 */

'use strict';

import React, {Component} from 'react';
import {login, loadModel} from '../services/BimService';

import {Row, Col, Tree, Button, Input, Form, Card, Modal, Icon} from 'antd';
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;


class Project extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewControl: null,
            treeData: null,
            selectedKeys: [],
            selectedName: '',
            issuesMap: {},
            visible: false,
        };
    }

    componentDidMount() {
        login().then(() => {
            loadModel(this.props.location.query.oid, this.props.location.query.lastRevisionId, 'bim').then((viewControl) => {
                viewControl.getTree().then((data) => {
                    console.log('viewControl.getTree()', data);
                    viewControl.showModelTree(data, document.getElementById('bim-tree'));

                    this.setState({
                        viewControl: viewControl,
                        treeData: data,
                    });

                    viewControl.onModelSelect(this.onModelSelect.bind(this));
                });
            });
        });

        // this.draw()
    }

    // draw() {
    //     var ctx = document.getElementById('2dcanvas').getContext('2d');
    //     var img = new Image();
    //     img.onload = function () {
    //         ctx.drawImage(img, 0, 0);
    //         ctx.beginPath();
    //         ctx.moveTo(30, 96);
    //         ctx.lineTo(70, 66);
    //         ctx.lineTo(103, 76);
    //         ctx.lineTo(170, 15);
    //         ctx.stroke();
    //     }
    //     img.src = 'favicon.ico';
    // }

    confirm() {
        this.setState({
            visible: false,
        })
        this.domHide && (this.domHide.style.display = '');

        let canvas = document.getElementById('capture_picture');
        let image = canvas.toDataURL('image/png');
        // document.getElementById('image11').src = image;
        // console.log('dadew33', image);
        let virtualImage = new Image();
        virtualImage.src = image;
        virtualImage.onload = () => {
            var _canvas = new window['fabric'].Canvas('imageCnavas');
            let imgInstance = new window.fabric.Image(virtualImage, {
                left: 0,
                top: 0,
                width: 200,
                height: 200,
                angle: 0,
                opacity: 1,
                selectable: false,
                lockMovementX: true,
                lockMovementY: true,
                lockRotation: true,
                lockScalingX: true,
                lockScalingY: true,
                evented: false,
                lockScalingFlip: true,
                lockSkewingX: true,
                lockSkewingY: true,
                lockUniScaling: true

            });
            _canvas.add(imgInstance);
        }

        // this.state.viewControl.getSnapshot().then(data=> {
        //     let virtualImage = new Image();
        //     virtualImage.src = data.base64;
        //     virtualImage.onload = () => {
        //         var _canvas = new window['fabric'].Canvas('imageCnavas');
        //         let imgInstance = new window.fabric.Image(virtualImage, {
        //             left: 0,
        //             top: 0,
        //             width: 200,
        //             height: 200,
        //             angle: 0,
        //             opacity: 1,
        //             selectable: false,
        //             lockMovementX: true,
        //             lockMovementY: true,
        //             lockRotation: true,
        //             lockScalingX: true,
        //             lockScalingY: true,
        //             evented: false,
        //             lockScalingFlip: true,
        //             lockSkewingX: true,
        //             lockSkewingY: true,
        //             lockUniScaling: true
        //
        //         });
        //         _canvas.add(imgInstance);
        //     }
        // })
    }

    cancel() {
        this.setState({
            visible: false,
        })
        this.domHide && (this.domHide.style.display = '');
    }

    addSquare() {
        // console.log('addDescription');
        // console.log(this.state.captureCanvas);
        // var canvas = new window.fabric.Canvas('capture_picture');
        // canvas.add(new window.fabric.Circle({radius: 30, fill: '#ffffff', top: 50, left: 50}));
        // canvas.item(0).hasControls = true;
        // canvas.setActiveObject(canvas.item(0));
        // this.__canvases.push(canvas);

        // var canvas = new window.fabric.Canvas('capture_picture');
        // canvas.add(new window.fabric.Circle({
        //     radius: 30,
        //     fill: '#fff',
        //     top: 100,
        //     left: 100,
        //     strokeWidth:1,
        //     stroke: '#666'
        // }));
        // canvas.hoverCursor = 'pointer';
        // this.__canvases.push(canvas);

        // var canvas = new window.fabric.Canvas('capture_picture');

        this._canvas.add(new window.fabric.Rect({
            width: 50,
            height: 50,
            fill: '',
            opacity: 1,
            top: 250,
            left: 500,
            strokeWidth: 2,
            stroke: 'rgb(118,156,204)'
        }));
        // this._canvas.item(0).hasRotatingPoint = true;

        // canvas.add(new window.fabric.Circle({
        //     radius: 40,
        //     fill: '#fff',
        //     top: 125,
        //     left: 125,
        //     scaleY: 0.5,
        //     strokeWidth: 1,
        //     stroke: '#666',
        //     flipY: true
        // }));
        // canvas.item(1).hasRotatingPoint = true;

        // this.__canvases.push(canvas);
    }

    addCircle() {
        // console.log('click 41564d a dadsa');
        // var canvas = new window.fabric.Canvas('capture_picture');
        this._canvas.add(new window.fabric.Circle({
            radius: 40,
            fill: '',
            opacity: 1,
            top: 250,
            left: 500,
            scaleY: 0.5,
            strokeWidth: 2,
            stroke: 'rgb(118,156,204)',
            flipY: true
        }));
        // canvas.item(1).hasRotatingPoint = true;

        // this.__canvases.push(canvas);
    }

    addArrow() {
        console.log('add arrow');
        window.fabric.Image.fromURL(require('./1.png'),(img)=>{
            img.scale(0.5).set({
                left: 300,
                top: 250,
                angle: -15,
                width: 200,
                // clipTo: function (ctx) {
                //     ctx.arc(0, 0, 300, 0, Math.PI * 2, true);
                // }
            });
            this._canvas.add(img).setActiveObject(img);
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Row type="flex" justify="space-between">
                <Col span={5}>
                    <div id="bim-tree" style={{position: 'relative', height: '100%', overflow: 'scroll'}}></div>
                    {/*this._renderTree()*/}
                </Col>
                <Col span={14}>
                    <div id="bim"/>
                </Col>
                <Col span={5}>
                    <Card title="部件名称">
                        <p>{this.state.selectedName}</p>
                    </Card>
                    {/*<img src="favicon.ico" alt=""/>*/}
                    {/*<img src={require('./1.png')} style={{width: 30, height: 30}} alt=""/>*/}
                    <Card title="部件信息" style={{marginTop: 20}}>
                        <div id="module_info"></div>
                    </Card>
                    <Card title="报告列表" style={{marginTop: 20}}>
                        {/*<img alt="" id='image11' style={{width: 200, height: 200}}/>*/}
                        <canvas id="imageCnavas" width={300} height={200}></canvas>
                        {/*<canvas id="2dcanvas" style={{width: 200, height: 200}}></canvas>*/}
                        {this._renderIssueList()}
                        <Form>
                            <FormItem>
                                {getFieldDecorator('issueContent', {
                                    rules: [{required: true, message: '请输入报告详情!'}],
                                })(
                                    <Input type="textarea" rows={4} placeholder="报告详情"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {this._renderIssueButton()}
                            </FormItem>
                        </Form>
                    </Card>
                </Col>
                <Modal visible={this.state.visible} onOk={this.confirm.bind(this)}
                       onCancel={this.cancel.bind(this)} wrapClassName="vertical-center-modal">
                    {/*<div>*/}
                    {/*<p>dddddddddd</p>*/}
                    {/*<p>dddddddddd</p>*/}
                    {/*<p>dddddddddd</p>*/}
                    {/*<p>dddddddddd</p>*/}
                    {/*<p>dddddddddd</p>*/}
                    {/*<p>dddddddddd</p>*/}
                    {/*<p>dddddddddd</p>*/}
                    {/*</div>*/}
                    <canvas id="capture_picture" width={950} height={500}></canvas>
                    <div>
                        <Row type="flex" justify="space-between" className="capture-tool">
                            {/*<img src={require('./2.png')} style={{width: 30, height: 30}} alt=""/>*/}
                            <Col span={5} onClick={this.addArrow.bind(this)}>
                                <div><Icon type="arrow-right" style={{fontSize: 50}}/></div>
                            </Col>
                            <Col span={5} onClick={this.addSquare.bind(this)}>
                                <div className="capture-square"></div>
                            </Col>
                            <Col span={5} onClick={this.addCircle.bind(this)}>
                                <div className="capture-circle"></div>
                            </Col>
                        </Row>
                        <Input type='textarea' placeholder='Write your comment'/>
                    </div>
                </Modal>
            </Row>
        );
    }

    _renderIssueButton() {
        if (this.state.selectedKeys.length == 0) {
            return (
                <div>
                    <Button type="primary" disabled>添加报告</Button>
                    <Button type="primary" style={{marginLeft: 50}} onClick={this.getPic.bind(this)}>截图</Button>
                </div>
            );
        }

        return (
            <div>
                <Button type="primary" onClick={this.submitIssue.bind(this)}>
                    添加报告
                </Button>
            </div>
        )
    }

    getPic() {
        // let canvas = document.getElementById('bim').firstElementChild;
        // let image = canvas.toDataURL('image/png');
        // console.log('image1545d 4545',image);
        // this.state.viewControl.downloadSnapshot().then(data=> {

        console.log('document.body.childNodes',document.body.firstElementChild)
        let obj=document.body.firstElementChild
        while(obj){
            if(obj['tagName'].toLowerCase() == 'div' && obj.style.cursor == 'auto' && obj.style.zIndex == 100000){
                // alert('444')
                obj.style.display = 'none';
                this.domHide = obj;
                break
            };
            obj=obj.nextElementSibling
        }
        // document.body.childNodes.map(obj => {
        //     if(obj['tagName']['toLowerCase']() == 'div' && obj.getAttribute('cursor') == 'auto' && obj.getAttribute('z-index') == 10000){
        //         obj.style.display = 'none'
        //     };
        // })

        this.state.viewControl.getSnapshot().then(data=> {
            let virtualImage = new Image();
            virtualImage.src = data.base64;
            virtualImage.onload = () => {
                this._canvas = new window['fabric'].Canvas('capture_picture');
                let imgInstance = new window.fabric.Image(virtualImage, {
                    left: 250,
                    top: 0,
                    width: 500,
                    height: 500,
                    angle: 0,
                    opacity: 1,
                    selectable: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    lockRotation: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    evented: false,
                    lockScalingFlip: true,
                    lockSkewingX: true,
                    lockSkewingY: true,
                    lockUniScaling: true

                });
                this._canvas.add(imgInstance);
            }
        })
        this.setState({
            visible: true,
        })

    }

    submitIssue() {
        let values = this.props.form.getFieldsValue();
        console.log('form values', values);
        if (values.issueContent.trim().length == 0) {
            alert('请输入内容后再提交');
            return;
        }

        let issuesMap = this.state.issuesMap;
        let selectedKeys = this.state.selectedKeys;
        if (issuesMap[selectedKeys[0]] === undefined) {
            issuesMap[selectedKeys[0]] = [];
        }
        issuesMap[selectedKeys[0]].push(values.issueContent.trim());

        this.props.form.setFieldsValue({issueContent: ''});

        this.setState({
            issuesMap: issuesMap
        });
    }

    _renderIssueList() {
        let issuesMap = this.state.issuesMap;
        let selectedKeys = this.state.selectedKeys;

        if (issuesMap[selectedKeys[0]] === undefined) {
            return null;
        }

        return issuesMap[selectedKeys[0]].map((item, i) => (
            <p key={i}>{i + 1}、{item}</p>
        ));
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

        // if (node.length > 0) {
        //   let id = (node[0].split(':'))[1];
        //
        //   this.state.viewControl.getAttributes(id, (key, name, item) => {
        //     console.log(`key=${key}&name=${name}`);
        //   });
        //
        //   this.state.viewControl.getPSet(id, (key, name, item) => {
        //     console.log(`key=${key}&name=${name}`);
        //   });
        // }

        let dataRender = this.state.viewControl.getMetaDataRenderer();
        let metadata = new dataRender({
            domNode: 'module_info'
        });
        metadata.addModel({
            name: "",
            id: this.props.location.query.lastRevisionId,
            model: this.state.viewControl.getModel()
        });
        metadata.setSelected(node);

        let name = this._findChildrenName(this.state.treeData, node[0]);
        if (!name) {
            name = '';
        }

        this.setState({
            selectedKeys: node,
            selectedName: name,
        });
    }

    _findChildrenName(node, findId) {
        if (`${this.props.location.query.lastRevisionId}:${node.id}` == findId) {
            return node.name;
        }

        if (node.children && node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
                let res = this._findChildrenName(node.children[i], findId);
                if (res) {
                    return res;
                }
            }
        }

        return null;
    }
}

export default Project = Form.create()(Project);