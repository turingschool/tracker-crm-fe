export interface UserData {
  id: number,
  username: string,
  email: string
}

export interface UserInformationProps {
  userData?: Partial<UserData>;
}