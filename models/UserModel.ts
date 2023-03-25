export enum UserRole{
    ADMIN,
    USER
}


export interface UserModel{
    id?: number;
    firstname: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
}