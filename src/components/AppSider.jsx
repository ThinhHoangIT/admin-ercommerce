import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { MdManageSearch } from 'react-icons/md';
import { CiViewList } from 'react-icons/ci';
import { BsDatabaseLock } from 'react-icons/bs';

import { selectCurrentModule, setCurrentModule } from '@/store/app';
import colors from '@/theme/color';
import { Layout } from 'antd';
import { APP_MODULES } from '@/commons/constants';
import fonts from '@/theme/font';

const Container = styled(Layout.Sider)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: 12,
  height: '100%',
  flex: '0 0 64px !important',
  minWidth: '64px !important',
  background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.header} 100%) !important`,
  '.ant-layout-sider-children': {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const Logo = styled.img({
  width: 40,
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 2,
  objectFit: 'contain',
  marginBottom: 24,
});

const ModuleItem = styled.div(props => ({
  backgroundColor: props.selected ? colors.darkOrange : 'inherit',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  padding: 12,
  paddingTop: 16,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: props.selected ? colors.darkOrange : colors.secondary,
  },
}));

const ModuleName = styled.span({
  fontSize: 10,
  color: 'white',
  fontFamily: fonts.Medium,
});

const AppSider = () => {
  const dispatch = useDispatch();

  const currentModule = useSelector(selectCurrentModule);

  const onSelectUI = e => {
    dispatch(setCurrentModule(APP_MODULES.UI));
  };

  const onSelectManage = e => {
    dispatch(setCurrentModule(APP_MODULES.MANAGE));
  };

  const onSelectAdmin = e => {
    dispatch(setCurrentModule(APP_MODULES.ADMIN));
  };

  return (
    <Container>
      <Logo src="/logo.png" alt="Logo" />
      <ModuleItem
        onClick={onSelectUI}
        selected={currentModule === APP_MODULES.UI}
      >
        <MdManageSearch size={20} color="white" />
        <ModuleName>UI</ModuleName>
      </ModuleItem>
      <ModuleItem
        onClick={onSelectManage}
        selected={currentModule === APP_MODULES.MANAGE}
      >
        <CiViewList size={20} color="white" />
        <ModuleName>Quản lí</ModuleName>
      </ModuleItem>
      <ModuleItem
        onClick={onSelectAdmin}
        selected={currentModule === APP_MODULES.ADMIN}
      >
        <BsDatabaseLock size={20} color="white" />
        <ModuleName>ADMIN</ModuleName>
      </ModuleItem>
    </Container>
  );
};

export default AppSider;
