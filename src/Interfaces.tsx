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