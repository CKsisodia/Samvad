import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { InputAdornment, OutlinedInput } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ChangeEvent, FormEvent, useState } from "react";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../../types/user";
import { useAppDispatch } from "../../hooks/reduxHooks";
import {
  getUserInfoAction,
  userLoginAction,
} from "../../redux/actions/asyncAuthActions";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loginFormData, setLoginFormData] = useState<userLogin>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await dispatch(userLoginAction(loginFormData));
    await dispatch(getUserInfoAction());

    const status = response?.type?.split("/")[1];
    if (status === "fulfilled") {
      navigate("/");
    }
    setLoginFormData({
      email: "",
      password: "",
    });
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            'url("/static/images/templates/templates-images/sign-in-side-bg.png")',

          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "left",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <Typography variant="h6">Email</Typography>
            <OutlinedInput
              id="email"
              name="email"
              fullWidth
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  <MdEmail size="1.2rem" />
                </InputAdornment>
              }
            />
            <Typography variant="h6">Password</Typography>
            <OutlinedInput
              id="password"
              name="password"
              fullWidth
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  <RiLockPasswordFill size="1.2rem" />
                </InputAdornment>
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/signup">Don't have an account? Sign Up</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
