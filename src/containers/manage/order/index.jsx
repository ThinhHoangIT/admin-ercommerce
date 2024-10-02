// Order.jsx
import { useEffect, useState } from 'react';
import { Layout, message } from 'antd';

import api from '@/services/api';
import Detail from './Detail';
import AppHeader from '@/components/AppHeader';
import { formatFullDateTime, formatPrice } from '@/commons/utils';
import ModalTable from '@/components/ModalTable';

const columns = [
  {
    title: 'Mã đơn hàng',
    dataIndex: '_id',
    key: '_id',
    width: 100,
  },
  {
    title: 'Tổng tiền',
    key: 'totalAmount',
    render: (text, record) => formatPrice(record?.totalAmount),
    width: 100,
  },
  {
    title: 'Tên khách hàng',
    dataIndex: 'name',
    key: 'name',
    width: 180,
  },
  {
    title: 'Ngày đặt hàng',
    key: 'createdAt',
    render: (text, record) => formatFullDateTime(record?.createdAt),
    width: 160,
  },
];

const Order = () => {
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const getOrders = query => {
    if (loading) {
      return;
    }
    setLoading(true);
    api
      .getOrders(query)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Get orders error', error);
        messageApi.error('Tải danh sách thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getOrders();
  }, []);

  const backToTable = () => {
    setDetail(null);
  };

  const displayDetail = (record, index) => {
    setDetail(record);
  };

  const onSearch = value => {
    getOrders({ keyword: value });
  };

  const onChangeStatus = (record, newStatus) => {
    setLoading(true);
    api
      .updateOrderStatus(record._id, { newStatus })
      .then(response => {
        messageApi.success('Cập nhật trạng thái thành công');
        getOrders();
      })
      .catch(error => {
        console.log('Update status error', error);
        messageApi.error('Cập nhật trạng thái thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Layout>
      {contextHolder}
      <AppHeader
        detailText="Chi tiết đơn hàng"
        showDetailText={detail?._id}
        onMenuClick={backToTable}
      />
      <Layout.Content>
        {detail?._id ? (
          <Detail data={detail} onBack={backToTable} />
        ) : (
          <ModalTable
            columns={columns}
            data={data}
            loading={loading}
            onClick={displayDetail}
            onSearch={onSearch}
            onChangeStatus={onChangeStatus}
            showActions={false}
          />
        )}
      </Layout.Content>
    </Layout>
  );
};

export default Order;
