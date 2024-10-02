import { useMemo } from 'react';
import { Breadcrumb, Layout } from 'antd';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { selectCurrentMenu, selectCurrentModule } from '@/store/app';
import { getMenuName, getModuleName } from '@/commons/locale';
import colors from '@/theme/color';

const Header = styled(Layout.Header)({
  height: 51,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: 24,
  paddingRight: 24,
  background: 'white',
  borderBottom: `1px solid ${colors.border}`,
});

const CustomBreadcrumb = styled(Breadcrumb)({
  fontWeight: '600',
});

const AppHeader = ({ detailText = '', onMenuClick, showDetailText }) => {
  const currentMenu = useSelector(selectCurrentMenu);
  const currentModule = useSelector(selectCurrentModule);

  const breadcrumbItems = useMemo(() => {
    const items = [
      {
        title: getModuleName(currentModule),
      },
      {
        title: getMenuName(currentMenu),
        href: showDetailText ? '' : undefined,
        onClick: e => {
          e.preventDefault();
          onMenuClick?.();
        },
      },
    ];
    if (showDetailText) {
      return [...items, { title: detailText }];
    }
    return items;
  }, [currentMenu, showDetailText]);

  return (
    <Header>
      <CustomBreadcrumb separator=">" items={breadcrumbItems} />
    </Header>
  );
};

export default AppHeader;
