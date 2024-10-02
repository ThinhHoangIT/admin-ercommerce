import { Modal, Button, Form, Input } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';
import api from '@/services/api';

const CustomForm = styled(Form)({
  marginTop: 24,
  marginBottom: 24,
});

const AddDepartment = NiceModal.create(({ data, onSuccess, messageApi }) => {
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
        .updateDepartment(data.id, updatedValues)
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Update department error', error);
          if (
            error?.response?.data?.message === 'Department is already exists'
          ) {
            messageApi.error('Mã bộ phận đã tồn tại');
          } else {
            messageApi.error('Lỗi khi cập nhật bộ phận');
          }
        });
    } else {
      api
        .createDepartment(values)
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Add department error', error);
          if (
            error?.response?.data?.message === 'Department is already exists'
          ) {
            messageApi.error('Mã bộ phận đã tồn tại');
          } else {
            messageApi.error('Lỗi khi thêm bộ phận');
          }
        });
    }
  };

  return (
    <Modal
      title={data?.id ? 'Chỉnh sửa bộ phận' : 'Thêm bộ phận'}
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
          label="Mã bộ phận"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.id || ''}
        >
          <Input
            placeholder="Ví dụ: vp, x2, ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
            disabled={data?.id}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên bộ phận"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.name || ''}
        >
          <Input
            placeholder="Ví dụ: Văn phòng, Xưởng, ..."
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
      </CustomForm>
    </Modal>
  );
});

export default AddDepartment;
