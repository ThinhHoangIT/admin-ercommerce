import { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';
import api from '@/services/api';

const CustomForm = styled(Form)({
  marginTop: 24,
  marginBottom: 24,
});

const AddEmployee = NiceModal.create(({ data, onSuccess, messageApi }) => {
  const modal = useModal();
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    api
      .getDepartments()
      .then(response => {
        setDepartments(
          response.data?.map(d => {
            d.label = d.name;
            d.value = d.id;
            return d;
          }),
        );
      })
      .catch(error => {
        console.log('Get departments error', error);
      });
    api
      .getRoles()
      .then(response => {
        setRoles(
          response.data?.map(r => {
            r.label = r.name;
            r.value = r.id;
            return r;
          }),
        );
      })
      .catch(error => {
        console.log('Get roles error', error);
      });
  }, []);

  const onFinish = values => {
    if (data?.id) {
      const updatedValues = {};
      Object.keys(values).forEach(key => {
        if (values[key] !== data[key]) {
          updatedValues[key] = values[key];
        }
      });
      if (Object.keys(updatedValues).length === 0) {
        return;
      }

      api
        .updateEmployee(data.id, updatedValues)
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Update employee error', error);
          if (error?.response?.data?.message === 'Employee is already exists') {
            messageApi.error('Mã nhân viên đã tồn tại');
          } else {
            messageApi.error('Lỗi khi cập nhật nhân viên');
          }
        });
    } else {
      api
        .createEmployee(values)
        .then(response => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Add employee error', error);
          if (error?.response?.data?.message === 'Employee is already exists') {
            messageApi.error('Mã nhân viên đã tồn tại');
          } else if (
            error?.response?.data?.message === 'Phone is already exists'
          ) {
            messageApi.error('Số điện thoại đã tồn tại');
          } else {
            messageApi.error('Lỗi khi thêm nhân viên');
          }
        });
    }
  };

  return (
    <Modal
      title={data?.id ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
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
        labelCol={{ span: 7 }}
      >
        <Form.Item
          name="id"
          label="Mã nhân viên"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.id || ''}
        >
          <Input
            placeholder="Nhập mã nhân viên"
            autoComplete="nope"
            spellCheck={false}
            allowClear
            disabled={data?.id}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên nhân viên"
          rules={[
            { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
          ]}
          initialValue={data?.name || ''}
        >
          <Input
            placeholder="Nhập tên nhân viên"
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="department"
          label="Bộ phận"
          initialValue={data?.department || ''}
        >
          <Select allowClear placeholder="Chọn bộ phận" options={departments} />
        </Form.Item>
        <Form.Item name="role" label="Vai trò" initialValue={data?.role || ''}>
          <Select allowClear placeholder="Chọn vai trò" options={roles} />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          initialValue={data?.phone || ''}
        >
          <Input
            placeholder="Nhập số điện thoại"
            autoComplete="nope"
            spellCheck={false}
            allowClear
          />
        </Form.Item>
        {!data?.hasPassword && (
          <Form.Item
            name="password"
            label="Mật khẩu"
            initialValue=""
            rules={[{ min: 6, message: 'Mật khẩu ít nhất 6 ký tự' }]}
          >
            <Input
              placeholder="Nhập mật khẩu ít nhất 6 ký tự"
              autoComplete="nope"
              spellCheck={false}
              allowClear
            />
          </Form.Item>
        )}
      </CustomForm>
    </Modal>
  );
});

export default AddEmployee;
