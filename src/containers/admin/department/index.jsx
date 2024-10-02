import { useEffect, useState } from 'react';
import { Layout, message } from 'antd';
import NiceModal from '@ebay/nice-modal-react';

import { sortByAlphabet } from '@/commons/utils';
import api from '@/services/api';
import Detail from './Detail';
import MasterTable from '@/components/MasterTable';
import AppHeader from '@/components/AppHeader';
import LogsDrawer from '@/components/LogsDrawer';

const localeFields = {
  id: 'Mã bộ phận',
  name: 'Tên bộ phận',
};

const columns = [
  {
    title: 'Mã bộ phận',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Tên bộ phận',
    dataIndex: 'name',
    key: 'name',
  },
];

const Department = () => {
  const [data, setData] = useState();
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [logs, setLogs] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  const getDepartments = query => {
    if (loading) {
      return;
    }
    setLoading(true);
    api
      .getDepartments(query)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Get departments error', error);
        messageApi.error('Tải danh sách thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getDepartmentsLogs = () => {
    api
      .getDepartmentsLogs()
      .then(response => {
        setLogs(response.data);
      })
      .catch(error => {
        console.log('Get departments logs error', error);
        messageApi.error('Tải nhật ký thất bại');
      });
  };

  useEffect(() => {
    getDepartments();
  }, []);

  useEffect(() => {
    if (showLog) {
      getDepartmentsLogs();
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
    getDepartments({ keyword: value });
  };

  const onAdd = () => {
    NiceModal.show('add-department', {
      messageApi,
      onSuccess: () => {
        getDepartments();
        messageApi.success('Thêm thành công');
      },
    });
  };

  const onEdit = (record, callback) => {
    NiceModal.show('add-department', {
      data: record,
      messageApi,
      onSuccess: () => {
        getDepartments();
        messageApi.success('Cập nhật thành công');
        callback?.();
      },
    });
  };

  const onDelete = record => {
    api
      .deleteDepartment(record.id)
      .then(() => {
        getDepartments();
      })
      .catch(error => {
        console.log('Delete departments error', error);
        messageApi.error('Xóa thất bại');
      });
  };

  return (
    <Layout>
      {contextHolder}
      <AppHeader
        detailText="Chi tiết bộ phận"
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

export default Department;
