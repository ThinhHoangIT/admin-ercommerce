// ModalTable.jsx
import { useMemo, useRef } from 'react';
import { Table, Button, Space, Input, Dropdown, Tag } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const Container = styled.div({
  padding: 24,
});

const Filter = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 24,
});

const Search = styled(Input)({
  // width: '30%',
});

const CustomTable = styled(Table)({
  '.ant-table-tbody>tr.ant-table-row:hover>td': {
    cursor: 'pointer',
  },
});

const FilterButton = styled(Button)({
  fontSize: 13,
});

const statusOptions = [
  { value: 'pending', label: 'Đang xác nhận', color: 'orange' },
  { value: 'processing', label: 'Đang xử lý', color: 'blue' },
  { value: 'delivered', label: 'Đã giao hàng', color: 'green' },
  { value: 'cancel', label: 'Đã hủy', color: 'red' },
];

const ModalTable = ({
  columns,
  data,
  loading,
  onClick,
  onSearch,
  onChangeStatus,
  showSearch = true,
  fixed = true,
  showStatus = true,
  scroll,
  pagination,
}) => {
  const searchTimer = useRef();

  const onRow = (record, rowIndex) => {
    return {
      onClick: e => {
        onClick?.(record, rowIndex);
      },
    };
  };

  const onSearchChange = e => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    searchTimer.current = setTimeout(() => {
      onSearch?.(e.target.value);
    }, 300);
  };

  const tableColumns = useMemo(() => {
    return [
      {
        title: 'STT',
        key: 'index',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: 48,
        fixed: fixed ? 'left' : fixed,
      },
      ...columns,
      ...(showStatus
        ? [
            {
              title: 'Trạng thái',
              key: 'status',
              width: 150,
              render: (text, record) => {
                const currentStatus = statusOptions.find(
                  s => s.value === record.status,
                );
                return (
                  <Dropdown
                    menu={{
                      items: statusOptions.map(s => ({
                        key: s.value,
                        label: (
                          <Tag color={s.color} key={s.value}>
                            {s.label}
                          </Tag>
                        ),
                      })),
                      onClick: e => {
                        e.domEvent.stopPropagation();
                        onChangeStatus?.(record, e.key);
                      },
                    }}
                    placement="topLeft"
                  >
                    <span onClick={e => e.stopPropagation()}>
                      <Tag
                        color={currentStatus?.color}
                        style={{ cursor: 'pointer' }}
                      >
                        {currentStatus?.label}
                      </Tag>
                    </span>
                  </Dropdown>
                );
              },
            },
          ]
        : []),
    ];
  }, [columns]);

  return (
    <Container>
      {showSearch && (
        <Filter>
          <Space className="row">
            <Search
              addonBefore={<SearchOutlined />}
              placeholder="Nhập nội dung cần tìm"
              onChange={onSearchChange}
              allowClear
              spellCheck={false}
              autoComplete="nope"
            />
            <FilterButton icon={<FilterOutlined />}>Bộ lọc</FilterButton>
          </Space>
        </Filter>
      )}
      <CustomTable
        columns={tableColumns}
        dataSource={data}
        onRow={onRow}
        loading={loading}
        size="small"
        rowKey={row => row.id || row._id || row.name || row}
        bordered
        pagination={pagination}
        scroll={scroll}
      />
    </Container>
  );
};

export default ModalTable;
