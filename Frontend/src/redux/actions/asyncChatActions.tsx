import { createAsyncThunk } from "@reduxjs/toolkit";
import { chatApiServices } from "../services/chatService";
import { addContact, sendMessageData } from "../../types/user";

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
