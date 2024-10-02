import { useEffect, useState } from 'react';
import { Layout, message, Image } from 'antd';
import NiceModal from '@ebay/nice-modal-react';
import styled from 'styled-components';

import { formatPrice } from '@/commons/utils';
import api from '@/services/api';
import Detail from './Detail';
import MasterTable from '@/components/MasterTable';
import AppHeader from '@/components/AppHeader';
import { getStatusProduct } from '@/commons/locale';
import LogsDrawer from '@/components/LogsDrawer';

const localeFields = {
  id: 'Mã SP',
  name: 'Tên SP',
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
    title: 'Mã sản phẩm',
    dataIndex: 'id',
    sortDirections: ['descend', 'ascend'],
    width: 80,
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: 'Hình ảnh',
    dataIndex: 'img',
    render: record => <ProductImage src={record} alt="product" />,
    align: 'center',
    width: 80,
  },
  {
    title: 'Loại sản phẩm',
    dataIndex: ['categoryData', 'name'],
    key: 'categoryData.name',
    sorter: (a, b) => a.name - b.name,
    sortDirections: ['descend', 'ascend'],
    width: 100,
  },
  {
    title: 'Hãng',
    dataIndex: ['brandData', 'name'],
    key: 'brandData.name',
    align: 'center',
    width: 120,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    sorter: (a, b) => a.name - b.name,
    sortDirections: ['descend', 'ascend'],
    align: 'center',
    width: 80,
  },
  {
    title: 'Giá',
    dataIndex: 'price',
    render: record => formatPrice(record),
    sortDirections: ['descend', 'ascend'],
    align: 'center',
    width: 80,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    render: record => getStatusProduct(record),
    align: 'center',
    width: 90,
  },
];

const Product = () => {
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [logs, setLogs] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  const getProducts = query => {
    if (loading) {
      return;
    }
    setLoading(true);
    api
      .getProducts(query)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Get products error', error);
        messageApi.error('Tải danh sách thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getProductsLogs = () => {
    api
      .getProductsLogs()
      .then(response => {
        setLogs(response.data);
      })
      .catch(error => {
        console.log('Get brands logs error', error);
        messageApi.error('Tải nhật ký thất bại');
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (showLog) {
      getProductsLogs();
    }
  }, [showLog]);

  const backToTable = () => {
    setDetail();
  };

  const closeLog = () => {
    setShowLog(false);
  };

  const onShowLog = () => {
    setShowLog(true);
  };

  const displayDetail = (record, index) => {
    setDetail(record);
  };

  const onSearch = value => {
    getProducts({ keyword: value });
  };

  const onAdd = () => {
    NiceModal.show('add-product', {
      messageApi,
      onSuccess: () => {
        getProducts();
        messageApi.success('Thêm thành công');
      },
    });
  };

  const onEdit = (record, callback) => {
    NiceModal.show('add-product', {
      data: record,
      messageApi,
      onSuccess: () => {
        getProducts();
        messageApi.success('Cập nhật thành công');
        callback?.();
      },
    });
  };

  const onDelete = record => {
    api
      .deleteProduct(record.id)
      .then(() => {
        getProducts();
      })
      .catch(error => {
        console.log('Delete products error', error);
        messageApi.error('Xóa thất bại');
      });
  };

  return (
    <Layout>
      {contextHolder}
      <AppHeader
        detailText="Chi tiết sản phẩm"
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
            onSearch={onSearch}
            onShowLog={onShowLog}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            scroll={{
              x: 1300,
            }}
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

export default Product;
