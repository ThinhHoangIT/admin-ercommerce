import axios from 'axios';
import { API_URL } from '@/commons/constants';
import storage from '@/storage';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

api.interceptors.request.use(
  config => {
    const user = storage.getUser();
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    console.log('Request: ', config);
    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const user = storage.getUser();
      const refreshToken = user ? user.refreshToken : null;
      return axios
        .post(API_URL + '/employees/auth/refresh-token', { refreshToken })
        .then(res => {
          if (res.status === 201) {
            user.token = res.data.token;
            storage.setUser(user);
            originalRequest.headers['Authorization'] =
              'Bearer ' + res.data.token;
            return api(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  },
);

api.login = async (phone, password) => {
  const response = await api
    .post('/employees/auth/login', { phone, password })
    .catch(console.log);
  if (response.success) {
    const user = response.data;
    storage.setUser(user);
  }
  return response;
};

api.loginWithRefreshToken = async refreshToken => {
  const response = await api
    .post('/employees/auth/refresh-token', { refreshToken })
    .catch(console.log);
  if (response.success) {
    const user = response.data;
    storage.setUser(user);
  }
  return response;
};

// Product
api.getProducts = async params => {
  return api.get('/products', { params });
};
api.getProduct = async id => {
  return api.get(`/products/${id}`);
};
api.createProduct = async product => {
  return api.post('/products', product);
};
api.updateProduct = async (id, product) => {
  return api.put(`/products/${id}`, product);
};
api.deleteProduct = async id => {
  return api.delete(`/products/${id}`);
};
api.getProductsLogs = async () => {
  return api.get('/logs/collection?tableName=Product');
};

// Order
api.getOrders = async params => {
  return api.get('/orders', { params });
};
api.getOrder = async id => {
  return api.get(`/orders/${id}`);
};
api.updateOrderStatus = async (id, product) => {
  return api.put(`/orders/${id}`, product);
};
api.deleteOrder = async id => {
  return api.delete(`/orders/${id}`);
};
api.getOrdersLogs = async () => {
  return api.get('/logs/collection?tableName=Order');
};

// Brand
api.getBrands = async params => {
  return api.get('/brands', { params });
};
api.getBrand = async id => {
  return api.get(`/brands/${id}`);
};
api.createBrand = async brand => {
  return api.post('/brands', brand);
};
api.updateBrand = async (id, brand) => {
  return api.put(`/brands/${id}`, brand);
};
api.deleteBrand = async id => {
  return api.delete(`/brands/${id}`);
};
api.getBrandsLogs = async () => {
  return api.get('/logs/collection?tableName=Brand');
};

// Categories
api.getCategories = async params => {
  return api.get('/categories', { params });
};
api.getCategory = async id => {
  return api.get(`/categories/${id}`);
};
api.createCategory = async category => {
  return api.post('/categories', category);
};
api.updateCategory = async (id, category) => {
  return api.put(`/categories/${id}`, category);
};
api.deleteCategory = async id => {
  return api.delete(`/categories/${id}`);
};
api.getCategoriesLogs = async () => {
  return api.get('/logs/collection?tableName=Category');
};

// Employees
api.getEmployees = async params => {
  return api.get('/employees', { params });
};
api.getEmployee = async id => {
  return api.get(`/employees/${id}`);
};
api.createEmployee = async employee => {
  return api.post('/employees', employee);
};
api.updateEmployee = async (id, employee) => {
  return api.put(`/employees/${id}`, employee);
};
api.deleteEmployee = async id => {
  return api.delete(`/employees/${id}`);
};
api.getEmployeesLogs = async () => {
  return api.get('/logs/collection?tableName=Employee');
};

// Roles
api.getRoles = async params => {
  return api.get('/roles', { params });
};
api.getRole = async id => {
  return api.get(`/roles/${id}`);
};
api.createRole = async role => {
  return api.post('/roles', role);
};
api.updateRole = async (id, role) => {
  return api.put(`/roles/${id}`, role);
};
api.deleteRole = async id => {
  return api.delete(`/roles/${id}`);
};
api.getRolesLogs = async () => {
  return api.get('/logs/collection?tableName=Role');
};

// Departments
api.getDepartments = async params => {
  return api.get('/departments', { params });
};
api.getDepartment = async id => {
  return api.get(`/departments/${id}`);
};
api.createDepartment = async department => {
  return api.post('/departments', department);
};
api.updateDepartment = async (id, department) => {
  return api.put(`/departments/${id}`, department);
};
api.deleteDepartment = async id => {
  return api.delete(`/departments/${id}`);
};
api.getDepartmentsLogs = async () => {
  return api.get('/logs/collection?tableName=Department');
};

// Coupon
api.getCoupons = async params => {
  return api.get('/coupons', { params });
};
api.getCoupon = async id => {
  return api.get(`/coupons/${id}`);
};
api.createCoupon = async coupon => {
  return api.post('/coupons', coupon);
};
api.updateCoupon = async (id, coupon) => {
  return api.put(`/coupons/${id}`, coupon);
};
api.deleteCoupon = async id => {
  return api.delete(`/coupons/${id}`);
};
api.getCouponsLogs = async () => {
  return api.get('/logs/collection?tableName=Coupon');
};

export default api;
