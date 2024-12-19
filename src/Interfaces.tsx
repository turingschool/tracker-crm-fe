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