import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, setCurrentUser } from '@/store/app';
import Login from '@/containers/auth/Login';
import Home from '@/containers/home';
import { ConfigProvider } from 'antd';
import colors from './theme/color';
import storage from './storage';

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const user = storage.getUser();
  useEffect(() => {
    if (!currentUser && user) {
      dispatch(setCurrentUser(user));
    }
  }, [currentUser, user, dispatch]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: colors.primary,
        },
      }}
    >
      {currentUser ? <Home /> : <Login />}
    </ConfigProvider>
  );
};

export default App;
