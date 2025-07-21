export interface UserDetails {
  id?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  status: boolean;
  locked: boolean;
  role: string;
}

export interface Role {
  id?: string;
  name: string;
  description: Description;
  status: boolean;
  level: string;
}
export interface Menu {
  id?: string;
  name: string;
  url: string;
  category: string;
  order: number;
  icon: string;
}

export interface Description {
  name: string;
  description: string;
}
