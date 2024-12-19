export interface UserData {
  token: string,
  user: {
    data: {
      id: number | string | undefined,
      type: string,
      attributes: {
        name: string,
        email: string,
        companies: []
      }
    }
  }
}

export interface UserInformationProps {
  userData?: Partial<UserData>;
}