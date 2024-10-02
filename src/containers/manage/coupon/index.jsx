import { useEffect, useState } from 'react';
import { Layout, message } from 'antd';
import NiceModal from '@ebay/nice-modal-react';

import api from '@/services/api';
import Detail from './Detail';
import MasterTable from '@/components/MasterTable';
import AppHeader from '@/components/AppHeader';
import LogsDrawer from '@/components/LogsDrawer';
import { formatFullDateTime, formatPrice } from '@/commons/utils';

const localeFields = {
  id: 'Mã phiếu phiếu',
  name: 'Tên phiếu',
};

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: 'Tên phiếu',
    dataIndex: 'title',
    key: 'title',
    width: 180,
  },
  {
    title: 'Mã giảm giá',
    dataIndex: 'couponCode',
    key: 'couponCode',
    width: 180,
  },
  {
    title: 'Thời gian bắt đầu',
    key: 'startTime',
    dataIndex: 'startTime',
    render: record => formatFullDateTime(record),
    width: 180,
  },
  {
    title: 'Thời gian kết thúc',
    key: 'endTime',
    dataIndex: 'endTime',
    render: record => formatFullDateTime(record),
    width: 180,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    render: record => {
      switch (record) {
        case 'active':
          return 'Hoạt động';
        case 'inactive':
          return 'Không hoạt động';
        default:
          return '';
      }
    },
    width: 100,
  },
];

const Coupon = () => {
  const [data, setData] = useState();
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [logs, setLogs] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  const getCoupons = query => {
    if (loading) {
      return;
    }
    setLoading(true);
    api
      .getCoupons(query)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Get coupons error', error);
        messageApi.error('Tải danh sách thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getCouponsLogs = () => {
    api
      .getCouponsLogs()
      .then(response => {
        setLogs(response.data);
      })
      .catch(error => {
        console.log('Get coupons logs error', error);
        messageApi.error('Tải nhật ký thất bại');
      });
  };

  useEffect(() => {
    getCoupons();
  }, []);

  useEffect(() => {
    if (showLog) {
      getCouponsLogs();
    }
  }, [showLog]);

  const backToTable = () => {
    setDetail();
  };

  const displayDetail = (record, index) => {
    setDetail(record);
  };

  const closeLog = () => {
    setShowLog(false);
  };

  const onShowLog = () => {
    setShowLog(true);
  };

  const onSearch = value => {
    getCoupons({ keyword: value });
  };

  const onAdd = () => {
    NiceModal.show('add-coupon', {
      messageApi,
      onSuccess: () => {
        getCoupons();
        messageApi.success('Thêm thành công');
      },
    });
  };

  const onEdit = (record, callback) => {
    NiceModal.show('add-coupon', {
      data: record,
      messageApi,
      onSuccess: () => {
        getCoupons();
        messageApi.success('Cập nhật thành công');
        callback?.();
      },
    });
  };

  const onDelete = record => {
    api
      .deleteCoupon(record.id)
      .then(() => {
        getCoupons();
      })
      .catch(error => {
        console.log('Delete coupon error', error);
        messageApi.error('Xóa thất bại');
      });
  };

  return (
    <Layout>
      {contextHolder}
      <AppHeader
        detailText="Chi tiết phiếu giảm giá"
        showDetailText={detail?.id}
        onMenuClick={backToTable}
      />
      <Layout.Content>
        {detail?.id ? (
          <Detail
            data={detail}
            onEdit={onEdit}
            onDelete={onDelete}
            onBack={backToTable}
          />
        ) : (
          <MasterTable
            columns={columns}
            data={data}
            loading={loading}
            onClick={displayDetail}
            onShowLog={onShowLog}
            onSearch={onSearch}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        <LogsDrawer
          open={showLog}
          onClose={closeLog}
          data={logs}
          localeFields={localeFields}
        />
      </Layout.Content>
    </Layout>
  );
};

export default Coupon;
