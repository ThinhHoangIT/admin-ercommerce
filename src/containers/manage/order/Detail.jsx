import { useEffect, useState } from 'react';
import { Card, Descriptions } from 'antd';
import styled from 'styled-components';

import { formatFullDateTime, formatPrice } from '@/commons/utils';
import api from '@/services/api';

const Container = styled.div({
  padding: 12,
  userSelect: 'text !important',
  height: '100%',
  overflow: 'auto',
});

const CardTitle = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 14,
});

const Detail = ({ data, onBack }) => {
  const [detail, setDetail] = useState(data);

  if (!data) {
    return <Container>Dữ liệu rỗng</Container>;
  }

  const items = [
    {
      key: '_id',
      label: 'Mã đơn hàng',
      labelStyle: {
        width: '25%',
      },
      children: detail._id,
    },
    {
      key: 'name',
      label: 'Tên khách hàng',
      children: detail.name,
    },
    {
      key: 'contact',
      label: 'Liên hệ',
      children: detail.contact,
    },
    {
      key: 'email',
      label: 'Email',
      children: detail.email,
    },
    {
      label: 'Địa chỉ',
      children: detail.address + ', ' + detail.city + ', ' + detail.country,
    },
    {
      key: 'zipCode',
      label: 'Zip code',
      children: detail.zipCode,
    },
    {
      key: 'shippingOption',
      label: 'Ship hàng',
      children:
        detail.shippingOption === 'on'
          ? 'Giao hàng tận nơi'
          : 'Nhận tại cửa hàng',
    },
    {
      key: 'cart',
      label: 'Gỉỏ hàng',
      children:
        detail.cart && detail.cart.length > 0 ? (
          <>
            {detail.cart.map((info, index) => (
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item key={index} label={'Tên SP'}>
                  {info.name}
                </Descriptions.Item>
                <Descriptions.Item key={index} label={'Giá SP'}>
                  {formatPrice(info?.price | 0)}
                </Descriptions.Item>
                <Descriptions.Item key={index} label={'Số lượng'}>
                  {info?.orderQuantity}
                </Descriptions.Item>
              </Descriptions>
            ))}
          </>
        ) : (
          'Không có thông tin bổ sung'
        ),
    },
    {
      key: 'shippingCost',
      label: 'Phí ship',
      children: formatPrice(detail.shippingCost),
    },
    {
      key: 'subTotal',
      label: 'Giá trị đơn hàng',
      children: formatPrice(detail.subTotal),
    },
    {
      key: 'totalAmount',
      label: 'Tổng tiền',
      children: formatPrice(detail.totalAmount),
    },
    {
      key: 'orderNote',
      label: 'Ghi chú',
      children: detail.orderNote,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      children: detail.status,
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
      .getOrder(detail._id)
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

  return (
    <Container>
      <Card bordered={false} size="small">
        <Descriptions
          title={
            <CardTitle>
              <span>Thông tin cơ bản</span>
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
