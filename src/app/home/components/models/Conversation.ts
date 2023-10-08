import { User } from "src/app/auth/models/user.model";


export interface Conversation{
    forEach(arg0: (conversation: Conversation) => void): unknown;

    id?:number;
    users?:User[];
    lastUpdated?:Date;

}