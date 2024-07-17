import {
  Avatar,
  Box,
  Button,
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
import { getAllContactsAction } from "../../redux/actions/asyncChatActions";
import {
  contactUserid,
  resetSpecificContact,
  selectContactsdata,
} from "../../redux/reducers/chatSlice";
import AddContact from "./AddContact";
import { avtarNameHandler } from "../../utils/helperFunctions";

const SideBar = () => {
  const dispatch = useAppDispatch();
  const contactsData = useAppSelector(selectContactsdata);  
  const [openAddContact, setOpenAddContact] = useState<Boolean>(false);
  const [selectedContact, setSelectedContact] = useState<number | null>(
    JSON.parse(localStorage.getItem("selectedContact") || "null")
  );

  useEffect(() => {
    dispatch(getAllContactsAction());
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("selectedContact", JSON.stringify(selectedContact));
  }, [selectedContact]);

  const handleOpenAddContact = () => {
    setOpenAddContact(true);
  };
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", m: 1, gap: 1 }}>
        <Button variant="outlined" startIcon={<FaUser size="1rem" />}>
          Contacts
        </Button>
        <Button
          variant="outlined"
          startIcon={<FaUserPlus size="1.3rem" />}
          onClick={handleOpenAddContact}
        >
          Add Contact
        </Button>
      </Box>

      <Box sx={{ display: "flex", m: 1, gap: 1 }}>
        <Button variant="outlined" startIcon={<FaUserGroup size="1.3rem" />}>
          Groups
        </Button>
        <Button variant="outlined" startIcon={<MdGroupAdd size="1.5rem" />}>
          Create Group
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <OutlinedInput
          id="outlined-adornment-weight"
          startAdornment={
            <InputAdornment position="start">
              <IoSearchSharp />
            </InputAdornment>
          }
          aria-describedby="outlined-weight-helper-text"
          inputProps={{
            "aria-label": "weight",
          }}
          size="small"
        />
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "hidden", px: 1.5 }}>
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
      <AddContact
        openAddContact={openAddContact}
        handleCloseAddContact={handleCloseAddContact}
      />
    </Box>
  );
};

export default SideBar;
