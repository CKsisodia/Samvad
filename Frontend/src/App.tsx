import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import { useAppDispatch } from "./hooks/reduxHooks";
import { useEffect } from "react";
import { getUserInfoAction } from "./redux/actions/asyncAuthActions";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import RedirectToAuth from "./routes/RedirectToAuth";
import NavBarLayout from "./components/home/NavBarLayout";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserInfoAction());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<NavBarLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Route>
        <Route element={<RedirectToAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
