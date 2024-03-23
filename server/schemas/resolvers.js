const { User, Book, Review, Donation, Order } = require('../models');
const { AuthenticationError, signToken } = require('../utils/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const resolvers = {

    Query: {
        // profile page
        myLibrary: async (parent, args, context) => {
            if (context.user) {
                // get data about user except password
                const userData = await User.findOne({ _id: context.user._id }).select('-__v -password').populate({
                    path: 'orders.donation',
                });

                userData.orders.sort((a, b) => b.orderDate - a.orderDate);

                return userData;
            }
            throw AuthenticationError('User is not authneticated');
        },

        bookDetails: async (_, { bookId }) => {
            return await Book.findOne({ bookId });
        },

        searchAllBooks: async (parents, { searchTerm }) => {
            // Split the search term into individual words
            const searchWords = searchTerm.trim().split(/\s+/);

            // Make an array of custom regex patterns for each search word
            const regexPatterns = searchWords.map(word => new RegExp(word, 'i'));

            // Perform the search for each word in both title and author fields
            const searchData = await Book.find({
                // or operator for title or author search
                $or: [
                    // or expects an array, since we are mapping arrays inside here, we use spread oeprator to empty elements out
                    // map through each element (the regex pattern that we applied to each word searched), and we apply that individual searched word and its regex option to be searched in the title and author fields
                    // Search for each word in the title field
                    ...regexPatterns.map(pattern => ({ title: { $regex: pattern } })),
                    // Search for each word in the author field
                    ...regexPatterns.map(pattern => ({ 'authors.name': { $regex: pattern } }))
                ]
            }).select('-text');

            return searchData;
        },

        getBooks: async (parents, args) => {
            const bookData = await Book.find().populate({ path: "reviews" }).skip(args.skip).limit(5).select('-text');
            const bookCount = await Book.count();

            return { books: bookData, bookCount: bookCount };
        },
        getSingleBook: async (parent, { _id }) => {
            return Book.findOne({ _id }).populate({ path: "reviews", populate: { path: "userId" } })
        },

        //   this is for the books page/link in nav
        getAllBooks: async (_, { page = 1, itemsPerPage = 12 }) => {
            const totalCount = await Book.countDocuments();
            const totalPages = Math.ceil(totalCount / itemsPerPage);
            const books = await Book.find().select('-text')
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage);

            return {
                books,
                paginationInfo: {
                    totalPages,
                    totalItems: totalCount,
                    currentPage: page,
                    itemsPerPage
                }
            };
        },

        MostEngagedBook: async () => {
            try {
                const result = await Book.aggregate([
                    { $unwind: '$reviews' }, // Deconstruct the reviews array
                    {
                        $group: {
                            _id: '$_id',
                            title: { $first: '$title' },
                            bookId: { $first: '$bookId' },
                            authors: { $first: '$authors' },
                            image: { $first: '$image' },
                            reviews: { $push: '$reviews' },
                            numReviews: { $sum: 1 } // Count the number of reviews for each book
                        }
                    },
                    { $sort: { numReviews: -1 } }, // Sort by the number of reviews in descending order
                    { $limit: 1 }
                ]);

                // console.log('This is the result thus far:', JSON.stringify(result, null, 2));
                // result.forEach(book => {
                //     console.log(`Book: ${book.title}`);
                //     console.log(`  Number of Reviews: ${book.numReviews}`);
                // });

                if (result.length > 0) {
                    return result[0];
                } else {
                    return null;
                }
            } catch (error) {
                console.error('Failed to calculate number of reviews:', error);
                throw new Error('Failed to fetch the book with the most reviews.');
            }

        },

        getAllUsers: async (parent, args, context) => {
            // gotta make sure user exists for role to try to be read; otherwise it will crash
            if (context.user && context.user.role === 'admin') {
                return await User.find();
            }

            throw AuthenticationError;
        },

        HighestRatedBook: async () => {
            try {
                const result = await Book.aggregate([
                    { $unwind: '$reviews' }, // Deconstruct the reviews array
                    // basically like .populate(); look up a field from another collection and add it into current collection/documents
                    {
                        $lookup: {
                            from: 'reviews', // Name of the 'reviews' collection
                            localField: 'reviews', //reviews field
                            foreignField: '_id', //id from reviews collection
                            as: 'reviews'
                        }
                    },
                    { $unwind: '$reviews' }, //unravel the reviews from an object
                    {
                        // group reviews back into book data.
                        $group: {
                            _id: '$_id',
                            title: { $first: '$title' },
                            bookId: { $first: '$bookId' },
                            authors: { $first: '$authors' },
                            image: { $first: '$image' },
                            reviews: { $push: '$reviews' },
                            avgRating: { $avg: '$reviews.rating' },
                            numReviews: { $sum: 1 } // Count the number of reviews for each book
                        }
                    },
                    // organize; SORTS BY AVG FIRST THEN NUM OF REVIEWS
                    { $sort: { avgRating: -1, numReviews: -1 } },
                    // query one
                    { $limit: 1 }
                ]);

                // THIS CONSOLE LOGS EACH RESULT, IE: EACH BOOK WITH THEIR AVG RATINGS
                // console.log('This is the result thus far:', JSON.stringify(result, null, 2));
                // result.forEach(book => {
                //     console.log(`Book: ${book.title}`);
                //     console.log(`  Average Rating: ${book.avgRating}`);
                // });

                // LOGS EACH BOOK AND EACH RATING IN EACH BOOK
                // result.forEach(book => {
                //     console.log(`Book: ${book.title}`);
                //     book.reviews.forEach(review => {
                //       console.log(`  Review: Rating - ${review.rating},`);
                //     });
                //   });

                // IF MORE THAN ONE, RETURN FIRST ONE
                if (result.length > 0) {
                    return result[0];
                } else {
                    return null;
                }

            } catch (error) {
                console.error('Failed to calculate average rating:', error);
                throw new Error('Failed to fetch the highest-rated book.');
            }
        },

        donation: async (parent, { _id }) => {
            return await Donation.findById(_id);
        },

        order: async (parent, { _id }, context) => {
            if (context.user) {
                // get data about user except password
                const userData = await User.findOne({ _id: context.user._id }).select('-__v -password').populate({
                    path: 'orders.donation',
                });

                return userData.orders.id(_id);
            }
            throw AuthenticationError;
        },

        checkout: async (parent, args, context) => {

            const url = new URL(context.headers.referer).origin;

            // create new Order w/ donation ID (associates donation with order)
            const order = await Order.create({ donation: args.donation });
            // line_item object represents donation being made; it's a donation with a specific amount in USD.
            const line_item = {
                price_data: {
                    currency: 'usd',
                    name: 'Donation',
                    unit_amount: args.donation * 100
                }
            };

            // make new checkout session; this defines details of the payment like payment method types accepted, the line item, etc.
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_item,
                mode: 'payment',
                success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${url}/`,
            });

            return { session: session.id };
        }

    },

    Mutation: {
        createUser: async (parent, { email, password, username }) => {
            try {
                const user = await User.create({ email, password, username });
                const token = signToken(user);

                return { user, token };

            } catch (error) {
                if (error.code === 11000) {
                    // Duplicate key error
                    throw new Error('Email or username already exists', 'DUPLICATE_USER');
                } else {
                    // Other errors
                    console.log(error);
                    throw new ApolloError('Error creating user', 'UNKNOWN_ERROR');
                }
            }
        },

        removeUser: async (parent, { _id }, context) => {
            if (context.user && context.user.role === 'admin') {
                try {
                    const user = await User.deleteOne({ _id });
                    console.log(user);
                } catch (error) {
                    console.log(error);
                    throw new Error(error);
                }
            }
        },


        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw AuthenticationError;
            }
            // this is comming from the user model itself
            const correctPw = await user.isCorrectPassword(password);

            // check if it is the correct hashed password
            if (!correctPw) {
                throw AuthenticationError;
            }

            const token = signToken(user);
            return { token, user };
        },

        keepBook: async (parent, { input }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { keptBooks: input } },
                    { new: true, runValidators: true }
                );

                return updatedUser;
            }

            throw AuthenticationError;
        },



        addReview: async (parent, { bookId, content, rating }, context) => {
            if (context.user) {
                const review = await Review.create({
                    userId: context.user._id,
                    bookId: bookId,
                    rating: rating,
                    content: content
                })
                const book = await Book.findByIdAndUpdate(bookId, {
                    $push: {
                        reviews: review._id
                    }
                }, { new: true })
                return await book.populate({ path: "reviews", populate: { path: "userId" } })
            }
            throw AuthenticationError
        },

        removeBook: async (parent, { bookId }, context) => {
            try {
                if (context.user) {
                    return await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { keptBooks: { bookId } } },
                        { new: true }
                    );
                } else {
                    throw new AuthenticationError('User not authenticated');
                }
            } catch (error) {
                console.error("Error removing book:", error);
                throw error; // rethrow the error for further handling
            }
        },

        addComment: async (parent, args, context) => {
            if (context.user) {
                const review = await Review.findByIdAndUpdate(args.reviewId, {
                    $push: {
                        comments: {
                            userId: context.user._id,
                            content: args.content
                        }
                    }
                }, { new: true })

                return review;
            } throw AuthenticationError
        },
        updateUser: async (parent, args, context) => {
            if (context.user && context.user.role === 'admin') {
                try {
                    const user = await User.findById(args._id);

                    if (!user) {
                        throw new Error('User not found');
                    }

                    // Toggle between 'admin' and 'user' roles
                    const newRole = user.role === 'user' ? 'admin' : 'user';

                    const updatedUser = await User.findByIdAndUpdate(args._id, {
                        role: newRole,
                    }, { new: true });

                    return updatedUser;
                } catch (error) {
                    // Handle errors (e.g., user not found, validation error)
                    console.error(error);
                    throw new Error('Failed to update user.');
                }
            } else {
                throw new Error('Unauthorized. Admin privileges required.');
            }
        },

        addOrder: async(parent, { donation }, context) => {
            if (context.user) {
                const order = new Order({ donation });

                await User.findByIdAndUpdate(context.user._id, {
                    $push: { orders: order }
                });

                return order;
            }

            throw AuthenticationError;
        }


    },

}

module.exports = resolvers;
