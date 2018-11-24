import { Entry } from "./entry";

export interface LoginUser {
  id: number;
  token: string;
  name: string;
  entries?: Entry[];
}
