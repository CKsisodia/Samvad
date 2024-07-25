import React, { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import { selectUserData } from "../redux/reducers/authSlice";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "../common/Loading";

const ProtectedRoutes = () => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const location = useLocation();
  const user = useAppSelector(selectUserData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [user?.status]);

  if (isLoading) {
    return <Loading />;
  }

  return user?.status ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoutes;
