export type UserId = string | null;
export type Category = string | null;
export type Name = string | null;
export type Options = object | null;
export type Callback = Function | null;
export type Event = string | null;
export type GroupId = string | null;
export type PreviousId = string | null;

export enum EventType {
    Track = 'track',
    Identify = 'identify',
    Page = 'page',
    Group = 'group',
    Alias = 'alias',
}

export interface Traits {
    address?: {
        city?: string;
        country?: string;
        postalCode?: number;
        state?: string;
        street?: string;
    };
    age?: number;
    avatar?: string;
    birthday?: Date;
    company?: {
        name?: string;
        id: string | number;
        industry?: string;
        employee_count?: number;
        plan?: string;
    };
    createdAt?: Date;
    description?: string;
    email?: string;
    firstName?: string;
    gender?: string;
    id?: string;
    lastName?: string;
    name?: string;
    phone?: string;
    title?: string;
    username?: string;
    website?: string;
}

export interface Properties {
    name?: string;
    path?: string;
    referrer?: string;
    search?: string;
    title?: string;
    url?: string;
    keywords?: string[];
    [property: string]: any;
}
