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
    name: string;
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
  size: string;
  type: string;
  url: string;
};

export type ChatResponse = {
  status: boolean;
  message: string;
  data: ChatMessage[];
};

export type GroupInfoResponse = {
  status: boolean;
  message: string;
  data: {
    userID: number;
    groupID: number;
    createdAt: string;
    "group.title": string;
    "group.totalMembers": number;
  }[];
};

export type GroupMessagesResponse = {
  status: boolean;
  message: string;
  data: {
    id: number;
    senderID: number;
    groupID: number;
    message: string;
    senderName: string;
    nameColor: string;
    createdAt: string;
    updatedAt: string;
  }[];
};

export type MemberData = {
  groupID: number;
  userID: number;
  isAdmin: boolean;
};

export type SpecificGroupInfoResponse = {
  status: boolean;
  message: string;
  data: {
    memberDetails: {
      id: number;
      isAdmin: boolean;
      userID: number;
      groupID: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      user: {
        id: number;
        name: string;
        email: string;
        mobile: string;
      };
    }[];
    groupDetails: {
      title: string;
      totalMembers: number;
      createdAt: string;
      createdBy: string;
    };
  };
};

export type EditGroup = {
  groupID: number;
  newTitle: string;
};

export type groupUser = {
  groupID: number;
  userID: number;
};
