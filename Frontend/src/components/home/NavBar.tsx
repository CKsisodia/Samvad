import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { SiLiberadotchat } from "react-icons/si";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { logoutUser, selectUserData } from "../../redux/reducers/authSlice";
import { toast } from "react-toastify";
import { avtarNameHandler } from "../../utils/helperFunctions";
import { useMediaQuery, useTheme } from "@mui/material";

const NavBar = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logoutHandler = () => {
    dispatch(logoutUser());
    toast.success("You have logged out");
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="static" sx={{backgroundColor: "#0A0A0A" , boxShadow:'none'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <SiLiberadotchat size="2.5rem" color="#86C232"/>
          </Box>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "#86C232",
              textDecoration: "none",
              fontSize:'2rem'
            }}
          >
            Samvad
          </Typography>
          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
            <SiLiberadotchat size="2.5rem" color="#86C232" />
          </Box>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color : "#86C232",
              textDecoration: "none",
              fontSize:'2rem'
            }}
          >
            Samvad
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          <Typography sx={{ mr: isSmallScreen ? 1 : 2  ,color: "#86C232"}}>{userData?.data?.name}</Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="user" sx={{backgroundColor:'#61892F'}}>
                  {avtarNameHandler(userData?.data?.name)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                onClick={() => {
                  handleCloseUserMenu();
                  logoutHandler();
                }}
              >
                <Typography textAlign="center" sx={{color:"#61892F" , fontWeight:700 , fontSize:'1rem'}}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
