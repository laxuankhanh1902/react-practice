export interface Person {
    id: number;
    name: string;
    dob: string;
    email: string;
    verified: boolean;
    salary: number;
}

export type ColumnKey = keyof Person;
