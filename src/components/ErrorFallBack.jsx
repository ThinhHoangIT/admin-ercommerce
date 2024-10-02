import styled from 'styled-components';
import { Button, Result } from 'antd';

const ErrorContainer = styled.div({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'text !important',
});

const ErrorFallback = ({ error }) => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <ErrorContainer>
      <Result
        status="500"
        title={'Lỗi'}
        subTitle={
          <>
            <p>Có lỗi xảy ra. Vui lòng khởi động lại ứng dụng.</p>
            <pre>{error.message}</pre>
          </>
        }
        extra={
          <Button type="primary" onClick={handleReload}>
            Khởi động lại
          </Button>
        }
      />
    </ErrorContainer>
  );
};

export default ErrorFallback;
