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
  id: 'Mã nhân viên',
  name: 'Tên nhân viên',
  phone: 'Số điện thoại',
  department: 'Bộ phận',
  role: 'Vai trò',
};

const columns = [
  {
    title: 'Mã nhân viên',
    dataIndex: 'id',
    key: 'id',
    sorter: (a, b) => sortByAlphabet(a.id, b.id),
    sortDirections: ['descend', 'ascend'],
    width: 160,
  },
  {
    title: 'Tên nhân viên',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => sortByAlphabet(a.name, b.name),
    sortDirections: ['descend', 'ascend'],
    width: 240,
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phone',
    key: 'phone',
    sorter: (a, b) => sortByAlphabet(a.phone, b.phone),
    sortDirections: ['descend', 'ascend'],
    width: 120,
  },
  {
    title: 'Bộ phận',
    key: 'department',
    sorter: (a, b) =>
      sortByAlphabet(a.departmentData.name, b.departmentData.name),
    sortDirections: ['descend', 'ascend'],
    width: 120,
    render: record => record?.departmentData?.name || record?.department,
  },
  {
    title: 'Vai trò',
    key: 'role',
    sorter: (a, b) => sortByAlphabet(a.roleData.name, b.roleData.name),
    sortDirections: ['descend', 'ascend'],
    width: 120,
    render: record => record?.roleData?.name || record?.role,
  },
  {
    title: 'Mật khẩu',
    dataIndex: 'hasPassword',
    key: 'hasPassword',
    sorter: (a, b) => a - b,
    sortDirections: ['descend', 'ascend'],
    width: 100,
    render: value => (value ? 'Đã có' : 'Chưa'),
  },
];

const Employee = () => {
  const [data, setData] = useState();
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [logs, setLogs] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  const getEmployees = query => {
    if (loading) {
      return;
    }
    setLoading(true);
    api
      .getEmployees(query)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Get employees error', error);
        messageApi.error('Tải danh sách thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getEmployeesLogs = () => {
    api
      .getEmployeesLogs()
      .then(response => {
        setLogs(response.data);
      })
      .catch(error => {
        console.log('Get employees logs error', error);
        messageApi.error('Tải nhật ký thất bại');
      });
  };

  useEffect(() => {
    getEmployees();
  }, []);

  useEffect(() => {
    if (showLog) {
      getEmployeesLogs();
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
    getEmployees({ keyword: value });
  };

  const onAdd = () => {
    NiceModal.show('add-employee', {
      messageApi,
      onSuccess: () => {
        getEmployees();
        messageApi.success('Thêm thành công');
      },
    });
  };

  const onEdit = (record, callback) => {
    NiceModal.show('add-employee', {
      data: record,
      messageApi,
      onSuccess: () => {
        getEmployees();
        messageApi.success('Cập nhật thành công');
        callback?.();
      },
    });
  };

  const onDelete = record => {
    api
      .deleteEmployee(record.id)
      .then(() => {
        getEmployees();
      })
      .catch(error => {
        console.log('Delete employees error', error);
        messageApi.error('Xóa thất bại');
      });
  };

  return (
    <Layout>
      {contextHolder}
      <AppHeader
        detailText="Chi tiết nhân viên"
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

export default Employee;
