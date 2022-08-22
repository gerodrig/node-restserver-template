export interface IUser {
    uid: string;
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

export interface ICategory {
    name: string;
    description?: string;
    image?: string;
    state: boolean;
    user: IUser;
}

export interface IProduct {
    name: string;
    state: boolean;
    user: IUser;
    price?: number;
    category: ICategory;
    description?: string;
    available?: boolean;
}