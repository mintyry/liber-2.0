import { gql } from '@apollo/client';

// creates a user, returns token and relevant user info (eg: leave out keptBooks because when creating a new user, they will not have keptBooks, so we don't need to show field we know will be empty)
export const CREATE_USER = gql`
mutation CreateUser($username: String!, $email: String!, $password: String!) {
  createUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      username
      email
      role
      createdAt
    }
  }
}
`;


export const REMOVE_USER = gql`
mutation removeUser($id: ID) {
  removeUser(_id: $id) {
    _id
    username
    email
    role
  }
}
`;


// logs user in and returns _id, username, and email
export const LOGIN = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
      email
    }
  }
}
`;

// reviews and comment mutation
export const ADD_REVIEW = gql`
mutation addReview($bookId: ID!, $rating: Int!, $content: String) {
  addReview(bookId: $bookId, rating: $rating, content: $content) {
    _id
    title
    bookId
    text
    authors {
      _id
      name
    }
    image {
      data
      contentType
    }
    reviews {
      _id
      rating
      content
      createdAt
      userId {
        _id
        username
        email
        role
        keptBooks {
          _id
          title
          bookId
          text
        }
      }
    }
  }
}
`;

export const ADD_COMMENT = gql`
mutation addComment($reviewId: ID!, $content: String) {
  addComment(reviewId: $reviewId, content: $content) {
    _id
    comments {
      content
      userId
      _id
    }
  }
}
`;

export const KEEP_BOOK = gql`
mutation KeepBook($input: KeepBookInput!) {
  keepBook(input: $input) {
    _id
    keptBooks {
      authors {
        name
      }
      bookId
      image {
        data
      }
      title
      _id
    }
  }
}
`;


export const REMOVE_BOOK = gql`
mutation RemoveBook($bookId: ID) {
  removeBook(bookId: $bookId) {
    email
    username
    keptBooks {
      title
      
      bookId
      _id
    }
  }
}
`;

export const UPDATE_USER = gql`
mutation updateUser($id: ID) {
  updateUser(_id: $id) {
    _id
    username
    email
    role
  }
}
`
export const ADD_DONATION = gql`
mutation Mutation($price: Float!) {
  addDonation(price: $price) {
    _id
    name
    price
    donationDate
  }
}
`
