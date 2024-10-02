import colors from '@/theme/color';
import fonts from '@/theme/font';
import { Layout } from 'antd';
import styled from 'styled-components';

export const AppLayout = styled(Layout)({
  width: '100%',
  height: '100%',
});

export const MenuSider = styled(Layout.Sider)({
  background: 'white !important',
});

export const User = styled.div({
  userSelect: 'none',
  padding: 12,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  borderBottom: `1px solid ${colors.border}`,
  borderRight: `1px solid ${colors.border}`,
});

export const Name = styled.span({
  fontSize: 13,
  fontFamily: fonts.Medium,
  marginLeft: 8,
  marginTop: 2,
  width: 120,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
