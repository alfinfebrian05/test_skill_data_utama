import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  currentUser: null,
  notification: null,
  token: null,
  searchParam: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
  setSearchParam: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({ name: null });
  const [notification, _setNotification] = useState("");
  const [searchParam, _setSearchParam] = useState("");
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

  const setNotification = (message) => {
    _setNotification(message);
    setTimeout(() => {
      _setNotification("");
    }, 5000);
  };

  const setToken = (token) => {
    _setToken(token);

    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const setSearchParam = (param) => {
    _setSearchParam(param);
  };

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        notification,
        searchParam,
        setSearchParam,
        setUser,
        setToken,
        setNotification,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
