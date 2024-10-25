import React from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { StockOutlined } from '@ant-design/icons';

const { Header, Content } = AntLayout;

function Layout() {
  return (
    <AntLayout className="min-h-screen">
      <Header className="bg-white">
        <div className="flex items-center">
          <StockOutlined className="text-2xl mr-2" />
          <h1 className="text-xl font-bold">股票行情阅读器</h1>
          <Menu mode="horizontal" className="ml-4">
            <Menu.Item key="home">
              <Link to="/">股票列表</Link>
            </Menu.Item>
          </Menu>
        </div>
      </Header>
      <Content className="p-6">
        <Outlet />
      </Content>
    </AntLayout>
  );
}

export default Layout;