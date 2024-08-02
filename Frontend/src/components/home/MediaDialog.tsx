import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const MediaDialog = ({ open, handleClose, dialogContent }: any) => {
  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullScreen
    >
      <DialogTitle sx={{ m: 0, p: 2 , backgroundColor:'#bfe39d' , textAlign:'center' }} id="customized-dialog-title">
        {dialogContent?.type.split("/")[0]}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
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
        {dialogContent?.type.startsWith("image/") && (
          <img
            src={dialogContent?.url}
            alt="try again"
            style={{  width: "100%" , height:'100%'}}
          />
        )}

        {dialogContent?.type.startsWith("video/") && (
          <video controls style={{ width: "100%" , height:'100%'}}>
            <source src={dialogContent?.url} type={dialogContent?.type} />
          </video>
        )}
      </DialogContent>
    </BootstrapDialog>
  );
};

export default MediaDialog;
