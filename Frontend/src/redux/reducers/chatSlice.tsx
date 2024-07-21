import { createSlice } from "@reduxjs/toolkit";
import {
  ChatResponse,
  ContactsResponse,
  findContactResponse,
  GroupInfoResponse,
  GroupMessagesResponse,
  SpecificGroupInfoResponse,
} from "../../types/user";
import {
  findContactAction,
  getAllContactsAction,
  getAllMessageAction,
  getGroupInfoAction,
  getGroupMessageAction,
  getSpecificGroupInfoAction,
} from "../actions/asyncChatActions";
import { RootState } from "../store";

interface chatDataState {
  contacts: ContactsResponse | null;
  getSpecificContact: findContactResponse | null;
  contactId: number;
  groupID: number;
  allChatsData: ChatResponse | null;
  groupInfo: GroupInfoResponse | null;
  specificGroupInfo: SpecificGroupInfoResponse | null;
  conversation: string;
  groupChats: GroupMessagesResponse | null;
}

const initialState: chatDataState = {
  contacts: null,
  getSpecificContact: null,
  contactId: 0,
  groupID: 0,
  allChatsData: null,
  groupInfo: null,
  specificGroupInfo: null,
  conversation: localStorage.getItem("ContactORGroup") || "contact",
  groupChats: null,
};

const chatSlice = createSlice({
  name: "chats",
  initialState: initialState,
  reducers: {
    resetSpecificContact(state) {
      state.getSpecificContact = null;
    },
    contactUserid(state, action) {
      state.contactId = action.payload;
      localStorage.setItem("selectedContact", JSON.stringify(action.payload));
    },
    selectGroupForID(state, action) {
      if (action.payload === "removeGroup") {
        state.groupID = 0;
      } else {
        state.groupID = action.payload;
        localStorage.setItem("selectedGroupID", JSON.stringify(action.payload));
      }
    },
    selectContactOrGroup(state, action) {
      state.conversation = action.payload;
      localStorage.setItem("ContactORGroup", action.payload);
    },
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
    builder.addCase(getGroupInfoAction.fulfilled, (state, action) => {
      const response = action.payload;
      state.groupInfo = response;
    });
    builder.addCase(getSpecificGroupInfoAction.fulfilled, (state, action) => {
      const response = action.payload;
      state.specificGroupInfo = response;
    });
    builder.addCase(getGroupMessageAction.fulfilled, (state, action) => {
      const response = action.payload;
      state.groupChats = response;
    });
  },
});

export const {
  resetSpecificContact,
  contactUserid,
  selectContactOrGroup,
  selectGroupForID,
} = chatSlice.actions;

export const selectContactsdata = (state: RootState) => state.chats.contacts;
export const selectSpecificContact = (state: RootState) =>
  state.chats.getSpecificContact;
export const selectedContactId = (state: RootState) => state.chats.contactId;
export const selectedGroupID = (state: RootState) => state.chats.groupID;
export const selectAllChatData = (state: RootState) => state.chats.allChatsData;
export const selectGroupInfo = (state: RootState) => state.chats.groupInfo;
export const selectSpecificGroupInfo = (state: RootState) =>
  state.chats.specificGroupInfo;
export const selectConversation = (state: RootState) =>
  state.chats.conversation;
export const selectGroupChatData = (state: RootState) => state.chats.groupChats;

export default chatSlice.reducer;
