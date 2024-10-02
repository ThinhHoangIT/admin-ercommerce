import { useEffect, useState } from 'react';
import { Layout, Tag, message } from 'antd';
import NiceModal from '@ebay/nice-modal-react';

import { sortByAlphabet } from '@/commons/utils';
import api from '@/services/api';
import Detail from './Detail';
import MasterTable from '@/components/MasterTable';
import AppHeader from '@/components/AppHeader';
import LogsDrawer from '@/components/LogsDrawer';
import { getFeatureName } from '@/commons/locale';
import { FeatureTag } from './styles';

const localeFields = {
  id: 'Mã vai trò',
  name: 'Tên vai trò',
  accessibleFeatures: 'Tính năng truy cập',
};

const columns = [
  {
    title: 'Mã vai trò',
    dataIndex: 'id',
    key: 'id',
    sorter: (a, b) => sortByAlphabet(a.id, b.id),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Tên vai trò',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => sortByAlphabet(a.name, b.name),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Tính năng truy cập',
    dataIndex: 'accessibleFeatures',
    key: 'accessibleFeatures',
    width: '40%',
    render: record => {
      return record?.map(feature => (
        <FeatureTag key={feature}>{getFeatureName(feature)}</FeatureTag>
      ));
    },
  },
];

const Role = () => {
  const [data, setData] = useState();
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [logs, setLogs] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  const getRoles = query => {
    if (loading) {
      return;
    }
    setLoading(true);
    api
      .getRoles(query)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Get roles error', error);
        messageApi.error('Tải danh sách thất bại');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getRolesLogs = () => {
    api
      .getRolesLogs()
      .then(response => {
        setLogs(
          response.data?.map(log => {
            log.changes = log.changes?.map(change => {
              if (change.fieldName === 'accessibleFeatures') {
                return {
                  ...change,
                  newValue: change.newValue?.map(feature =>
                    getFeatureName(feature),
                  ),
                };
              }
              return change;
            });
            return log;
          }),
        );
      })
      .catch(error => {
        console.log('Get roles logs error', error);
        messageApi.error('Tải nhật ký thất bại');
      });
  };

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    if (showLog) {
      getRolesLogs();
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
    getRoles({ keyword: value });
  };

  const onAdd = () => {
    NiceModal.show('add-role', {
      messageApi,
      onSuccess: () => {
        getRoles();
        messageApi.success('Thêm thành công');
      },
    });
  };

  const onEdit = (record, callback) => {
    NiceModal.show('add-role', {
      data: record,
      messageApi,
      onSuccess: () => {
        getRoles();
        messageApi.success('Cập nhật thành công');
        callback?.();
      },
    });
  };

  const onDelete = record => {
    api
      .deleteRole(record.id)
      .then(() => {
        getRoles();
      })
      .catch(error => {
        console.log('Delete roles error', error);
        messageApi.error('Xóa thất bại');
      });
  };

  return (
    <Layout>
      {contextHolder}
      <AppHeader
        detailText="Chi tiết vai trò"
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

export default Role;
