export interface UserData {
  token: string,
  user: {
    data: {
      id: number,
      type: string,
      attributes: {
        name: string,
        email: string,
        companies: []
      }
    }
  }
}

export interface LoginFormProps {
  setLogin: (login: boolean) => void;
  setData: (data: UserData) => void;
  setId: (id: number) => void;
}
export interface UserInformationProps {
  userData?: Partial<UserData>;
}