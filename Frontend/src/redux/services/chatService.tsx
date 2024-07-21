import { toast } from "react-toastify";
import ApiHelper from "../../utils/apiHelper";
import {
  addContact,
  EditGroup,
  groupUser,
  MemberData,
  sendMessageData,
} from "../../types/user";

class ChatApiServices {
  static getInstance() {
    return new ChatApiServices();
  }

  findContact = async (contactData: addContact) => {
    try {
      const response = await ApiHelper.post("/user/find-contact", contactData);
      return response?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  addContact = async (contactUserId: number) => {
    try {
      const response = await ApiHelper.post(
        `/user/add-contact/${contactUserId}`
      );
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  getAllContacts = async () => {
    try {
      const response = await ApiHelper.get("/user/all-contacts");
      return response?.data;
    } catch (error) {
      throw error;
    }
  };

  sendMessage = async (messageData: sendMessageData) => {
    try {
      const response = await ApiHelper.post(
        `/chats/send-message/${messageData?.receiverID}`,
        { message: messageData?.message }
      );
      return response?.data;
    } catch (error) {
      throw error;
    }
  };

  getAllMessages = async (receiverID: number) => {
    try {
      const response = await ApiHelper.get(`/chats/all-messages/${receiverID}`);
      return response?.data;
    } catch (error) {
      throw error;
    }
  };

  createGroup = async (title: string) => {
    try {
      const response = await ApiHelper.post("/group/create-group", { title });
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  getGroupInfo = async () => {
    try {
      const response = await ApiHelper.get("/group/group-info");
      return response?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  addGroupMember = async (memberData: MemberData) => {
    try {
      const body = {
        userID: memberData.userID,
        isAdmin: memberData.isAdmin,
      };
      const response = await ApiHelper.post(
        `/group/add-group-member/${memberData.groupID}`,
        body
      );
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  getSpecificGroupInfo = async (groupID: number) => {
    try {
      const response = await ApiHelper.get(`/group/group-info/${groupID}`);
      return response?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  renameGroup = async (editGroup: EditGroup) => {
    try {
      const newTitle = editGroup.newTitle;
      const response = await ApiHelper.put(
        `/group/rename-group/${editGroup.groupID}`,
        { newTitle }
      );
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  changeAdminStatus = async (memberData: MemberData) => {
    try {
      const user = {
        userID: memberData.userID,
        isAdmin: memberData.isAdmin,
      };
      const response = await ApiHelper.put(
        `/group/admin-status/${memberData.groupID}`,
        user
      );
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  deleteGroupMemeber = async (groupUser: groupUser) => {
    try {
      const userID = groupUser.userID;

      const response = await ApiHelper.delete(
        `/group/remove-member/${groupUser.groupID}`,
        { userID }
      );
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  deleteGroup = async (groupID: string) => {
    try {
      const response = await ApiHelper.delete(`/group/delete-group/${groupID}`);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  sendGroupMessage = async ({
    groupID,
    message,
  }: {
    groupID: number;
    message: string;
  }) => {
    try {
      const response = await ApiHelper.post(
        `/group/send-group-message/${groupID}`,
        { message: message }
      );
      return response?.data;
    } catch (error) {
      throw error;
    }
  };

  getGroupMessages = async (groupID: number) => {
    try {
      const response = await ApiHelper.get(
        `/group/all-group-messages/${groupID}`
      );
      return response?.data;
    } catch (error) {
      throw error;
    }
  };
}

export const chatApiServices = ChatApiServices.getInstance();
