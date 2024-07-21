import { Box, Grid, Paper } from "@mui/material";
import Chats from "./Chats";
import SideBar from "./SideBar";
import GroupChats from "./GroupChats";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectConversation } from "../../redux/reducers/chatSlice";

const Home = () => {
  const conversation = useAppSelector(selectConversation);

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3} sm={4}>
          <Paper elevation={3} sx={{ height: "630px" }}>
            <SideBar />
          </Paper>
        </Grid>
        <Grid item xs={12} md={9} sm={8}>
          <Paper elevation={3} sx={{ height: "630px" }}>
            {conversation === "contact" && <Chats />}
            {conversation === "group" && <GroupChats />}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
