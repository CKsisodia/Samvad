import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FaUser, FaUserPlus } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { IoSearchSharp } from "react-icons/io5";
import { MdGroupAdd } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  getAllContactsAction,
  getSpecificGroupInfoAction,
} from "../../redux/actions/asyncChatActions";
import {
  contactUserid,
  resetSpecificContact,
  selectContactOrGroup,
  selectContactsdata,
  selectConversation,
  selectGroupForID,
  selectGroupInfo,
} from "../../redux/reducers/chatSlice";
import AddContact from "./AddContact";
import { FcConferenceCall } from "react-icons/fc";
import { avtarNameHandler } from "../../utils/helperFunctions";
import AddGroup from "./AddGroup";

const SideBar = () => {
  const dispatch = useAppDispatch();
  const contactsData = useAppSelector(selectContactsdata);
  const conversation = useAppSelector(selectConversation);
  const groupData = useAppSelector(selectGroupInfo);
  const [openAddContact, setOpenAddContact] = useState<Boolean>(false);
  const [openGroup, setOpenGroup] = useState<Boolean>(false);

  const [selectedContact, setSelectedContact] = useState<number | null>(
    JSON.parse(localStorage.getItem("selectedContact") || "null")
  );

  const [selectedGroup, setSelectedGroup] = useState<number | null>(
    JSON.parse(localStorage.getItem("selectedGroupID") || "null")
  );

  useEffect(() => {
    dispatch(getAllContactsAction());
  }, [dispatch]);

  const handleCloseAddContact = () => {
    dispatch(resetSpecificContact());
    setTimeout(() => {
      setOpenAddContact(false);
    }, 0);
  };

  const handleContactClick = (id: number) => {
    setSelectedContact(id);
    dispatch(contactUserid(id));
  };
  const handleGroupClick = (id: number) => {
    setSelectedGroup(id);
    dispatch(selectGroupForID(id));
    dispatch(getSpecificGroupInfoAction(id));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{ display: "flex", m: 1, gap: 1, justifyContent: "space-between" }}
      >
        <Button
          startIcon={<FaUser size="1rem" />}
          onClick={() => dispatch(selectContactOrGroup("contact"))}
          sx={{
            backgroundColor: conversation === "contact" ? "#61892F" : "#86C232",
            color: "#0A0A0A",
            "&:hover": {
              backgroundColor: "#61892F",
            },
          }}
        >
          Contacts
        </Button>
        <Button
          startIcon={<FaUserGroup size="1.3rem" />}
          onClick={() => dispatch(selectContactOrGroup("group"))}
          sx={{
            backgroundColor: conversation === "group" ? "#61892F" : "#86C232",
            color: "#0A0A0A",
            "&:hover": {
              backgroundColor: "#61892F",
            },
          }}
        >
          Groups
        </Button>
      </Box>

      {conversation === "contact" && (
        <Box sx={{ flexGrow: 1, overflow: "hidden", px: 1.5 }}>
          <IconButton
            size="large"
            color="success"
            onClick={() => setOpenAddContact(true)}
          >
            <FaUserPlus size="2rem" color="#86C232"/>
          </IconButton>
          {contactsData?.data?.map((contact) => (
            <Paper
              key={contact?.id}
              sx={{
                my: 1,
                mx: "auto",
                p: 1,
                cursor: "pointer",
                backgroundColor:
                  selectedContact === contact?.contactUserID ? "grey.300" : "",
                "&:hover": {
                  backgroundColor: "grey.300",
                },
              }}
              onClick={() => handleContactClick(contact?.contactUserID)}
            >
              <Stack
                spacing={2}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Avatar>{avtarNameHandler(contact?.contactUser?.name)}</Avatar>
                <Typography noWrap>{contact?.contactUser?.name}</Typography>
                <Typography noWrap>{contact?.contactUser?.mobile}</Typography>
              </Stack>
            </Paper>
          ))}
        </Box>
      )}

      {conversation === "group" && (
        <Box sx={{ flexGrow: 1, overflow: "hidden", px: 1.5 }}>
          <IconButton
            size="large"
            color="success"
            onClick={() => setOpenGroup(true)}
          >
            <MdGroupAdd size="2.2rem" color="#86C232"/>
          </IconButton>
          {groupData?.data?.map((group: any, index) => (
            <Paper
              key={index}
              sx={{
                my: 1,
                mx: "auto",
                p: 2,
                cursor: "pointer",
                backgroundColor:
                  selectedGroup === group?.groupID ? "grey.300" : "",
                "&:hover": {
                  backgroundColor: "grey.300",
                },
              }}
              onClick={() => handleGroupClick(group?.groupID)}
            >
              <Stack
                spacing={2}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography noWrap>{group?.["group.title"]}</Typography>
                <Typography noWrap>
                  Members :- {group?.["group.totalMembers"]}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Box>
      )}

      <AddContact
        openAddContact={openAddContact}
        handleCloseAddContact={handleCloseAddContact}
      />
      <AddGroup
        openGroup={openGroup}
        handleCloseGroup={() => setOpenGroup(false)}
      />
    </Box>
  );
};

export default SideBar;
