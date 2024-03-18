// Home.js
import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
// must npm i for react slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// images for slick carousel
import image1 from '../assets/firstcarousel.avif';
import image2 from '../assets/secondcarousel.jpg';
import image3 from '../assets/thirdcarousel.webp'
import '../styles/home.css';
// useState, Effect
import { useState, useEffect } from 'react';
// import mui
import { Grid, Pagination } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Rating from '@mui/material/Rating';
// hooks from apollo
import { useQuery } from '@apollo/client';
// import any queries and mutations
import { QUERY_ALL_BOOKS } from '../utils/queries';
import MostEngagedBook from '../Components/MostEngagedBook/SpotlightBook';
import HighestRated from '../Components/HighestRated/HighestRated'



function Home() {
    // console.log('hi there');
    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 7000,
    };

    // using our query to get data from db
    const { loading, data, refetch } = useQuery(QUERY_ALL_BOOKS);
    // console.log(data);

    //   puts data into variable (it's an array), can access its properties from there
    const books = data?.getBooks.books || [];
    // console.log(books)

    //   dynamic number of pages of books we have
    const bookCount = data?.getBooks.bookCount || 0;
    const totalPages = Math.ceil(bookCount / 5);

    // useState for page number
    const [currentPage, setCurrentPage] = useState(1);

    let [avgRating, setAvgRating] = useState([]);

    const changePage = (event, page) => {
        setCurrentPage(page)
    }

    // TO SEE BOOK DATA LOGGED, UNCOMMENT BELOW
    // if (loading) {
    //     console.log('Loading...');
    // } else {
    //     // Once data is available, accesses and logs single book and corresponding properties on the book object
    //     console.log(data);
    //     //change number in index for a different single book
    //     const oneBook = data?.getBooks[588];
    //     console.log('One Book:', oneBook.image.data);
    // }

    // logic to sift through pages of books
    useEffect(() => {
        const skip = (currentPage - 1) * 5;
        // console.log(skip)
        refetch({ skip });


        if (!loading && books.length > 0) {
            const avgRating = books.map(book => {
                let totalRating = 0;
                const ratingCount = book.reviews.length;
                book.reviews.forEach(review => {
                    totalRating += review.rating;
                });
                // toFixed returns string; + changes it back to number
                return +(totalRating / ratingCount).toFixed(2);
            });
            setAvgRating(avgRating);
        }


    }, [currentPage, loading, refetch, books]);


    return (
        <>
            {/* Slick carousel */}
            <div className="top-home-div" style={{ marginBottom: '2rem' }}>
                <Slider {...settings}>
                    <div className="carousel-slide">
                        <div className="overlay">
                            <img src={image2} alt="book magic" />
                            <div className="text-overlay">
                                <p className="text-title">Plethora of free books</p>
                                {/* whiteSpace property prevent text of Liber from wrapping on small screens */}
                                <p>Welcome to <span style={{ fontFamily: 'Coventry Garden', whiteSpace: 'nowrap' }}>{'{'} L i b e r {'}'}</span>.<br /> Our extended collection of over 1,000 free, classic novels and reads<br /> are digitized and waiting to be discovered.</p>
                            </div>
                        </div>
                    </div>
                    <div className="carousel-slide">
                        <div className="overlay">
                            <img src={image1} alt="book love" />
                            <div className="text-overlay">
                                <p className="text-title">Interact with your e-reads</p>
                                <p>Join our fellow readers!<br /> Rate and discuss your favorite books! <br /> Try not to be toxic with your writing though. You're a reader for a reason. </p>
                            </div>
                        </div>
                    </div>
                    <div className="carousel-slide">
                        <div className="overlay">
                            <img src={image3} alt="bookshelf" />
                            <div className="text-overlay">
                                <p className="text-title">MyLibrary</p>
                                <p>Keep books in the MyLibrary section.<br />Once a book is kept, you can easily come back and read it whenever you like.<br />To gain access to the feature, sign up or log in now! </p>
                            </div>
                        </div>
                    </div>
                </Slider>
            </div>

            {/* all books div*/}
            <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                {loading ?
                    (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress color="success" />
                        </div>
                    ) :
                    (
                        <>

                            <Grid container className="bottom-home-div">
                                {/* // parent div holding books */}
                                <Grid className="books-container" container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', justifyContent: 'center', padding: '5vw', border: 'double 10px #cae4df', marginLeft: '5rem', marginRight: '5rem', marginBottom: '2rem' }}>

                                    {/* each book will be in its own div */}
                                    {books.map((book, index) => (
                                        <Grid className="ind-book" item key={book._id} xs={2.3} sx={{ animationDelay: `${index * 0.3}s` }}>
                                            {/* image */}
                                            <div style={{ width: '100%' }}>
                                                <Link to={`/singleBook/${book._id}`}>
                                                    <img style={{ width: '100%', height: '20vw' }} src={`data:image/jpg;base64,${book.image.data}`} />
                                                </Link>
                                            </div>
                                            <div className="fullrating" style={{ display: 'flex', width: '100%', margin: '0' }} >
                                                {avgRating[index] !== undefined ? (
                                                    <Rating name="read-only" value={avgRating[index]} precision={0.5} readOnly className="fullrating" />
                                                ) : null}
                                            </div>
                                            {/* title */}
                                            <div style={{ width: '100%' }}>
                                                <p className="home-book-titles" style={{ fontSize: '0.8rem', textWrap: 'wrap' }}>
                                                    {book.title}
                                                </p>
                                            </div>


                                        </Grid>
                                    ))}
                                </Grid>
                                <Grid item sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>

                                    <Pagination
                                        sx={{ button: { color: '#8abbb1' } }}
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={changePage}
                                        variant="outlined"
                                        color="success" />

                                </Grid>
                            </Grid>

                            <MostEngagedBook />
                            
                            <HighestRated />
                        </>
                    )
                }
            </Grid>
        </>
    );
}

export default Home;
