import { Modal, Button, Form, Input, Select } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';
import api from '@/services/api';
import { ROLE_FEATURES } from '@/commons/constants';
import { getFeatureName } from '@/commons/locale';

const CustomForm = styled(Form)({
  marginTop: 24,
  marginBottom: 24,
});

const AddRole = NiceModal.create(({ data, onSuccess, messageApi }) => {
  const modal = useModal();

  const onFinish = values => {
    if (data?.id) {
      const updatedValues = {};
      Object.keys(values).forEach(key => {
        if (values[key] !== data[key]) {
          updatedValues[key] = values[key];
        }
      });

      api
        .updateRole(data.id, updatedValues)
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Update role error', error);
          if (error?.response?.data?.message === 'Role is already exists') {
            messageApi.error('Mã vai trò đã tồn tại');
          } else {
            messageApi.error('Lỗi khi cập nhật vai trò');
          }
        });
    } else {
      api
        .createRole(values)
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Add role error', error);
          if (error?.response?.data?.message === 'Role is already exists') {
            messageApi.error('Mã vai trò đã tồn tại');
          } else {
            messageApi.error('Lỗi khi thêm vai trò');
          }
        });
    }
  };

  const options = Object.values(ROLE_FEATURES).map(feature => ({
    label: getFeatureName(feature),
    value: feature,
  }));

  return (
    <Modal
      title={data?.id ? 'Chỉnh sửa vai trò' : 'Thêm vai trò'}
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
        labelCol={{ span: 5 }}
      >
        <Form.Item
          name="id"
          label="Mã vai trò"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.id || ''}
        >
          <Input
            placeholder="Ví dụ: cskh, sales, ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
            disabled={data?.id}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên vai trò"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.name || ''}
        >
          <Input
            placeholder="Ví dụ: Kho, Sales, ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="accessibleFeatures"
          label="Tính năng"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.accessibleFeatures || []}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Chọn tính năng được truy cập"
            options={options}
            defaultValue={null}
          />
        </Form.Item>
      </CustomForm>
    </Modal>
  );
});

export default AddRole;
