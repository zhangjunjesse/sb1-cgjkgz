import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Spin } from 'antd';
import Layout from './components/Layout';
import StockList from './components/StockList';
import StockDetail from './components/StockDetail';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={
          <div className="h-screen w-screen flex items-center justify-center">
            <Spin size="large" />
          </div>
        }>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<StockList />} />
              <Route path="stock/:symbol" element={<StockDetail />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;