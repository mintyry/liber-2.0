// purely to add color to text in our code for readability
import { gql } from '@apollo/client';

// queries all books
// may need to refactor the reviews part, because we may be unnecessarily querying ids or user info
export const QUERY_ALL_BOOKS = gql`
query getBooks($skip: Int) {
  getBooks(skip: $skip) {
    books {
      _id
      title
      bookId
      authors {
        name
      }
      image {
        data
      }
      reviews {
        rating
      }
    }
    bookCount
  }
}
`;

// queries a single book
export const QUERY_ONE_BOOK = gql`
query Query($id: ID!) {
  getSingleBook(_id: $id) {
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
      }
    }
  }
}
`;

export const QUERY_SEARCH_ALL_BOOKS = gql`
query searchAllBooks($searchTerm: String!) {
  searchAllBooks(searchTerm: $searchTerm) {
    _id
    title
    bookId
    authors {
      name
    }
    image {
      data
    }
    reviews {
      rating
    }
  }
}
`;

export const QUERY_MY_LIBRARY = gql`
query MyLibrary {
  myLibrary {
    createdAt
    username
    role
    email
    keptBooks {
      title
      image {
        data
      }
      bookId
      _id
    }
    orders {
      _id
      donation {
        _id
        name
        price
      }
      orderDate
    }
  }
}
`;

export const QUERY_MOST_ENGAGED_BOOK = gql`
query MostEngagedBook {
  MostEngagedBook {
    _id
    authors {
      name
    }
    bookId
    image {
      data
    }
    reviews {
      rating
    }
    title
  }
}
`
// admin
export const QUERY_ALL_USERS = gql`
query Query {
  getAllUsers {
    _id
    username
    email
    role
  }
}
`
export const GET_ALL_BOOKS_WITH_PAGINATION = gql`
query GetAllBooks($page: Int, $itemsPerPage: Int) {
  getAllBooks(page: $page, itemsPerPage: $itemsPerPage) {
    books {
      _id
      title
      bookId
      image {
        data
        contentType
      }
      title
    }
    paginationInfo {
      totalPages
      totalItems
      currentPage
      itemsPerPage
    }
  }
}
`;


export const GET_ONE_USER = gql`
query getOneUser($id: ID) {
  getOneUser(_id: $id) {
    role
  }
}
`

export const QUERY_HIGHEST_RATED_BOOK = gql`
query HighestRatedBook {
  HighestRatedBook {
    _id
    title
    bookId
    authors {
      name
    }
    image {
      data
    }
    text
    reviews {
      rating
    }
  }
}
`




