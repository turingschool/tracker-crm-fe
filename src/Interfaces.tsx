export interface UserData {
  token: string,
  user: {
    id: number,
    type: string,
    attributes: {
      name: string,
      email: string,
      companies: []
    }
  }
}

export interface UserInformationProps {
  userData?: Partial<UserData>;
}