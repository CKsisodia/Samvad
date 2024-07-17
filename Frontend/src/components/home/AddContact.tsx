import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaMobileScreenButton } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { addContact } from "../../types/user";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  addContactAction,
  findContactAction,
} from "../../redux/actions/asyncChatActions";
import { selectSpecificContact } from "../../redux/reducers/chatSlice";
import { avtarNameHandler } from "../../utils/helperFunctions";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  maxWidth: 600,
}));

const AddContact = ({ openAddContact, handleCloseAddContact }: any) => {
  const dispatch = useAppDispatch();
  const specificContactData = useAppSelector(selectSpecificContact);

  const [handleData, setHandleData] = useState<addContact>({
    email: "",
    mobile: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHandleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(findContactAction(handleData));
  };

  const handleAddContact = (contactUserId: number) => {
    dispatch(addContactAction(contactUserId));
  };

  return (
    <>
      <BootstrapDialog
        onClose={handleCloseAddContact}
        aria-labelledby="customized-dialog-title"
        open={openAddContact}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Search and Add Contact
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseAddContact}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Typography variant="body1">Email</Typography>
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
              sx={{ mb: 2 }}
            />
            <Typography variant="body1" textAlign="center">
              OR
            </Typography>
            <Typography variant="body1">Mobile</Typography>
            <OutlinedInput
              id="mobile"
              name="mobile"
              fullWidth
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  <FaMobileScreenButton size="1.2rem" />
                </InputAdornment>
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 1 }}
            >
              Search
            </Button>
          </Box>
        </DialogContent>
        {specificContactData?.status && (
          <DialogActions>
            <Box sx={{ flexGrow: 1, overflow: "hidden", px: 1.5 }}>
              <Item
                sx={{
                  my: 1,
                  mx: "auto",
                  p: 1,
                  display: "flex",
                  gap: 2,
                  color: "#000",
                }}
              >
                <Stack spacing={2} direction="row" alignItems="center">
                  <Avatar>
                    {avtarNameHandler(specificContactData?.data?.name)}
                  </Avatar>
                  <Typography noWrap>
                    {specificContactData?.data?.name}
                  </Typography>
                  <Typography noWrap>
                    {specificContactData?.data?.email}
                  </Typography>
                  <Typography noWrap>
                    {specificContactData?.data?.mobile}
                  </Typography>
                </Stack>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => {
                    handleAddContact(specificContactData?.data?.contactUserId);
                    handleCloseAddContact();
                  }}
                >
                  Add
                </Button>
              </Item>
            </Box>
          </DialogActions>
        )}
      </BootstrapDialog>
    </>
  );
};

export default AddContact;
