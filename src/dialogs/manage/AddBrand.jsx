import { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';
import { DeleteOutlined } from '@ant-design/icons';

import api from '@/services/api';
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

const AddBrand = NiceModal.create(({ data, onSuccess, messageApi }) => {
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
        .updateBrand(data.id, { ...updatedValues })
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Update brand error', error);
          if (error?.response?.data?.message === 'Brand is already exists') {
            messageApi.error('Hãng đã tồn tại');
          } else {
            messageApi.error('Lỗi khi cập nhật hãng');
          }
        });
    } else {
      api
        .createBrand(values)
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Add brand error', error);
          if (error?.response?.data?.message === 'Brand is already exists') {
            messageApi.error('Hãng đã tồn tại');
          } else {
            messageApi.error('Lỗi khi thêm hãng');
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

  return (
    <Modal
      title={data?.id ? 'Chỉnh sửa hãng' : 'Thêm hãng'}
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
          label="Mã hãng"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.id || ''}
        >
          <Input
            placeholder="Ví dụ: brand_1, ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
            disabled={data?.id}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên hãng"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.name || ''}
        >
          <Input
            placeholder="Ví dụ: Sony, Logitech ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
        <Form.Item name="logo" label="Ảnh sản phẩm">
          {logo !== '' && (
            <ImageContainer>
              <ImageWrapper key={logo}>
                <RemoveButton type="button" onClick={onRemoveImg} size="sm" />
                <StyledImage src={logo} alt="logo-brand" />
              </ImageWrapper>
            </ImageContainer>
          )}
          <UploadWidget onChange={onChangeImg} />
        </Form.Item>
      </CustomForm>
    </Modal>
  );
});

export default AddBrand;
