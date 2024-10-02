import NiceModal from '@ebay/nice-modal-react';

import AddRole from './admin/AddRole';
import AddEmployee from './admin/AddEmployee';
import AddDepartment from './admin/AddDepartment';
import AddCategory from './manage/AddCategory';
import AddBrand from './manage/AddBrand';
import AddProduct from './manage/AddProduct';
import AddCoupon from './manage/AddCoupon';

NiceModal.register('add-product', AddProduct);
NiceModal.register('add-employee', AddEmployee);
NiceModal.register('add-role', AddRole);
NiceModal.register('add-department', AddDepartment);
NiceModal.register('add-category', AddCategory);
NiceModal.register('add-brand', AddBrand);
NiceModal.register('add-coupon', AddCoupon);
