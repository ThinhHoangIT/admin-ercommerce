import {
  APP_MENU,
  APP_MODULES,
  PRODUCT_STATUSES,
  PRODUCT_TYPES,
  ROLE_FEATURES,
  SIZES,
} from './constants';

export const getMenuName = key => {
  switch (key) {
    // UI
    case APP_MENU.UI_DASHBOARD:
      return 'Theo dõi dashboard';

    // MANAGE
    case APP_MENU.MANAGE_PRODUCT:
      return 'Quản lý sản phẩm';
    case APP_MENU.MANAGE_ORDER:
      return 'Quản lý đơn hàng';
    case APP_MENU.MANAGE_CATEGORY:
      return 'Quản lý loại sản phẩm';
    case APP_MENU.MANAGE_BRAND:
      return 'Quản lý hãng';
    // ADMIN
    case APP_MENU.ADMIN_EMPLOYEE:
      return 'Quản lý nhân viên';
    case APP_MENU.ADMIN_ROLE:
      return 'Quản lý vai trò';
    case APP_MENU.ADMIN_DEPARTMENT:
      return 'Quản lý bộ phận';
  }
};

export const getFeatureName = key => {
  switch (key) {
    case ROLE_FEATURES.ADMIN:
      return 'Admin - Đầy đủ tính năng';

    // ERP
    case ROLE_FEATURES.MANAGE_PRODUCT:
      return 'Quản lý sản phẩm';
    case ROLE_FEATURES.MANAGE_ORDER:
      return 'Quản lý đơn hàng';
    case ROLE_FEATURES.MANAGE_WAREHOUSE:
      return 'Quản lý kho';
  }
};

export const getModuleName = key => {
  switch (key) {
    case APP_MODULES.UI:
      return 'UI';
    case APP_MODULES.ADMIN:
      return 'Admin';
    case APP_MODULES.MANAGE:
      return 'Quản lý';
  }
};

export const getProductTypeName = key => {
  switch (key) {
    case PRODUCT_TYPES.ELECTRONICS:
      return 'Điện tử';
    case PRODUCT_TYPES.BEAUTY:
      return 'Sắc đẹp';
    case PRODUCT_TYPES.FASHION:
      return 'Thời trang';
    case PRODUCT_TYPES.JEWELRY:
      return 'Trang sức';
    default:
      return key;
  }
};

export const getSizeName = key => {
  switch (key) {
    case SIZES.SMALL:
      return 'Nhỏ';
    case SIZES.MEDIUM:
      return 'Vừa';
    case SIZES.LARGE:
      return 'Lớn';
    default:
      return key;
  }
};

export const getStatusProduct = key => {
  switch (key) {
    case PRODUCT_STATUSES.IN_STOCK:
      return 'Còn hàng';
    case PRODUCT_STATUSES.OUT_OF_STOCK:
      return 'Hết hàng';
    case PRODUCT_STATUSES.DISCONTINUED:
      return 'Ngừng kinh doanh';
    default:
      return key;
  }
};
