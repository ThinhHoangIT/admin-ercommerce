import { useState } from 'react';
import { Modal, Button, Form, Input, Select, Upload } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';
import { DeleteOutlined } from '@ant-design/icons';

import api from '@/services/api';
import { PRODUCT_TYPES } from '@/commons/constants';
import { getProductTypeName } from '@/commons/locale';
import UploadWidget from '@/components/ImageUpload';

const CustomForm = styled(Form)({
  marginTop: 24,
  marginBottom: 24,
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

const AddCategory = NiceModal.create(({ data, onSuccess, messageApi }) => {
  const modal = useModal();
  const [img, setImg] = useState(data?.img || '');

  const onFinish = values => {
    if (data?.id) {
      const updatedValues = {};
      Object.keys(values).forEach(key => {
        if (values[key] !== data[key]) {
          updatedValues[key] = values[key];
        }
      });

      api
        .updateCategory(data.id, updatedValues)
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Update category error', error);
          if (error?.response?.data?.message === 'Category is already exists') {
            messageApi.error('Mã loại SP đã tồn tại');
          } else {
            messageApi.error('Lỗi khi cập nhật loại SP');
          }
        });
    } else {
      api
        .createCategory(values)
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Add category error', error);
          if (error?.response?.data?.message === 'Category is already exists') {
            messageApi.error('Mã loại SP đã tồn tại');
          } else {
            messageApi.error('Lỗi khi thêm loại SP');
          }
        });
    }
  };

  const onChangeImg = url => {
    setImg(url);
  };

  const onRemoveImg = () => {
    setImg('');
  };

  const options = Object.values(PRODUCT_TYPES).map(feature => ({
    label: getProductTypeName(feature),
    value: feature,
  }));

  return (
    <Modal
      title={data?.id ? 'Chỉnh sửa loại SP' : 'Thêm loại SP'}
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
          label="Mã loại SP"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.id || ''}
        >
          <Input
            placeholder="Ví dụ: category_1, ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
            disabled={data?.id}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên loại SP"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.name || ''}
        >
          <Input
            placeholder="Ví dụ: Electronics, Fashion ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="productType"
          label="Thể loại"
          initialValue={data?.productType || ''}
        >
          <Select allowClear placeholder="Chọn thể loại" options={options} />
        </Form.Item>
        <Form.Item name="img" label="Ảnh thể loại">
          {img !== '' && (
            <ImageContainer>
              <ImageWrapper key={img}>
                <RemoveButton type="button" onClick={onRemoveImg} size="sm" />
                <StyledImage src={img} alt="img-category" />
              </ImageWrapper>
            </ImageContainer>
          )}
          <UploadWidget onChange={onChangeImg} />
        </Form.Item>
      </CustomForm>
    </Modal>
  );
});

export default AddCategory;
