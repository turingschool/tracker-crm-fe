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
  userData: UserData;
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

export interface JobApplication {
  id: string;
  position_title: string;
  date_applied: string;
  status: number;
  notes: string;
  job_description: string;
  application_url: string;
  contact_information: string;
  company_id: number;
  company_name?: string;
  updated_at: string;
}

export interface DashBoardDattaI{
  job_applications: [ null |
    {
      id: number;
      position_title: string;
      date_applied: string;
      status: number;
      notes: string;
      job_description: string;
      application_url: string;
      created_at: string;
      updated_at: string;
      company_id: number;
      user_id: number;
    }
  ],
  contacts: [ null |
    {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      notes: string;
      created_at: string;
      updated_at: string;
      user_id: number;
      company_id: number;
    }
  ],
  companies: [ null |
    {
      id: number;
      user_id: number;
      name: string;
      website: string;
      street_address: string;
      city: string;
      state: string;
      zip_code: string;
      notes: string;
      created_at: string;
      updated_at: string ;
    }
  ]
}

  export interface ContactAttributes {
    company: { name: string };
    first_name: string;
    last_name: string;
  }

  export interface Contact {
    id: string;
    attributes: ContactAttributes;
  }

  export interface ContactData {
    id: string;
    type: string;
    attributes: {
      first_name: string;
      last_name: string;
      company_id: number;
      email: string;
      phone_number: string;
      notes: string;
      user_id: number;
      company: {
        id: number;
        name: string;
        website: string;
        street_address: string;
        city: string;
        state: string;
        zip_code: string;
        notes: string;
      };
    };
  }

  export interface FormInputData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    companyId?: number | null;
    notes: string;
  };

  export interface NewContact {
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    notes: string,
  }

  export interface DataCompile {
    token?: string;
    id?: number;
    name?: string;
    email?: string;
    [key: string]: any;  
  }

  export interface UserRegistrationData {
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  }

  export interface CountProps {
    section: string;
    sectionCount: number;
    sectionUrl: string;
    sectionDescription: string
}

  export interface DeleteItemProps {
    userId: number;
    itemId: string | number;
    itemType: string;
    deleteAction: (
      userId: number,
      itemType: string,
      itemId: string | number,
      token: string
    ) => Promise<boolean>;
    token: string;
    onDeleteSuccess: () => void;
}