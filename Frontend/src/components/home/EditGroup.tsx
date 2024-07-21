import CloseIcon from "@mui/icons-material/Close";
import { Box, InputAdornment, OutlinedInput } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useAppDispatch } from "../../hooks/reduxHooks";
import {
  createGroupAction,
  getGroupInfoAction,
  renameGroupAction,
} from "../../redux/actions/asyncChatActions";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));


const EditGroup = ({ openGroup, handleCloseGroup, groupID }: any) => {
  const dispatch = useAppDispatch();

  const [newTitle, setNewTitle] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const editData = {
      groupID: groupID,
      newTitle: newTitle,
    };
    const response = await dispatch(renameGroupAction(editData));
    const status = response?.type?.split("/")[1];
    if (status === "fulfilled") {
      setNewTitle("");
      handleCloseGroup();
    }
  };

  // useEffect(() => {
  //   dispatch(getGroupInfoAction());
  // }, []);

  return (
    <>
      <BootstrapDialog
        onClose={handleCloseGroup}
        aria-labelledby="customized-dialog-title"
        open={openGroup}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Rename Your Group
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseGroup}
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
            <Typography variant="body1">New Title</Typography>
            <OutlinedInput
              id="title"
              name="title"
              fullWidth
              value={newTitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewTitle(e.target.value)
              }
              startAdornment={
                <InputAdornment position="start">
                  <MdDriveFileRenameOutline size="1.2rem" />
                </InputAdornment>
              }
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 1 }}
            >
              Update
            </Button>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default EditGroup;
