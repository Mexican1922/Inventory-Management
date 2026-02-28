export interface UserProfile {
    id: string;
    email: string;
    role: string;
    displayName?: string;
    lastLogin?: any;
}
export declare const useUsers: () => {
    users: UserProfile[];
    loading: boolean;
};
