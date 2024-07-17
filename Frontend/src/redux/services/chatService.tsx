import { toast } from "react-toastify";
import ApiHelper from "../../utils/apiHelper";
import { addContact, sendMessageData } from "../../types/user";

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
      console.log(response);
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
      console.log(messageData);
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
}

export const chatApiServices = ChatApiServices.getInstance();
