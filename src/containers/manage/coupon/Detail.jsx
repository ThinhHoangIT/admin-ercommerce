import { useEffect, useState } from 'react';
import { Card, Descriptions, Space, Button, Popconfirm, Image } from 'antd';
import styled from 'styled-components';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import colors from '@/theme/color';
import { formatFullDateTime } from '@/commons/utils';
import api from '@/services/api';
import { getProductTypeName } from '@/commons/locale';

const Container = styled.div({
  padding: 12,
  userSelect: 'text !important',
});

const CardTitle = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 14,
});

const EditButton = styled(Button)({
  color: colors.edit,
});

const DeleteButton = styled(Button)({
  color: colors.danger,
});

const ProductImage = styled(Image)({
  maxHeight: 100,
  maxWidth: 100,
});

const Detail = ({ data, onEdit, onDelete, onBack }) => {
  const [detail, setDetail] = useState(data);

  if (!data) {
    return <Container>Dữ liệu rỗng</Container>;
  }

  const items = [
    {
      label: 'ID',
      key: 'id',
      children: detail.id,
    },
    {
      label: 'Hình ảnh',
      key: 'logo',
      children: <ProductImage src={detail.logo} alt="product" />,
    },
    {
      label: 'Tên phiếu',
      key: 'title',
      children: detail.title,
    },
    {
      label: 'Mã giảm giá',
      key: 'couponCode',
      children: detail.couponCode,
    },
    {
      label: '% giảm giá',
      children: detail.discountPercentage,
    },
    {
      label: 'Giảm tối đa',
      children: detail.minimumAmount,
    },
    {
      label: 'Loại sản phẩm',
      children: getProductTypeName(detail.productType),
    },
    {
      label: 'Bắt đầu',
      children: formatFullDateTime(detail.startTime),
    },
    {
      label: 'Hết hạn',
      children: formatFullDateTime(detail.endTime),
    },
    {
      label: 'Trạng thái',
      children: detail.status === 'active' ? 'Hoạt động' : 'Không hoạt động',
    },
  ];

  const getDetailData = () => {
    api
      .getBrand(detail.id)
      .then(response => {
        setDetail(response.data);
      })
      .catch(error => {
        console.log('Get detail error', error);
      });
  };

  useEffect(() => {
    getDetailData();
  }, []);

  const onEditData = () => {
    onEdit?.(detail, () => {
      getDetailData();
    });
  };

  const onDeleteData = () => {
    onDelete?.(detail);
    onBack?.();
  };

  return (
    <Container>
      <Card bordered={false} size="small">
        <Descriptions
          title={
            <CardTitle>
              <span>Thông tin cơ bản</span>
              <Space size="middle" className="row">
                <EditButton
                  type="text"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={onEditData}
                >
                  Sửa
                </EditButton>
                <Popconfirm
                  title="Bạn có chắc muốn xóa dữ liệu này ?"
                  description="Thao tác này có thể ảnh hưởng tới các tính năng khác"
                  okText="Xóa"
                  cancelText="Hủy"
                  onConfirm={onDeleteData}
                >
                  <DeleteButton
                    type="text"
                    icon={<DeleteOutlined />}
                    size="small"
                  >
                    Xóa
                  </DeleteButton>
                </Popconfirm>
              </Space>
            </CardTitle>
          }
          bordered
          items={items}
          size="small"
          column={1}
        />
      </Card>
    </Container>
  );
};

export default Detail;
