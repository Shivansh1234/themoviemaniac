export interface User {
    _id: string,
    fname: string,
    lname: string,
    email: string,
    isAdmin: boolean,
    createdAt: Date,

    // optional
    token?: string | undefined
}
