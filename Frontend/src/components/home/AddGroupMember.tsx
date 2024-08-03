import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  Switch,
  SwitchProps,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { FaMobileScreenButton } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { addContact } from "../../types/user";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  addContactAction,
  addGroupMemberAction,
  findContactAction,
  getSpecificGroupInfoAction,
} from "../../redux/actions/asyncChatActions";
import {
  resetSpecificContact,
  selectedGroupID,
  selectSpecificContact,
  selectSpecificGroupInfo,
} from "../../redux/reducers/chatSlice";
import { avtarNameHandler } from "../../utils/helperFunctions";
import { selectUserData } from "../../redux/reducers/authSlice";
import { getUserInfoAction } from "../../redux/actions/asyncAuthActions";

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

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
  maxWidth: 800,
}));

const AddGroupMember = () => {
  const dispatch = useAppDispatch();
  const specificContactData = useAppSelector(selectSpecificContact);
  const groupID =
    useAppSelector(selectedGroupID) ||
    JSON.parse(localStorage.getItem("selectedGroupID") || "null");

  const membersData = useAppSelector(selectSpecificGroupInfo);
  const user = useAppSelector(selectUserData);

  const userId = user?.data?.id;
  const memberDetails = membersData?.data?.memberDetails;
  const userMember = memberDetails?.find(
    (member) => member.userID === Number(userId)
  );
  const isUserAdmin = Boolean(userMember?.isAdmin);

  const [handleData, setHandleData] = useState<addContact>({
    email: "",
    mobile: "",
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHandleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(findContactAction(handleData));
  };

  useEffect(() => {
    dispatch(getUserInfoAction());
    dispatch(getSpecificGroupInfoAction(groupID));
  }, []);

  const handleAddMember = async (userID: number) => {
    const body = {
      userID: userID,
      groupID: groupID,
      isAdmin: isAdmin,
    };
    const response = await dispatch(addGroupMemberAction(body));
    const status = response?.type?.split("/")[1];
    if (status === "fulfilled") {
      dispatch(resetSpecificContact());
      setHandleData({
        email: "",
        mobile: "",
      });
    }
  };

  return (
    <>
      {isUserAdmin ? (
        <Box sx={{ width: "70%", margin: "0px auto" }}>
          <Typography sx={{ m: 0, p: 2, textAlign: "center" }} variant="h5">
            Search Member
          </Typography>

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
              sx={{
                mt: 2,
                mb: 1,
                backgroundColor: "#86C232",
                color: "#0A0A0A",
                "&:hover": {
                  backgroundColor: "#61892F",
                },
              }}
            >
              Search
            </Button>
          </Box>

          {specificContactData?.status && (
            <Item
              sx={{
                my: 4,
                display: "flex",
                color: "#000",
                justifyContent: "space-between",
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <FormControlLabel
                  control={<IOSSwitch sx={{ m: 1 }} />}
                  label="Make admin"
                  labelPlacement="start"
                  checked={isAdmin}
                  onChange={(e: SyntheticEvent, checked: boolean) =>
                    setIsAdmin(checked)
                  }
                />
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    backgroundColor: "#86C232",
                    color: "#0A0A0A",
                    "&:hover": {
                      backgroundColor: "#61892F",
                    },
                  }}
                  onClick={() => {
                    handleAddMember(specificContactData?.data?.contactUserId);
                  }}
                >
                  Add
                </Button>
              </Box>
            </Item>
          )}
        </Box>
      ) : (
        <div style={{ textAlign: "center", padding: "24%" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>
            Only admin can add a new member in group.
          </div>
        </div>
      )}
    </>
  );
};

export default AddGroupMember;
