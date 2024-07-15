import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";
import { selectUserData } from "../redux/reducers/authReducers";

const RedirectToAuth = () => {
  const user = useAppSelector(selectUserData);
  return user?.status ? <Navigate to="/" /> : <Outlet />;
};

export default RedirectToAuth;
