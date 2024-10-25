import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Statistic, Row, Col, Table, message, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { fetchStockDetail, fetchStockCandles } from '../services/stockApi';
import StockChart from './StockChart';

function StockDetail() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [candleData, setCandleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStockData();
  }, [symbol]);

  const loadStockData = async () => {
    setLoading(true);
    try {
      const [detailData, candlesData] = await Promise.all([
        fetchStockDetail(symbol),
        fetchStockCandles(symbol)
      ]);
      setStockData(detailData);
      setCandleData(candlesData);
    } catch (error) {
      message.error('获取股票数据失败');
    }
    setLoading(false);
  };

  if (loading || !stockData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card loading={loading}>
        <h2 className="text-2xl font-bold mb-4">{stockData.name} ({stockData.symbol})</h2>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="当前价格"
              value={stockData.price}
              precision={2}
              prefix="$"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="涨跌幅"
              value={stockData.change}
              precision={2}
              prefix={stockData.change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="%"
              valueStyle={{ color: stockData.change >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="成交量"
              value={stockData.volume}
              formatter={value => value.toLocaleString()}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="市值"
              value={stockData.marketCap}
              formatter={value => `$${(parseInt(value) / 1000000000).toFixed(2)}B`}
            />
          </Col>
        </Row>
      </Card>

      <Card title="K线图" loading={loading}>
        <StockChart data={candleData} symbol={symbol} />
      </Card>

      <Card title="基本指标" loading={loading}>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="市盈率(P/E)" value={stockData.pe} precision={2} />
          </Col>
          <Col span={12}>
            <Statistic title="市净率(P/B)" value={stockData.pb} precision={2} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default StockDetail;