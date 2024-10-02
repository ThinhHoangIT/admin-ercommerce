import { Drawer, Card, Tag, Col, Row } from 'antd';
import styled from 'styled-components';

import { formatShortYear } from '@/commons/utils';

const Container = styled(Card)({
  marginBottom: 12,
  padding: 4,
  userSelect: 'text !important',
});

const Time = styled(Tag)({
  fontSize: 11,
  fontWeight: 600,
  color: 'gray',
});

const UserId = styled(Tag)({
  fontSize: 11,
  fontWeight: 600,
});

const TimeCol = styled(Col)({
  display: 'flex',
  justifyContent: 'center',
});

const UserCol = styled(Col)({
  display: 'flex',
  justifyContent: 'flex-end',
});

const ChangeItem = styled.div({
  fontSize: 12,
  fontWeight: 600,
  marginTop: 8,
  marginLeft: 4,
});

const ChangeContent = styled.span({
  fontSize: 12,
  fontWeight: 400,
});

const ChangeContentValue = styled(Tag)({
  fontSize: 12,
  fontWeight: 400,
  marginBottom: 4,
});

const getActionName = action => {
  switch (action) {
    case 'add':
      return (
        <Tag color="success" bordered={false}>
          Thêm
        </Tag>
      );

    case 'update':
      return (
        <Tag color="blue" bordered={false}>
          Cập nhật
        </Tag>
      );

    case 'delete':
      return (
        <Tag color="red" bordered={false}>
          Xóa
        </Tag>
      );

    default:
      return <Tag>Thao tác</Tag>;
  }
};

const LogsDrawer = ({ open, onClose, data, localeFields }) => {
  const renderChangeContent = value => {
    let content = value;
    if (typeof value === 'object') {
      content = JSON.stringify(value);
    }
    return <ChangeContentValue key={value}>{content}</ChangeContentValue>;
  };

  const renderChangeItem = change => {
    let content = <ChangeContent>{change.newValue}</ChangeContent>;
    if (Array.isArray(change.newValue)) {
      content = change.newValue.map(renderChangeContent);
    } else if (typeof change.newValue === 'object') {
      content = (
        <ChangeContent>{JSON.stringify(change.newValue)}</ChangeContent>
      );
    }

    return (
      <ChangeItem key={change._id}>
        {localeFields?.[change.fieldName] || change.fieldName}: {content}
      </ChangeItem>
    );
  };

  const renderLog = log => {
    return (
      <Container size="small" key={log._id}>
        <Row>
          <Col span={8}>{getActionName(log.action)}</Col>
          <TimeCol span={8}>
            <Time bordered={false}>{formatShortYear(log.time)}</Time>
          </TimeCol>
          <UserCol span={8}>
            <UserId color="processing" bordered={false}>
              {log.userId}
            </UserId>
          </UserCol>
        </Row>
        <div>
          <ChangeItem>
            {localeFields?.id || 'Mã'}:{' '}
            <ChangeContent>{log.recordId}</ChangeContent>
          </ChangeItem>
          {log.changes?.map(renderChangeItem)}
        </div>
      </Container>
    );
  };

  return (
    <Drawer title="Nhật ký" placement="right" open={open} onClose={onClose}>
      {data.map(renderLog)}
    </Drawer>
  );
};

export default LogsDrawer;
