import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { FaUser, FaUserPlus } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { MdGroupAdd } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  maxWidth: 400,
}));

const SideBar = () => {
  return (
    <Grid container>
      <Grid item>
        <Button variant="outlined" startIcon={<FaUser size="1rem" />}>
          Contacts
        </Button>
        <Button variant="outlined" startIcon={<FaUserPlus size="1.3rem" />}>
          Add Contact
        </Button>
      </Grid>

      <Grid item>
        <Button variant="outlined" startIcon={<FaUserGroup size="1.3rem" />}>
          Groups
        </Button>
        <Button variant="outlined" startIcon={<MdGroupAdd size="1.5rem" />}>
          Create Group
        </Button>
      </Grid>

      <Grid item>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <IoSearchSharp />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search or start a new chat"
          />
        </Paper>
      </Grid>

      <Box sx={{ flexGrow: 1, overflow: "hidden", px: 1.5 }}>
        <Item
          sx={{
            my: 1,
            mx: "auto",
            p: 1,
          }}
        >
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar>CK</Avatar>
            <Typography noWrap>CK sisodia</Typography>
          </Stack>
        </Item>
        <Item
          sx={{
            my: 1,
            mx: "auto",
            p: 1,
          }}
        >
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar>CK</Avatar>
            <Typography noWrap>CK sisodia</Typography>
          </Stack>
        </Item>
      </Box>
    </Grid>
  );
};

export default SideBar;
