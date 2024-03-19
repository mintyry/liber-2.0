const gql = String.raw

const typeDefs = gql`

type User {
    _id: ID
    username: String
    email: String
    role: String
    keptBooks: [Book]
    createdAt: String
}

type Author {
    _id: ID
    name: String
}

type Comments {
    _id: ID
    userId: ID
    content: String
}

# image in type Book must be the same data type as in model; it is not a string. it is an object containing strings.
# had to make a new type for Image, because inline objects in GraphQL have to be named, and they cannot name them within a type's object.
type Image {
    data: String
    contentType: String
}

type Book {
    # unsure if id will need to be a different property
    _id: ID
    title: String
    bookId: String
    authors: [Author]
    image: Image
    text: String
    reviews: [Review]
}

# For books page
type PaginationInfo {
    totalPages: Int
    totalItems: Int
    currentPage: Int
    itemsPerPage: Int
}
type PaginatedBooks {
    books: [Book]
    paginationInfo: PaginationInfo
}

type Review {
    _id: ID
    rating: Int
    content: String
    userId: User
    createdAt: String
}

type Auth {
    token: ID!
    user: User
}

type BookAndCount {
    books: [Book]
    bookCount: Int
}

type Query {
    myLibrary: User
    searchAllBooks(searchTerm: String!): [Book]
    getBooks(skip: Int): BookAndCount
    getSingleBook(_id: ID!): Book
    MostEngagedBook: Book
    bookDetails(bookId: ID!): Book
    getAllUsers: [User]
    getAllBooks(page: Int, itemsPerPage: Int): PaginatedBooks
    HighestRatedBook: Book
}

input ImageInput {
    data: String
    contentType: String
}

input KeepBookInput {
    _id: ID
    title: String
    authors: [String]
    image: ImageInput
    text: String
    bookId: String
}

type Mutation {
    login(email: String!, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    keepBook(input: KeepBookInput!): User
    removeBook(bookId: ID): User
    addReview(bookId: ID!, content: String, rating: Int!): Book
    addComment( reviewId: ID!, content: String): Review
    removeUser(_id: ID): User
    updateUser(_id: ID): User
}

`;

module.exports = typeDefs;