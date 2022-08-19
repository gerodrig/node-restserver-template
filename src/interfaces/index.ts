export interface IUser {
    name: string;
    email: string;
    password: string;
    image: string;
    role: string;
    isActive: boolean;
    google: boolean;
}

export interface IRole {
    name: string;
}
