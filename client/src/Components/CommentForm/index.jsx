import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_REVIEW } from '../../utils/mutations';
// import Auth from '../../utils/auth';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { Modal } from '@mui/material';
import useLoginClick from '../../utils/loginClick';
import { useEffect } from 'react';
import Login from '../Login/Login';



const CommentForm = ({ bookId }) => {
  const [commentText, setCommentText] = useState('');
  const [addReview, { error }] = useMutation(ADD_REVIEW);
  const [rating, setRating] = useState(0);
  const [ratingError, showRatingError] = useState(false);

  const {
    isLoginModalOpen,
    isMenuOpen,
    isLoggedIn,
    logout,
    handleMenuOpen,
    handleMenuClose,
    handleLoginClick,
    handleLoginModalClose
  } = useLoginClick();

  useEffect(() => {
    // console.log("isLoginModalOpen:", isLoginModalOpen);
  }, [isLoginModalOpen]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {

      if (rating === 0) {
        // Rating not provided, show error or prevent form submission
        showRatingError(true);
        return error;
      }

      const { data } = await addReview({
        variables: {
          bookId,
          content: commentText,
          rating: parseInt(rating),
        },
        refetchQueries: ['getSingleBook']
      });



      setCommentText('');
      setRating(0);
      showRatingError(false);
      // console.log(commentText);
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = (event) => {
    const { value } = event.target;
    setCommentText(value);
  };

  const handleRatingChange = (event, newRating) => {
    setRating(newRating);
  };

  // modify outline of textfield
  const customTheme = (outerTheme) =>
    createTheme({
      palette: {
        mode: outerTheme.palette.mode,
      },
      components: {
        MuiTextField: {
          styleOverrides: {
            root: {
              '--TextField-brandBorderColor': '#E0E3E7',
              '--TextField-brandBorderHoverColor': '#B2BAC2',
              '--TextField-brandBorderFocusedColor': '#6F7E8C',
              '& label.Mui-focused': {
                color: 'var(--TextField-brandBorderFocusedColor)',
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: 'var(--TextField-brandBorderColor)',
            },
            root: {
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderHoverColor)',
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderFocusedColor)',
              },
            },
          },
        },
        MuiFilledInput: {
          styleOverrides: {
            root: {
              '&::before, &::after': {
                borderBottom: '2px solid var(--TextField-brandBorderColor)',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
              },
              '&.Mui-focused:after': {
                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
              },
            },
          },
        },
        MuiInput: {
          styleOverrides: {
            root: {
              '&::before': {
                borderBottom: '2px solid var(--TextField-brandBorderColor)',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
              },
              '&.Mui-focused:after': {
                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
              },
            },
          },
        },
      },
    });

  const outerTheme = useTheme();

  return (
    <>
      <div style={{ paddingRight: '1rem' }}>
        <h2>Add Review</h2>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column' }}>

          {error && <p>Error: Please <a href="#" className="no-text-dec" style={{ border: 'none', backgroundColor: 'transparent' }} onClick={handleLoginClick}>log in</a> to add a comment.</p>}
          <ThemeProvider theme={customTheme(outerTheme)}>
            <TextField
              id="comments"
              name="content"
              value={commentText}
              onChange={handleComment}
              placeholder="Add a comment..."
              variant="outlined"
              multiline
              rows={3}
              required
              fullWidth
            />
          </ThemeProvider>
          <Button type="submit" variant="contained" color="primary" sx={{
            backgroundColor: '#eed6c5',
            color: '#000',
            '&:hover': {
              backgroundColor: '#c5af9f',
            },
            marginTop: '1rem',
            marginBottom: '1rem'
          }}>
            Post
          </Button>

          {ratingError && <p style={{ color: 'red' }}>Please rate the book.</p>}

          <Box marginBottom={2} sx={{ display: 'flex' }}>
            <label htmlFor="rating" style={{ marginRight: '3rem', }}>
              Rating:
            </label>
            <Rating
              id="rating"
              value={rating}
              onChange={handleRatingChange}
              max={5}
              precision={0.5}
              required
            />
          </Box>
        </form>

        <Modal open={isLoginModalOpen} onClose={handleLoginModalClose}>
          <div>
            <Login open={isLoginModalOpen} onClose={handleLoginModalClose} />
          </div>
        </Modal>
      </div>
    </>

  );
};

export default CommentForm;
