import React, { useState, useEffect } from 'react';
import { Table, Input, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { fetchStockList } from '../services/stockApi';

const { Search } = Input;

function StockList() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState([]);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    setLoading(true);
    try {
      const data = await fetchStockList();
      setStocks(data);
      setFilteredStocks(data);
    } catch (error) {
      message.error('获取股票数据失败');
    }
    setLoading(false);
  };

  const handleSearch = (value) => {
    const filtered = stocks.filter(stock => 
      stock.symbol.toLowerCase().includes(value.toLowerCase()) ||
      stock.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStocks(filtered);
  };

  const columns = [
    {
      title: '代码',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text) => <Link to={`/stock/${text}`}>{text}</Link>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '最新价',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: '涨跌幅',
      dataIndex: 'change',
      key: 'change',
      render: (text) => (
        <span className={text >= 0 ? 'text-green-500' : 'text-red-500'}>
          {text >= 0 ? `+${text.toFixed(2)}%` : `${text.toFixed(2)}%`}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Space className="mb-4">
        <Search
          placeholder="搜索股票代码或名称"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          className="w-64"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filteredStocks}
        loading={loading}
        rowKey="symbol"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default StockList;