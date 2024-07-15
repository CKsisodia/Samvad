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
