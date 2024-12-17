import { Book } from "./book"

export interface User {
    username?: string,
    email: string,
    role?: string,
    password?: string,
    reservedBooks?: [],
    reservedBooksData?: Book[],
    _id?: string
}
