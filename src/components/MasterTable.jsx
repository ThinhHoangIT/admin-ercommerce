import { useMemo, useRef } from 'react';
import { Table, Button, Space, Input, Popconfirm, Select } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  HistoryOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import colors from '@/theme/color';

const Container = styled.div(props => ({
  padding: props.padding ? `4px ${props.padding} 0` : 24,
}));

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

const DeleteIcon = styled(DeleteOutlined)({
  color: 'red',
});

const PDFIcon = styled(FilePdfOutlined)({
  color: colors.primary,
});

const OptionSelect = styled(Select)({
  width: 180,
});

const preventRowClick = e => e.stopPropagation();

const MasterTable = ({
  columns,
  data,
  loading,
  onClick,
  onAdd,
  onEdit,
  onDelete,
  onSearch,
  onShowLog,
  onSelect,
  options,
  scroll,
  padding,
  filterComponents,
  showActions = true,
  showSearch = true,
  showFilter = false,
  rowClassName,
  fixed = true,
  onExportPDF,
}) => {
  const searchTimer = useRef();

  const tableColumns = useMemo(() => {
    return [
      {
        title: 'STT',
        key: 'index',
        render: (record, _, index) => <span>{index + 1}</span>,
        width: 48,
        fixed: fixed ? 'left' : fixed,
      },
      ...columns,
      ...(showActions
        ? [
            {
              title: 'Hành động',
              key: 'action',
              width: 100,
              render: record => (
                <Space size="middle" onClick={preventRowClick}>
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => onEdit?.(record)}
                  />
                  <Popconfirm
                    title="Bạn có chắc muốn xóa dữ liệu này ?"
                    description="Thao tác này có thể ảnh hưởng tới các tính năng khác"
                    okText="Xóa"
                    cancelText="Hủy"
                    onConfirm={() => onDelete?.(record)}
                  >
                    <Button icon={<DeleteIcon />} size="small" />
                  </Popconfirm>
                  {onExportPDF && (
                    <Button
                      icon={<PDFIcon />}
                      size="small"
                      onClick={() => onExportPDF(record)}
                    />
                  )}
                </Space>
              ),
            },
          ]
        : []),
    ];
  }, [columns]);

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

  return (
    <Container padding={padding}>
      <Filter>
        {showSearch && (
          <>
            <Space className="row">
              <Search
                addonBefore={<SearchOutlined />}
                placeholder="Nhập nội dung cần tìm"
                onChange={onSearchChange}
                allowClear
                spellCheck={false}
                autoComplete="nope"
              />
              {options && (
                <OptionSelect
                  placeholder="Chọn nhà cung cấp"
                  onChange={onSelect}
                  options={options}
                  showSearch
                  allowClear
                />
              )}
              <FilterButton icon={<FilterOutlined />}>Bộ lọc</FilterButton>
            </Space>
            <Space>
              {onAdd && (
                <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                  Thêm mới
                </Button>
              )}
              <Button icon={<HistoryOutlined />} onClick={onShowLog}>
                Nhật ký
              </Button>
            </Space>
          </>
        )}
        {showFilter && <>{filterComponents}</>}
      </Filter>
      <CustomTable
        columns={tableColumns}
        dataSource={data}
        onRow={onRow}
        loading={loading}
        size="small"
        rowKey={row => row.id || row._id || row.name || row}
        bordered
        scroll={scroll}
        rowClassName={(record, index) => rowClassName?.(record)}
      />
    </Container>
  );
};

export default MasterTable;
