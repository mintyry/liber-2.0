import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { QUERY_HIGHEST_RATED_BOOK, QUERY_MY_LIBRARY } from '../../utils/queries';
import '../MostEngagedBook/SpotlightBook.css';
import { Link } from 'react-router-dom';
import { KEEP_BOOK } from '../../utils/mutations';
import { Modal } from '@mui/material';
import Login from '../Login/Login';
import useLoginClick from '../../utils/loginClick'

const HighestRated = () => {
    const { loading, error, data } = useQuery(QUERY_HIGHEST_RATED_BOOK);
    const [bookAdded, setBookAdded] = useState(false);
    const [addedBooks, setAddedBooks] = useState(new Set()); // Keep track of added book IDs


    const {
        isLoginModalOpen,
        isLoggedIn,
        handleLoginClick,
        handleLoginModalClose
    } = useLoginClick();


    const [keepBookMutation] = useMutation(KEEP_BOOK, {
        refetchQueries: [{ query: QUERY_MY_LIBRARY }]
    });
    const HighestRatedBook = data?.HighestRatedBook;

    useEffect(() => {
        // Reset bookAdded state when a new highest rated book is loaded
        setBookAdded(false);
    }, [HighestRatedBook]);

    const handleKeepBook = async () => {
        try {
            // Check if the book has already been added
            if (!addedBooks.has(HighestRatedBook?._id)) {
                await keepBookMutation({
                    variables: {
                        input: {
                            bookId: HighestRatedBook?._id,
                            title: HighestRatedBook?.title,
                            image: { data: HighestRatedBook.image.data },
                        },
                    },
                });

                // Update the set of added books
                setAddedBooks(new Set(addedBooks).add(HighestRatedBook?._id));

                // Set bookAdded to true when the book is successfully added
                setBookAdded(true);
            } else {
                // Book already added, handle accordingly (show message, disable button, etc.)
                console.log('Book already added to MyLibrary');
            }
        } catch (error) {
            console.error('Error adding book to MyLibrary', error);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress color="success" />
            </div>
        );
    }

    if (error) {
        console.error(error);
        return <p>Error fetching the highest rated book</p>;
    }

    return (
        <>
            <Grid
                container
                className="from-left-white spotlight-header"
                style={{
                    display: 'flex',
                    textAlign: 'left',
                    width: '100%',
                    paddingLeft: '2rem',
                    marginBottom: '1rem',
                }}
            >
                <p style={{ fontSize: '2rem', color: '#505050' }}>Spotlight Read</p>
            </Grid>

            {HighestRatedBook ? (
                <>
                    <Grid
                        container
                        spacing={1}
                        className="bottom-home-div"
                        sx={{
                            marginBottom: '3rem',
                            boxSizing: 'border-box',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#8abbb1',
                            padding: '3rem',
                            flexDirection: 'row',
                        }}
                    >
                        {/* Left */}
                        <Grid item xs={12} md={6} sx={{ padding: '2rem !important', backgroundColor: '#8ebfb5', borderRadius: '10px' }}>
                            <p className="spotlight-book-text" style={{ fontSize: '2rem', color: '#f3f3ec' }}>
                                Currently, the highest rated book is <em>{HighestRatedBook.title}</em>. People are buzzing about it. Whether they like or they hate it, they are discussing this classic. Take part in the conversation or take a chance and read this book! Enjoy it with our bookworm community or save it to your MyLibrary for later. Feel free to comment and leave ratings on your favorite book. It may have a chance to be spotlighted here on <span style={{ fontFamily: 'Coventry Garden', whiteSpace: 'nowrap' }}>{'{'} L i b e r {'}'}</span>.
                            </p>
                        </Grid>
                        {/* Right */}
                        <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
                            <div style={{ display: 'block' }}>
                                <div>
                                    <img src={`data:image/jpg;base64,${HighestRatedBook.image.data}`} alt="highest rated book" style={{ outline: '6px double #f3f3ec', padding: '2rem', marginBottom: '1rem' }} />
                                </div>
                                <p style={{ fontSize: '1.3rem', color: '#f3f3ec' }}>{HighestRatedBook.title}</p>
                                <p style={{ marginBottom: '1rem', color: '#f3f3ec' }}>Author: {HighestRatedBook.authors.map((author) => author.name).join(', ')}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                    {bookAdded ? (
                                        <Button sx={{ backgroundColor: 'grey' }} disabled={true} variant="contained" onClick={handleKeepBook}>
                                            Book Saved
                                        </Button>
                                    ) : (
                                        (isLoggedIn ? (
                                            <Button sx={{
                                                backgroundColor: '#8abbb1',
                                                color: '#f3f3ec',
                                                '&:hover': {
                                                    backgroundColor: '#6a8e86',
                                                },
                                            }} variant="contained" onClick={handleKeepBook}>
                                                Keep Book
                                            </Button>
                                        ) : (
                                            <Button sx={{
                                                backgroundColor: '#8abbb1',
                                                color: '#f3f3ec',
                                                '&:hover': {
                                                    backgroundColor: '#6a8e86',
                                                },
                                            }} variant="contained" onClick={handleLoginClick}>
                                                Keep Book
                                            </Button>
                                        ))
                                    )}

                                    <Link to={`/bookReader/${HighestRatedBook._id}`}>
                                        <Button
                                            sx={{
                                                backgroundColor: '#8abbb1',
                                                color: '#f3f3ec',
                                                '&:hover': {
                                                    backgroundColor: '#6a8e86',
                                                },
                                            }}
                                            variant="contained"
                                        >
                                            Read Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <Grid container className="bottom-home-div" style={{ display: 'flex', textAlign: 'left', width: '100%', paddingLeft: '2rem', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '2rem', color: '#505050' }}>No books have been rated yet!</p>
                </Grid>
            )}

            <Modal open={isLoginModalOpen} onClose={handleLoginModalClose}>
                <div>
                    <Login open={isLoginModalOpen} onClose={handleLoginModalClose} />
                </div>
            </Modal>
        </>
    );
};

export default HighestRated;
