// hooks etc from react
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_MY_LIBRARY, QUERY_ONE_BOOK } from '../utils/queries';
import { Link, useParams } from 'react-router-dom';
// mui
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { Modal } from '@mui/material';
import Login from '../Components/Login/Login';
// our files
import { KEEP_BOOK } from '../utils/mutations';
import CommentForm from '../Components/CommentForm';
import CommentList from '../Components/Commentslist'
import { useState, useEffect } from 'react';
import useLoginClick from '../utils/loginClick'


function SingleBook() {
    const { id } = useParams();

    const {
        isLoginModalOpen,
        isLoggedIn,
        handleLoginClick,
        handleLoginModalClose
    } = useLoginClick();


    const { loading, data } = useQuery(QUERY_ONE_BOOK, {
        variables: { id: id }
    });

    if (loading) {
        // console.log(loading)
    } else {
        // console.log(data.getSingleBook.image.data);
    }

    const thisBook = data?.getSingleBook;


    const [keepBookMutation] = useMutation(KEEP_BOOK);

    const [bookAdded, setBookAdded] = useState(false)

    let [avgRating, setAvgRating] = useState(0);

    function isBookAlreadyAdded(data, bookId) {
        // Assuming userData contains the user's library information
        const userLibrary = data?.myLibrary?.keptBooks || [];

        // Check if the bookId is present in the user's library
        return userLibrary.some((book) => book.bookId === bookId);
    }

    useEffect(() => {
        // Check if the book is already added to the user's library
        const alreadyAdded = isBookAlreadyAdded(data, id);
        setBookAdded(alreadyAdded);

        // calculates average rating
        const ratingCount = data?.getSingleBook.reviews.length;
        let totalRating = 0;
        data?.getSingleBook.reviews.map((book) => {
            // console.log(book.rating);
            totalRating += book.rating
        })

        avgRating = +(totalRating / ratingCount).toFixed(2);
        setAvgRating(avgRating);

        // console.log(avgRating);

    }, [data, id]);

    const handleKeepBook = async () => {
        try {
            await keepBookMutation({
                variables: { input: { bookId: id, title: thisBook.title, image: { data: thisBook.image.data } } },
                refetchQueries: [{ query: QUERY_MY_LIBRARY }], // Refetch QUERY_MY_LIBRARY after mutation
            });

            // Set bookAdded to true when the book is successfully added
            setBookAdded(true);

        } catch (error) {
            console.error('Error adding book to MyLibrary', error);
        }
    };



    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress color="success" />
            </div>
        )
    }

    const book = data?.getSingleBook || [];



    return (
        <>
            {/* title header of single book's page */}
            <Grid item className="slide-from-left header-banner " mb={3} p={3} sx={{ width: '100%', color: '#666256' }}>
                <p className="single-book-title"style={{ fontSize: '2rem' }}>{book.title}</p>
                {/* authors, if more than one, had comma in between names. otherwise, no comma*/}
                {book.authors.length > 1 ? (
                    <p className="saved-head-text" style={{ marginLeft: '5px', marginTop: '0', marginRight: '0', marginBottom: '0' }}> by {
                        book.authors.map(author => {
                            const nameParts = author.name.split(' ');
                            return `${nameParts[nameParts.length - 1]} ${nameParts.slice(0, nameParts.length - 1).join(' ')}`;
                        }).join(', ')
                    }
                    </p>

                ) : (
                    <p className="saved-head-text" style={{ marginLeft: '5px', marginTop: '0', marginRight: '0', marginBottom: '0' }}> by {
                        book.authors.map(author => {
                            const nameParts = author.name.split(', ');
                            return `${nameParts[nameParts.length - 1]} ${nameParts.slice(0, nameParts.length - 1).join(' ')}`;
                        })
                    }
                    </p>

                )}
            </Grid>

            {/* container holding all content*/}
            <Grid className="bottom-home-div" container py={3} spacing={3} sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', border: '10px double #666256', margin: '0', backgroundColor: '#ececdc' }}>
                {/* Grid holds book and comment form */}
                <div className="div-img-cmnt-form" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', border: '10px double #666256', width: '90%', paddingTop: '2rem', paddingBottom: '2rem', backgroundColor: '#ededde' }}>
                    {/* Grid holds book image and buttons */}
                    <Grid item sx={{ display: 'flex', flexDirection: 'column', flex: '1', justifyContent: 'center', alignItems: 'center', margin: '0' }}>
                        {/* image */}
                        <img src={`data:image/jpg;base64,${book.image.data}`} alt={book.title} style={{ maxWidth: '50%', height: 'auto' }} /><br />
                        {/* rating */}
                        <Rating name="read-only" value={avgRating} precision={0.5} readOnly />
                        {/* buttons */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            {bookAdded ? (
                                <Button sx={{ backgroundColor: 'grey' }} disabled={true} variant="contained" onClick={handleKeepBook}>
                                    Book Saved
                                </Button>
                            ) : (
                                (isLoggedIn ? (
                                    <Button sx={{
                                        backgroundColor: '#eed6c5',
                                        color: '#000',
                                        '&:hover': {
                                            backgroundColor: '#c5af9f',
                                        },
                                    }} variant="contained" onClick={handleKeepBook}>
                                        Keep Book
                                    </Button>
                                ) : (
                                    <Button sx={{
                                        backgroundColor: '#eed6c5',
                                        color: '#000',
                                        '&:hover': {
                                            backgroundColor: '#c5af9f',
                                        },
                                    }} variant="contained" onClick={handleLoginClick}>
                                        Keep Book
                                    </Button>
                                ))
                            )}
                            <Link to={`/bookReader/${id}`}>
                                <Button sx={{
                                    backgroundColor: '#eed6c5',
                                    color: '#000',
                                    '&:hover': {
                                        backgroundColor: '#c5af9f',
                                    },
                                }} variant="contained">Read Now</Button>
                            </Link>
                        </div>
                    </Grid>
                    <Grid sx={{ display: 'flex', flexDirection: 'column', flex: '1', marginLeft: '1rem' }}>
                        <CommentForm bookId={book._id} />
                    </Grid>

                </div>

                {/* container for comment list */}
                <Grid item sx={{ width: '100%', paddingLeft: '5rem !important', paddingRight: '5rem !important' }} >
                    <CommentList reviews={book.reviews} />
                </Grid>

            </Grid>

            <Modal open={isLoginModalOpen} onClose={handleLoginModalClose}>
                <div>
                    <Login open={isLoginModalOpen} onClose={handleLoginModalClose} />
                </div>
            </Modal>
        </>
    );
}

export default SingleBook;