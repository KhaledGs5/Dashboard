import Cookies from 'js-cookie';

export const setCookie = (name, value, days) => {
  Cookies.set(name, JSON.stringify(value), { expires: days });
};

export const getCookie = (name) => {
  const cookieValue = Cookies.get(name);
  return cookieValue ? JSON.parse(cookieValue) : null;
};

export const deleteCookie = (name) => {
  Cookies.remove(name);
};
