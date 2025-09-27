/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "CLEAR":
      return "";
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ""
  );

  return (
    <NotificationContext.Provider
      value={{ notification, notificationDispatch }}
    >
      {/* eslint-disable-next-line react/prop-types */}
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  return context.notification;
};

export const useNotificationDispatch = () => {
  const context = useContext(NotificationContext);
  return context.notificationDispatch;
};

export default NotificationContext;
