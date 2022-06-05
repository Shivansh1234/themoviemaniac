import { User } from "./user"

export interface DialogData {
    metaData: {
        name: string,
        action: string
    },
    data: User
}
