import storage from '@/storage';
import axios from 'axios';
import dayjs from 'dayjs';

export const sortByAlphabet = (a, b) => {
  return `${a}`.localeCompare(`${b}`);
};

export const formatFullDateTime = date => {
  if (!date) {
    return '';
  }
  return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
};

export const formatShortYear = date => {
  if (!date) {
    return '';
  }
  return dayjs(date).format('DD/MM/YY HH:mm');
};

export const formatDate = date => {
  if (!date) {
    return '';
  }
  return dayjs(date).format('DD/MM/YYYY');
};

const numberFormatter = new Intl.NumberFormat();

export const formatNumber = num => {
  return numberFormatter.format(num);
};

export const getImage = async url => {
  const user = storage.getUser();
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    responseType: 'blob',
  });

  return URL.createObjectURL(response.data);
};

export const formatPrice = price => {
  return price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
