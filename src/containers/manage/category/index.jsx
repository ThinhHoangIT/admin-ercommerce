import { useEffect, useState } from 'react';
import { Image, Layout, message } from 'antd';
import NiceModal from '@ebay/nice-modal-react';
import styled from 'styled-components';

import api from '@/services/api';
import Detail from './Detail';
import MasterTable from '@/components/MasterTable';
import AppHeader from '@/components/AppHeader';
import LogsDrawer from '@/components/LogsDrawer';
import { getProductTypeName } from '@/commons/locale';

const localeFields = {
  id: 'Mã loại SP',
  name: 'Tên loại SP',
};

export const Container = styled(Layout.Content)({
  width: '100%',
  height: '100vh',
  overflow: 'auto',
});

const ProductImage = styled(Image)({
  maxHeight: 100,
  maxWidth: 100,
});

const columns = [
  {
    title: 'Mã loại SP',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Hình ảnh',
    dataIndex: 'img',
    render: record => <ProductImage src={record} alt="product" />,
    align: 'center',
    width: 80,
  },
  {
    title: 'Tên loại SP',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Thể loại',
    dataIndex: 'productType',
    key: 'productType',
    render: record => getProductTypeName(record) || '',
  },
];

const Category = () => {
  const [data, setData] = useState();
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [logs, setLogs] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  const getCategories = query => {
    if (loading) {
      return;
    }
    setLoading(true);
    api
      .getCategories(query)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Get categorys error', error);
        messageApi.error('Tải danh sách thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getCategoriesLogs = () => {
    api
      .getCategoriesLogs()
      .then(response => {
        setLogs(response.data);
      })
      .catch(error => {
        console.log('Get categorys logs error', error);
        messageApi.error('Tải nhật ký thất bại');
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (showLog) {
      getCategoriesLogs();
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
    getCategories({ keyword: value });
  };

  const onAdd = () => {
    NiceModal.show('add-category', {
      messageApi,
      onSuccess: () => {
        getCategories();
        messageApi.success('Thêm thành công');
      },
    });
  };

  const onEdit = (record, callback) => {
    NiceModal.show('add-category', {
      data: record,
      messageApi,
      onSuccess: () => {
        getCategories();
        messageApi.success('Cập nhật thành công');
        callback?.();
      },
    });
  };

  const onDelete = record => {
    api
      .deleteCategory(record.id)
      .then(() => {
        getCategories();
      })
      .catch(error => {
        console.log('Delete category error', error);
        messageApi.error('Xóa thất bại');
      });
  };

  return (
    <Layout>
      {contextHolder}
      <AppHeader
        detailText="Chi tiết loại SP"
        showDetailText={detail?.id}
        onMenuClick={backToTable}
      />
      <Container>
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
      </Container>
    </Layout>
  );
};

export default Category;
