const get = key => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage`, error);
  }
};

const set = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} to localStorage`, error);
  }
};

const remove = key => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage`, error);
  }
};

const storage = {
  getUser: () => {
    try {
      return get('user');
    } catch (error) {
      console.error(`Error getting user from localStorage`, error);
    }
  },
  setUser: data => {
    try {
      set('user', data);
    } catch (error) {
      console.error(`Error setting user to localStorage`, error);
    }
  },
  removeUser: () => {
    try {
      remove('user');
    } catch (error) {
      console.error(`Error removing user from localStorage`, error);
    }
  },
};

export default storage;
