// importing react/apollo
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
// import our files
import { QUERY_SEARCH_ALL_BOOKS } from '../utils/queries';
import '../styles/searchedresults.css';
// import mui
import { Grid } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';




function SearchResults() {

    const searchTerm = localStorage.getItem('searchTerm');

    if (searchTerm === '') {
        console.log('Oh no, honey, that book doesn\'t exist.');
        return null;
    }

    // pass searchTerm into query
    const { loading, data, error } = useQuery(QUERY_SEARCH_ALL_BOOKS, { variables: { searchTerm } });


    if (error) {
        console.error('Error fetching data:', error);
        return <p>Error fetching data. Please try again later.</p>;
    }


    if (loading) {
        console.log(loading)
    } else {
        console.log(data.searchAllBooks)
    }

    const searchedBooks = data?.searchAllBooks;



    return (
        <>
            <Grid item className="slide-from-left" mb={3} p={3} sx={{ width: '100%', fontSize: '1.5rem', color: '#000' }}>
                <em>Lost, but found:</em>
            </Grid>
            {
                loading
                    ?
                    (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress color="success" />
                        </div>
                    )
                    :
                    error
                        ?
                        (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <p> "To err is human, to forgive divine." - <em>An Essay on Criticism</em> - Alexander Pope</p><br />
                                <p>(Sorry, there's been an error retrieving your data.)</p>
                            </div>
                        )
                        :
                        (
                            <Grid container sx={{ marginBottom: '2rem' }}>
                                {/* child two */}
                                <Grid container mx={2} spacing={2} sx={{ display: 'flex' }}>
                                    {/* each book will be in its own div */}
                                    {searchedBooks.map((book, index) => (
                                        <Grid item className="searched-book" key={book._id} xs={2.3} sx={{ animationDelay: `${index * 0.3}s` }}>
                                            <Link to={`/singleBook/${book._id}`}>
                                                <img style={{ width: '100%', height: '25vw' }} src={`data:image/jpg;base64,${book.image.data}`} />
                                            </Link>
                                            <p className="home-book-titles" style={{ fontSize: '0.8rem', textWrap: 'wrap' }}>
                                                {book.title}
                                            </p>

                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        )
            }
        </>
    )
}

export default SearchResults;