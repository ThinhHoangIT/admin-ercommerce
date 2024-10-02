import { useState } from 'react';
import { Modal, Button, Form, Input, Select, DatePicker } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { DeleteOutlined } from '@ant-design/icons';

import api from '@/services/api';
import UploadWidget from '@/components/ImageUpload';
import { getProductTypeName } from '@/commons/locale';
import { PRODUCT_TYPES } from '@/commons/constants';

const CustomForm = styled(Form)({
  marginTop: 24,
  marginBottom: 24,
});

const CustomDatePicker = styled(DatePicker)({
  width: '100%',
});

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  padding-bottom: 8px;
`;

const RemoveButton = styled(DeleteOutlined)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 2px 4px;
  background-color: #f56565;
  color: white;
  border: none;
`;

const StyledImage = styled.img`
  object-fit: cover;
  border-radius: 8px;
  width: 100%;
  height: 100%;
`;

const AddCoupon = NiceModal.create(({ data, onSuccess, messageApi }) => {
  const modal = useModal();
  const [logo, setLogo] = useState(data?.logo || '');

  const onFinish = values => {
    if (data?.id) {
      const updatedValues = {};
      Object.keys(values).forEach(key => {
        if (typeof values[key] !== 'object') {
          if (values[key] !== data[key]) {
            updatedValues[key] = values[key];
          }
        } else {
          if (JSON.stringify(values[key]) !== JSON.stringify(data[key])) {
            updatedValues[key] = values[key];
          }
        }
      });
      if (!Object.keys(updatedValues).length) {
        return;
      }

      api
        .updateCoupon(data.id, { ...updatedValues })
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Update coupon error', error);
          if (error?.response?.data?.message === 'Coupon is already exists') {
            messageApi.error('Hãng đã tồn tại');
          } else {
            messageApi.error('Lỗi khi cập nhật phiếu giảm giá');
          }
        });
    } else {
      api
        .createCoupon(values)
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Add coupon error', error);
          if (error?.response?.data?.message === 'Coupon is already exists') {
            messageApi.error('Hãng đã tồn tại');
          } else {
            messageApi.error('Lỗi khi thêm phiếu giảm giá');
          }
        });
    }
  };

  const onChangeImg = url => {
    setLogo(url);
  };

  const onRemoveImg = () => {
    setLogo('');
  };

  const options = Object.values(PRODUCT_TYPES).map(feature => ({
    label: getProductTypeName(feature),
    value: feature,
  }));

  return (
    <Modal
      title={data?.id ? 'Chỉnh sửa phiếu giảm giá' : 'Thêm phiếu giảm giá'}
      open={modal.visible}
      onCancel={modal.hide}
      afterClose={modal.remove}
      footer={[
        <Button key="cancel" onClick={modal.hide}>
          Hủy
        </Button>,
        <Button form="add-form" key="submit" htmlType="submit" type="primary">
          {data?.id ? 'Cập nhật' : 'Thêm'}
        </Button>,
      ]}
    >
      <CustomForm
        id="add-form"
        onFinish={onFinish}
        autoComplete="off"
        labelCol={{ span: 6 }}
      >
        <Form.Item
          name="id"
          label="ID phiếu"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.id || ''}
        >
          <Input
            placeholder="Ví dụ: coupon_1, ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
            disabled={data?.id}
          />
        </Form.Item>
        <Form.Item
          name="title"
          label="Tên phiếu"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.title || ''}
        >
          <Input
            placeholder="Ví dụ: August Gift Voucher ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="couponCode"
          label="Mã giảm giá"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.couponCode || ''}
        >
          <Input
            placeholder="Ví dụ: AUGUST23, ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="discountPercentage"
          label="% giảm giá"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.discountPercentage || ''}
        >
          <Input
            placeholder="Ví dụ: 10, ..."
            type="number"
            min={0}
            max={100}
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="minimumAmount"
          label="Giảm tối đa"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.minimumAmount || null}
        >
          <Input
            placeholder="Ví dụ: 10$, ..."
            autoComplete="nope"
            type="number"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="startTime"
          label="Ngày bắt đầu"
          initialValue={data?.startTime ? dayjs(data.startTime) : null}
        >
          <CustomDatePicker />
        </Form.Item>
        <Form.Item
          name="endTime"
          label="Ngày kết thúc"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.endTime ? dayjs(data.endTime) : null}
        >
          <CustomDatePicker />
        </Form.Item>
        <Form.Item
          name="productType"
          label="Thể loại"
          initialValue={data?.productType || ''}
        >
          <Select allowClear placeholder="Chọn thể loại" options={options} />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          initialValue={data?.status || null}
        >
          <Select allowClear placeholder="Chọn trạng thái">
            <Select.Option value="active">Hoạt động</Select.Option>
            <Select.Option value="inactive">Không hoạt động</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="logo" label="Ảnh phiếu">
          {logo !== '' && (
            <ImageContainer>
              <ImageWrapper key={logo}>
                <RemoveButton type="button" onClick={onRemoveImg} size="sm" />
                <StyledImage src={logo} alt="logo-coupon" />
              </ImageWrapper>
            </ImageContainer>
          )}
          <UploadWidget onChange={onChangeImg} />
        </Form.Item>
      </CustomForm>
    </Modal>
  );
});

export default AddCoupon;
