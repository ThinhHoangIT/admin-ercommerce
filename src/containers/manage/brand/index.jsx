import { useEffect, useState } from 'react';
import { Image, Layout, message } from 'antd';
import NiceModal from '@ebay/nice-modal-react';
import styled from 'styled-components';

import api from '@/services/api';
import Detail from './Detail';
import MasterTable from '@/components/MasterTable';
import AppHeader from '@/components/AppHeader';
import LogsDrawer from '@/components/LogsDrawer';

const localeFields = {
  id: 'Mã hãng',
  name: 'Tên hãng',
};

const ProductImage = styled(Image)({
  maxHeight: 100,
  maxWidth: 100,
});

const columns = [
  {
    title: 'Mã hãng',
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: 'Hình ảnh',
    dataIndex: 'logo',
    render: record => <ProductImage src={record} alt="product" />,
    align: 'center',
    width: 80,
  },
  {
    title: 'Tên hãng',
    dataIndex: 'name',
    key: 'name',
    width: 180,
  },
];

const Brand = () => {
  const [data, setData] = useState();
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [logs, setLogs] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  const getBrands = query => {
    if (loading) {
      return;
    }
    setLoading(true);
    api
      .getBrands(query)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Get brands error', error);
        messageApi.error('Tải danh sách thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getBrandsLogs = () => {
    api
      .getBrandsLogs()
      .then(response => {
        setLogs(response.data);
      })
      .catch(error => {
        console.log('Get brands logs error', error);
        messageApi.error('Tải nhật ký thất bại');
      });
  };

  useEffect(() => {
    getBrands();
  }, []);

  useEffect(() => {
    if (showLog) {
      getBrandsLogs();
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
    getBrands({ keyword: value });
  };

  const onAdd = () => {
    NiceModal.show('add-brand', {
      messageApi,
      onSuccess: () => {
        getBrands();
        messageApi.success('Thêm thành công');
      },
    });
  };

  const onEdit = (record, callback) => {
    NiceModal.show('add-brand', {
      data: record,
      messageApi,
      onSuccess: () => {
        getBrands();
        messageApi.success('Cập nhật thành công');
        callback?.();
      },
    });
  };

  const onDelete = record => {
    api
      .deleteBrand(record.id)
      .then(() => {
        getBrands();
      })
      .catch(error => {
        console.log('Delete brand error', error);
        messageApi.error('Xóa thất bại');
      });
  };

  return (
    <Layout>
      {contextHolder}
      <AppHeader
        detailText="Chi tiết hãn"
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

export default Brand;
