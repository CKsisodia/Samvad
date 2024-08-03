import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  deleteGroupMemberAction,
  getSpecificGroupInfoAction,
  updateAdminStatusAction,
} from "../../redux/actions/asyncChatActions";
import { selectSpecificGroupInfo } from "../../redux/reducers/chatSlice";
import { RiAdminFill, RiAdminLine } from "react-icons/ri";
import { HiUserRemove } from "react-icons/hi";
import { selectUserData } from "../../redux/reducers/authSlice";
import { MdDoNotDisturb } from "react-icons/md";

const ListGroupMembers = () => {
  const dispatch = useAppDispatch();
  const membersData = useAppSelector(selectSpecificGroupInfo);
  const user = useAppSelector(selectUserData);

  const userId = user?.data?.id;
  const memberDetails = membersData?.data?.memberDetails;
  const userMember = memberDetails?.find(
    (member) => member.userID === Number(userId)
  );
  const isUserAdmin = Boolean(userMember?.isAdmin);

  useEffect(() => {
    const groupID = JSON.parse(
      localStorage.getItem("selectedGroupID") || "null"
    );
    if (groupID) {
      dispatch(getSpecificGroupInfoAction(groupID));
    }
  }, []);

  const adminStatusHandler = async ({
    groupID,
    userID,
    isAdmin,
  }: {
    groupID: number;
    userID: number;
    isAdmin: boolean;
  }) => {
    await dispatch(updateAdminStatusAction({ groupID, userID, isAdmin }));
  };

  const removeMemberHandler = async ({
    groupID,
    userID,
  }: {
    groupID: number;
    userID: number;
  }) => {
    await dispatch(deleteGroupMemberAction({ groupID, userID }));
  };

  const headerStyle = {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#0A0A0A",
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={headerStyle}>Name</TableCell>
            <TableCell align="center" sx={headerStyle}>
              Email
            </TableCell>
            <TableCell align="center" sx={headerStyle}>
              Mobile
            </TableCell>
            <TableCell align="center" sx={headerStyle}>
              Admin
            </TableCell>
            <TableCell align="center" sx={headerStyle}>
              Make/Remove Admin
            </TableCell>
            <TableCell align="center" sx={headerStyle}>
              Remove from group
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {membersData?.data?.memberDetails.map((member) => (
            <TableRow
              key={member?.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {member?.user?.name}
              </TableCell>
              <TableCell align="center">{member?.user?.email}</TableCell>
              <TableCell align="center">{member?.user?.mobile}</TableCell>
              <TableCell align="center">
                {member?.isAdmin ? "✅" : "❌"}
              </TableCell>
              <TableCell align="center">
                {isUserAdmin ? (
                  member?.isAdmin ? (
                    <IconButton
                      onClick={() =>
                        adminStatusHandler({
                          groupID: member?.groupID,
                          userID: member?.userID,
                          isAdmin: false,
                        })
                      }
                    >
                      <RiAdminFill size="1.4rem" />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() =>
                        adminStatusHandler({
                          groupID: member?.groupID,
                          userID: member?.userID,
                          isAdmin: true,
                        })
                      }
                    >
                      <RiAdminLine />
                    </IconButton>
                  )
                ) : (
                  <Tooltip title="Only admin" placement="top">
                    <IconButton size="small">
                      <MdDoNotDisturb size="1.4rem" />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell align="center">
                {isUserAdmin ? (
                  <IconButton
                    color="error"
                    onClick={() =>
                      removeMemberHandler({
                        groupID: member?.groupID,
                        userID: member?.userID,
                      })
                    }
                  >
                    <HiUserRemove />
                  </IconButton>
                ) : (
                  <Tooltip title="Only admin" placement="top">
                    <IconButton size="small">
                      <MdDoNotDisturb size="1.4rem" />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListGroupMembers;
