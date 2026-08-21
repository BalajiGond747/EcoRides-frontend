import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";
const USER_KEY = "currentUser";


export const setToken = (token) => {
  if (!token) {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};


export const setCurrentUser = (user) => {
  if (!user) {
    return;
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Invalid stored user:", error);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const removeCurrentUser = () => {
  localStorage.removeItem(USER_KEY);
};


export const getCurrentUser = () => {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);

    if (!decoded.exp || decoded.exp * 1000 <= Date.now()) {
      removeToken();
      removeCurrentUser();
      return null;
    }

    const storedUser = getStoredUser();

    if (!storedUser) {
      removeToken();
      return null;
    }

    return storedUser;
  } catch (error) {
    console.error("Invalid JWT token:", error);

    removeToken();
    removeCurrentUser();

    return null;
  }
};


export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const isAdmin = () => {
  const user = getCurrentUser();

  return user?.userRole === "ADMIN";
};

export const isUser = () => {
  const user = getCurrentUser();

  return user?.userRole === "USER";
};


export const logout = () => {
  removeToken();
  removeCurrentUser();

  window.location.href = "/login";
};
