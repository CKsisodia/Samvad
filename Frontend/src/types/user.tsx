export type userSignup = {
  name: string;
  email: string;
  mobile: string;
  password: string;
};

export type userLogin = {
  email: string;
  password: string;
};

export type getInfoApiResponse = {
  status: boolean;
  message: string;
  data: {
    id: string;
    email: string;
  };
};

export type addContact = {
  email: string;
  mobile: string;
};

export type findContactResponse = {
  status: boolean;
  message: string;
  data: {
    contactUserId: number;
    name: string;
    email: string;
    mobile: string;
  };
};

export type ContactsResponse = {
  status: boolean;
  message: string;
  data: {
    id: number;
    userID: number;
    contactUserID: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    contactUser: {
      id: number;
      name: string;
      email: string;
      mobile: string;
    };
  }[];
};

export type sendMessageData = {
  message: string;
  receiverID: number;
};

export type contactUserData = {
  id: number;
  name: string;
  email: string;
  mobile: string;
};

export type ChatMessage = {
  id: number;
  senderID: number;
  receiverID: number;
  message: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ChatResponse = {
  status: boolean;
  message: string;
  data: ChatMessage[];
};
