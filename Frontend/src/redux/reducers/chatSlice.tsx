import { createSlice } from "@reduxjs/toolkit";
import { ChatResponse, ContactsResponse, findContactResponse } from "../../types/user";
import {
  findContactAction,
  getAllContactsAction,
  getAllMessageAction,
} from "../actions/asyncChatActions";
import { RootState } from "../store";

interface chatDataState {
  contacts: ContactsResponse | null;
  getSpecificContact: findContactResponse | null;
  contactId : number;
  allChatsData : ChatResponse | null;
}

const initialState: chatDataState = {
  contacts: null,
  getSpecificContact: null,
  contactId: 0,
  allChatsData: null
};

const chatSlice = createSlice({
  name: "chats",
  initialState: initialState,
  reducers: {
    resetSpecificContact(state) {
      state.getSpecificContact = null;
    },
    contactUserid(state, action) {
       state.contactId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(findContactAction.fulfilled, (state, action) => {
      const response = action.payload;
      state.getSpecificContact = response;
    });
    builder.addCase(getAllContactsAction.fulfilled, (state, action) => {
      const response = action.payload;
      state.contacts = response;
    });
    builder.addCase(getAllMessageAction.fulfilled, (state, action) => {
      const response = action.payload;
      state.allChatsData = response;
    });
  },
});

export const { resetSpecificContact , contactUserid} = chatSlice.actions;

export const selectContactsdata = (state: RootState) => state.chats.contacts;
export const selectSpecificContact = (state: RootState) =>
  state.chats.getSpecificContact;
export const selectedContactId = (state: RootState) => state.chats.contactId;
export const selectAllChatData = (state: RootState) => state.chats.allChatsData;


export default chatSlice.reducer;
