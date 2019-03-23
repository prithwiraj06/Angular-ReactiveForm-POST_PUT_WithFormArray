import { ISkills } from "./skills.model";

export interface IEmployee {
    id: number;
    employeeName: string;
    email: string;
    phone?: number;
    contactPrefrence: string;
    skills: ISkills[];
}