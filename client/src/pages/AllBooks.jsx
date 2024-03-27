import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_BOOKS_WITH_PAGINATION } from '../utils/queries'
import { Link } from 'react-router-dom';
import { Box, Pagination } from '@mui/material';
import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: { main: red[200] },
    },
});


const AllBooks = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const { loading, error, data } = useQuery(GET_ALL_BOOKS_WITH_PAGINATION, {
        variables: { page: currentPage, itemsPerPage: itemsPerPage },
    });


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress color="success" />
            </div>
        )
    };

    if (error) return <p>Error : Please try again</p>;

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div style={{}}>
            <Grid item className="slide-from-left" mb={3} p={3} sx={{ width: '100%', fontSize: '1.8rem', color: '#666256', }}>
                <em>Viewing all books:</em>
            </Grid>
            <div className="bottom-home-div" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem', }}>
                <ThemeProvider theme={theme}>
                    <Pagination
                        count={data.getAllBooks.paginationInfo.totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        color="primary"
                        sx={{ button: { color: '#666256' } }}
                    />
                </ThemeProvider>
            </div>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', alignItems: 'center', border: 'double 10px #eed6c5', padding: '2rem' }}>
                {data && data.getAllBooks.books.map((book, index) => (
                    <Box
                        className="ind-book"
                        key={book._id}
                        sx={{

                            flex: '1 0 100%',
                            maxWidth: '200px',
                            position: 'relative',
                            overflow: 'hidden',
                            animationDelay: `${index * 0.1}s`,

                        }}
                    >
                        <Link to={`/singleBook/${book._id}`} style={{ textDecoration: 'none', display: 'block', position: 'relative' }}>
                            <img

                                src={`data:image/jpg;base64,${book.image.data}`}
                                alt={book.title}
                                style={{ width: '100%', height: '20rem', borderRadius: '8px', }}
                            />
                            <div
                                className="titleOverlay"
                                style={{
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    background: 'rgba(0, 0, 0, 0.7)',
                                    boxSizing: 'border-box',
                                    color: '#fff',
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: '12px',
                                        margin: '0',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {book.title}
                                </h3>
                            </div>
                        </Link>
                    </Box>
                ))}
            </Box>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                <ThemeProvider theme={theme}>
                    <Pagination
                        count={data.getAllBooks.paginationInfo.totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        color="primary"
                        sx={{ button: { color: '#666256' } }}
                    />
                </ThemeProvider>
            </div>
        </div>
    );
};

export default AllBooks;
