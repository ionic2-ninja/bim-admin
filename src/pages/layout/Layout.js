import React from 'react';
import {Menu, Icon, Row, Col} from 'antd';
import {Link, browserHistory} from 'react-router'

export default function Layout({children, location}) {

  const options = [
    {key: '/digests/page/1', title: '项目管理'},
    {key: '/digests/rules', title: '进程管理'},
  ];

  const onClick = ({item, key, keyPath}) => {
    console.log(`key`, key);
    browserHistory.push(key);
  }

  return (
    <div>

      <div className="ant-layout-topaside">
        <div className="ant-layout-header">
          <div className="ant-layout-wrapper">
            <div className="ant-layout-logo">xxx</div>
          </div>
        </div>
        <div className="ant-layout-wrapper">
          <div>
            <div className="ant-layout-container">
              <div span={4}>
                <aside className="ant-layout-sider">
                  <Menu mode="inline" selectedKeys={[location.pathname]} onClick={onClick}>
                    {
                      options.map((item) => <Menu.Item key={item.key}>{item.title}</Menu.Item>)
                    }
                  </Menu>
                </aside>
              </div>
              <div span={20} className="ant-layout-content">
                <div>
                  <div style={{clear: 'both'}}>{children}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="ant-layout-footer">
            xxx 版权所有 © 2016 由yyy支持
          </div>
        </div>
      </div>
    </div>
  )
}