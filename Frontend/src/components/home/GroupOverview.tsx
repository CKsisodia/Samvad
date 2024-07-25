import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  selectGroupForID,
  selectGroupInfo,
  selectSpecificGroupInfo,
} from "../../redux/reducers/chatSlice";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import {
  deleteGroupAction,
  getSpecificGroupInfoAction,
} from "../../redux/actions/asyncChatActions";
import { formatDate } from "../../utils/helperFunctions";
import { FaEdit } from "react-icons/fa";
import EditGroup from "./EditGroup";
import { MdDelete } from "react-icons/md";
import { selectUserData } from "../../redux/reducers/authSlice";

const GroupOverview = () => {
  const dispatch = useAppDispatch();
  const group = useAppSelector(selectSpecificGroupInfo);
  const user = useAppSelector(selectUserData);

  const [openGroup, setOpenGroup] = useState<Boolean>(false);

  const groupID = JSON.parse(localStorage.getItem("selectedGroupID") || "null");

  const userId = user?.data?.id;
  const memberDetails = group?.data?.memberDetails;
  const userMember = memberDetails?.find(
    (member) => member.userID === Number(userId)
  );
  const isUserAdmin = Boolean(userMember?.isAdmin);

  useEffect(() => {
    if (groupID) {
      dispatch(getSpecificGroupInfoAction(groupID));
    }
  }, []);

  const deleteHandler = async () => {
    const response = await dispatch(deleteGroupAction(groupID));
    const status = response?.type?.split("/")[1];
    if (status === "fulfilled") {
      localStorage.removeItem("selectedGroupID");
      dispatch(selectGroupForID("removeGroup"));
    }
  };

  return (
    <Box>
      <Typography
        textAlign="center"
        variant="h2"
        fontFamily="cursive"
        mt="50px"
      >
        {group?.data?.groupDetails?.title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          mt: 5,
          gap: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Created by :
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            Created at :
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            Total Members :
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6">
            {group?.data?.groupDetails?.createdBy}
          </Typography>
          <Typography variant="h6">
            {group ? formatDate(group?.data?.groupDetails?.createdAt) : ""}
          </Typography>
          <Typography variant="h6">
            {group?.data?.groupDetails?.totalMembers}
          </Typography>
        </Box>
      </Box>
      {isUserAdmin ? (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 4 }}>
          <IconButton
            color="success"
            size="large"
            onClick={() => setOpenGroup(true)}
          >
            <FaEdit size="2.4rem" />
          </IconButton>
          <IconButton color="error" size="large" onClick={deleteHandler}>
            <MdDelete size="2.4rem" />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 4 }}>
          <Tooltip title="Only admin can edit" placement="top">
            <IconButton size="large">
              <FaEdit size="2.4rem" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Only admin can delete" placement="top">
            <IconButton size="large">
              <MdDelete size="2.4rem" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <EditGroup
        openGroup={openGroup}
        handleCloseGroup={() => setOpenGroup(false)}
        groupID={groupID}
      />
    </Box>
  );
};

export default GroupOverview;
