import { useEffect, useState } from 'react';
import {
  Card,
  Descriptions,
  Space,
  Button,
  Popconfirm,
  Tag,
  Image,
} from 'antd';
import styled from 'styled-components';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import colors from '@/theme/color';
import { formatFullDateTime, formatPrice } from '@/commons/utils';
import api from '@/services/api';
import { getSizeName } from '@/commons/locale';

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

const ImagesGrid = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px', // Khoảng cách giữa các ảnh
  marginTop: '8px',
});

const ImageContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const ProductImage = styled(Image)({
  maxHeight: 160,
  maxWidth: 160,
  objectFit: 'cover',
});

export const ColorDisplay = styled.div(props => ({
  width: 20,
  height: 20,
  borderRadius: '50%',
  backgroundColor: `#${props.color}`,
  marginTop: '8px',
}));

const Detail = ({ data, onEdit, onDelete, onBack }) => {
  const [detail, setDetail] = useState(data);

  if (!data) {
    return <Container>Dữ liệu rỗng</Container>;
  }

  const items = [
    {
      key: 'img',
      label: 'Ảnh sản phẩm',
      labelStyle: {
        width: '25%',
      },
      children: (
        <ProductImage key={detail.img} src={detail.img} alt="img-product" />
      ),
    },
    {
      key: 'id',
      label: 'Mã sản phẩm',
      children: detail.id,
    },
    {
      key: 'name',
      label: 'Tên sản phẩm',
      children: detail.name,
    },
    {
      key: 'description',
      label: 'Mô tả',
      children: detail.description,
    },
    {
      key: 'category',
      label: 'Loại sản phẩm',
      children: detail?.categoryData?.name,
    },
    {
      key: 'brand',
      label: 'Hãng',
      children: detail?.brandData?.name,
    },
    {
      key: 'quantity',
      label: 'Số lượng',
      children: detail.quantity,
    },
    {
      key: 'price',
      label: 'Giá',
      children: formatPrice(detail.price),
    },
    {
      key: 'discount',
      label: 'Giảm giá',
      children: `${detail.discount} %`,
    },
    {
      key: 'tags',
      label: 'Nhãn',
      children: detail.tags?.map(value => {
        return <Tag key={value}>{value}</Tag>;
      }),
    },
    {
      key: 'sizes',
      label: 'Kích thước',
      children: detail.sizes?.map(value => {
        return <Tag key={value}>{getSizeName(value)}</Tag>;
      }),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      children: detail.quantity,
    },
    {
      key: 'imageURLs',
      label: 'Bộ ảnh sản phẩm',
      children: (
        <ImagesGrid>
          {detail?.imageURLs.map((item, index) => (
            <ImageContainer key={index}>
              <ProductImage src={item.img} alt="imageURLs-product" />
              {item.color?.hex && <ColorDisplay color={item.color?.hex} />}
            </ImageContainer>
          ))}
        </ImagesGrid>
      ),
    },
    {
      key: 'additionalInformation',
      label: 'Thông tin bổ sung',
      children:
        detail.additionalInformation &&
        detail.additionalInformation.length > 0 ? (
          <Descriptions column={1} bordered size="small">
            {detail.additionalInformation.map((info, index) => (
              <Descriptions.Item key={index} label={info.key}>
                {info.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
        ) : (
          'Không có thông tin bổ sung'
        ),
    },
    {
      key: 'createdAt',
      label: 'Thời gian tạo',
      children: formatFullDateTime(detail.createdAt),
    },
    {
      key: 'updatedAt',
      label: 'Thời gian cập nhật',
      children: formatFullDateTime(detail.updatedAt),
    },
  ];

  const getDetailData = () => {
    api
      .getProduct(detail?.id)
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
                  title="Bạn có chắc muốn xóa dữ liệu này?"
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
