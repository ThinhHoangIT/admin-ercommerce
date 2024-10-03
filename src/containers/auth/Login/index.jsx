import { useEffect } from 'react';
import { Button, Form, Input, message } from 'antd';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import packageJSON from '~/package.json';
import api from '@/services/api';
import { setCurrentUser } from '@/store/app';
import storage from '@/storage';
import logo from '@/assets/logo.svg';

const LoginContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  height: '100%',
});

const LoginForm = styled(Form)({
  width: 300,
  padding: 12,
});

const Logo = styled.img({
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: 24,
});

const Version = styled.div({
  position: 'absolute',
  bottom: 24,
  color: 'gray',
  fontSize: 12,
});

const SubmitButton = styled(Button)({
  width: '100%',
  marginTop: 4,
});

const Login = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = values => {
    api
      .login(values.phone, values.password)
      .then(response => {
        if (response.status !== 200) {
          messageApi.error('Đăng nhập thất bại');
        }
        dispatch(setCurrentUser(response.data));
      })
      .catch(() => {
        messageApi.error('Đăng nhập thất bại');
      });
  };

  useEffect(() => {
    const user = storage.getUser();
    if (user?.refreshToken) {
      api
        .loginWithRefreshToken(user.refreshToken)
        .then(response => {
          if (response.status !== 200) {
            messageApi.error('Đăng nhập thất bại');
          }
          dispatch(setCurrentUser(response.data));
        })
        .catch(() => {
          messageApi.error('Đăng nhập thất bại');
        });
    }
  }, []);

  return (
    <LoginContainer>
      {contextHolder}
      <LoginForm onFinish={onFinish}>
        <Logo src={logo} alt="Logo" width={120} />
        <Form.Item
          name="phone"
          initialValue={'0999999999'}
          rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
        >
          <Input placeholder="Số điện thoại" size="large" autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="password"
          initialValue={'123123'}
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            {
              min: 6,
              message: 'Mật khẩu có ít nhất 6 ký tự',
              validateTrigger: 'onBlur',
            },
          ]}
        >
          <Input.Password placeholder="Mật khẩu" size="large" />
        </Form.Item>
        <Form.Item>
          <SubmitButton type="primary" htmlType="submit" size="large">
            Đăng nhập
          </SubmitButton>
        </Form.Item>
      </LoginForm>

      <Version>
        Ứng dụng quản lý bán hàng - Phiên bản {packageJSON.version}
      </Version>
    </LoginContainer>
  );
};

export default Login;
