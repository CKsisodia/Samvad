import { createAsyncThunk } from "@reduxjs/toolkit";
import { chatApiServices } from "../services/chatService";
import {
  addContact,
  EditGroup,
  groupUser,
  MemberData,
  sendMessageData,
} from "../../types/user";

export const findContactAction = createAsyncThunk(
  "findContactAction",
  async (contactData: addContact) => {
    const response = await chatApiServices.findContact(contactData);
    return response;
  }
);

export const addContactAction = createAsyncThunk(
  "addContactAction",
  async (contactUserId: number, thunkAPI) => {
    const response = await chatApiServices.addContact(contactUserId);
    if (response) {
      thunkAPI.dispatch(getAllContactsAction());
    }
    return response;
  }
);

export const getAllContactsAction = createAsyncThunk(
  "getAllContactsAction",
  async () => {
    const response = await chatApiServices.getAllContacts();
    return response;
  }
);

export const sendMessageAction = createAsyncThunk(
  "sendMessageAction",
  async (messageData: sendMessageData, thunkAPI) => {
    const response = await chatApiServices.sendMessage(messageData);
    if (response) {
      thunkAPI.dispatch(getAllMessageAction(messageData?.receiverID));
    }
    return response;
  }
);

export const getAllMessageAction = createAsyncThunk(
  "getAllMessageAction",
  async (receiverID: number) => {
    const response = await chatApiServices.getAllMessages(receiverID);
    return response;
  }
);

export const createGroupAction = createAsyncThunk(
  "createGroupAction",
  async (title: string, thunkAPI) => {
    const response = await chatApiServices.createGroup(title);
    if (response) {
      thunkAPI.dispatch(getGroupInfoAction());
    }
    return response;
  }
);

export const getGroupInfoAction = createAsyncThunk(
  "getGroupInfoAction",
  async () => {
    const response = await chatApiServices.getGroupInfo();
    return response;
  }
);

export const addGroupMemberAction = createAsyncThunk(
  "addGroupMemberAction",
  async (memberData: MemberData) => {
    const response = await chatApiServices.addGroupMember(memberData);
    return response;
  }
);

export const getSpecificGroupInfoAction = createAsyncThunk(
  "getSpecificGroupInfoAction",
  async (groupID: number) => {
    const response = await chatApiServices.getSpecificGroupInfo(groupID);
    return response;
  }
);

export const renameGroupAction = createAsyncThunk(
  "renameGroupAction",
  async (editGroup: EditGroup, thunkAPI) => {
    const response = await chatApiServices.renameGroup(editGroup);
    if (response) {
      thunkAPI.dispatch(getGroupInfoAction());
      thunkAPI.dispatch(getSpecificGroupInfoAction(editGroup.groupID));
    }
    return response;
  }
);

export const updateAdminStatusAction = createAsyncThunk(
  "updateAdminStatusAction",
  async (memberData: MemberData, thunkAPI) => {
    const response = await chatApiServices.changeAdminStatus(memberData);
    if (response) {
      thunkAPI.dispatch(getSpecificGroupInfoAction(memberData.groupID));
    }
    return response;
  }
);

export const deleteGroupMemberAction = createAsyncThunk(
  "deleteGroupMemberAction",
  async (groupUser: groupUser, thunkAPI) => {
    const response = await chatApiServices.deleteGroupMemeber(groupUser);
    if (response) {
      thunkAPI.dispatch(getSpecificGroupInfoAction(groupUser.groupID));
    }
    return response;
  }
);

export const deleteGroupAction = createAsyncThunk(
  "deleteGroupAction",
  async (groupID: string, thunkAPI) => {
    const response = await chatApiServices.deleteGroup(groupID);
    if (response) {
      thunkAPI.dispatch(getGroupInfoAction());
    }
    return response;
  }
);

export const sendGroupMessageAction = createAsyncThunk(
  "sendGroupMessageAction",
  async (
    { groupID, message }: { groupID: number; message: string },
    thunkAPI
  ) => {
    const response = await chatApiServices.sendGroupMessage({
      groupID,
      message,
    });
    if (response) {
      thunkAPI.dispatch(getGroupMessageAction(groupID));
    }
    return response;
  }
);

export const getGroupMessageAction = createAsyncThunk(
  "getGroupMessageAction",
  async (groupID: number) => {
    const response = await chatApiServices.getGroupMessages(groupID);
    return response;
  }
);
