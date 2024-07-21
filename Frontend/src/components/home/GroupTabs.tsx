import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Tab } from "@mui/material";
import React, { useState } from "react";
import AddGroupMember from "./AddGroupMember";
import ListGroupMembers from "./ListGroupMembers";
import GroupOverview from "./GroupOverview";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import GroupMessages from "./GroupMessages";

const GroupTabs = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            // textColor="secondary"
            // indicatorColor="secondary"
            sx={{ backgroundColor: "#d2e5f7" }}
          >
            <Tab
              icon={<PersonPinIcon />}
              iconPosition="start"
              label="Overview"
              value="1"
            />
            <Tab
              icon={<PersonPinIcon />}
              iconPosition="start"
              label="Members"
              value="2"
            />
            <Tab
              icon={<PersonPinIcon />}
              iconPosition="start"
              label="Add New Member"
              value="3"
            />
            <Tab
              icon={<PersonPinIcon />}
              iconPosition="start"
              label="Chat"
              value="4"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <GroupOverview />
        </TabPanel>
        <TabPanel value="2">
          <ListGroupMembers />
        </TabPanel>
        <TabPanel value="3">
          <AddGroupMember />
        </TabPanel>
        <TabPanel value="4" sx={{ padding: 0 }}><GroupMessages /></TabPanel>
      </TabContext>
    </Box>
  );
};

export default GroupTabs;
