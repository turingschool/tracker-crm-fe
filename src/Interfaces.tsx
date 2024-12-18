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

export interface CompanyAttributes {
  id: number;
  name: string;
  website: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  notes: string;
}

export interface Company {
  id: number;
  type: string;
  attributes: CompanyAttributes;
}