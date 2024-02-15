// import useHooks
import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
// import mui
import { Typography, Button, IconButton, Menu, MenuItem, Modal, TextField, Hidden, InputAdornment, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import Login from '../Login/Login';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
// for outline of textfield
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
// to link to other pages
import { Link } from 'react-router-dom';
// our files
import './navbar.css';
import '../../styles/main.css';
import Auth from '../../utils/auth'
import { QUERY_SEARCH_ALL_BOOKS } from '../../utils/queries';
import SearchIcon from '@mui/icons-material/Search';

// Liber brand
const TitleTypography = styled(Typography)({
    fontSize: '2.5rem',
    cursor: 'pointer',
});

// buttons pre-nav burger menu
const StyledTypography = styled(Typography)({
    display: 'flex',
    marginLeft: '2rem',
});

const NavBar = () => {
    // functionality for nav menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);

    const isLoggedIn = Auth.loggedIn();

    const logout = (event) => {
        event.preventDefault();
        Auth.logout();
    }

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    };

    const handleLoginClick = () => {
        setLoginModalOpen(true);
        handleMenuClose();
    };

    const handleLoginModalClose = () => {
        setLoginModalOpen(false);
    };


    // logic for search feature
    // useQuery happens immediately, and you cannot store values in array like this, so use Lazy
    const [searchAllBooks, { loading, data, refetch }] = useLazyQuery(QUERY_SEARCH_ALL_BOOKS);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();


    const handleSearch = async (event) => {
        event.preventDefault();

        localStorage.setItem('searchTerm', searchTerm)

        if (location.pathname !== '/searchresults') {
            navigate('/searchresults');
        } else {
            window.location.reload();
        }
    };

    let role = '';
    const token = Auth.getToken();
    if (token) {
        const authUser = Auth.getProfile();
        role = authUser.data.role;
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
            <Grid container py={3} id="nav-parent" style={{ backgroundColor: "transparent", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                <Grid id="child-1" item sx={{ display: "flex", marginLeft: '2rem' }}>
                    <Hidden mdUp>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={isMenuOpen ? handleMenuClose : handleMenuOpen}
                            sx={{ position: 'relative' }}
                        >
                            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </IconButton>
                    </Hidden>
                    <Link style={{ textDecoration: 'none', color: 'black' }} to="/">
                        <TitleTypography id="liber" sx={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                            {'{'}&nbsp;&nbsp;L i b e r&nbsp;&nbsp;{'}'}
                        </TitleTypography>
                    </Link>
                    <StyledTypography variant="h6">
                        <Hidden mdDown>
                            {isLoggedIn ?
                                <Link style={{ textDecoration: 'none', color: 'black' }} to="/myLibrary">
                                    <Button className="navlinks" color="inherit" sx={{ height: '100%' }}>

                                        MyLibrary

                                    </Button>
                                </Link>

                                :
                                <Link style={{ textDecoration: 'none', color: 'black' }} to="/">
                                    <Button className="navlinks" color="inherit" onClick={handleLoginClick} sx={{ height: '100%' }}>

                                        MyLibrary
                                    </Button>
                                </Link>
                            }



                            <Link style={{ textDecoration: 'none', color: 'black' }} to="/allbooks">
                                <Button className="navlinks" color="inherit" sx={{ height: '100%' }}>

                                    Books

                                </Button>
                            </Link>

                            <Link style={{ textDecoration: 'none', color: 'black' }} to="/surprise">
                                <Button className="navlinks" color="inherit" sx={{ height: '100%' }}>

                                    Meet

                                </Button>
                            </Link>

                            {/* Conditionally render login/logout buttons */}
                            {isLoggedIn ? (
                                <>
                                    <Button className="navlinks" color="inherit" onClick={logout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button className="navlinks" color="inherit" onClick={handleLoginClick}>
                                        Login
                                    </Button>
                                </>
                            )}
                            {isLoggedIn && role === 'admin' && (
                                <Link style={{ textDecoration: 'none', color: 'black' }} to="/admin">
                                    <Button className="navlinks" color="inherit" sx={{ height: '100%' }}>

                                        Admin

                                    </Button>
                                </Link>
                            )}
                        </Hidden>
                    </StyledTypography>
                </Grid>
                <Grid item id="searchbar" sx={{ display: "flex", alignItems: "center", marginRight: "2rem", justifyContent: "right", }}>
                    <ThemeProvider theme={customTheme(outerTheme)}>
                        <TextField
                            className="input-override"
                            variant="outlined"
                            size="small"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.target.value)
                            }}
                            onKeyUp={(event) => {
                                if (event.key === 'Enter') {
                                    handleSearch(event); // Call handleSearch when Enter key is pressed
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                },
                                // this is placeholder text and user input text
                                '& .MuiInputBase-input': {
                                    color: 'black',
                                    fontFamily: 'Lato'
                                },
                                // outlined input outline
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'black',
                                },
                                color: 'black !important', // Set text color to black
                                fontFamily: 'Lato !important', // Set font family

                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton edge="end" color="inherit" onClick={handleSearch}>
                                            <SearchIcon sx={{ color: 'white', backgroundColor: '#8abbb1', borderRadius: '5px', padding: '4px' }} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </ThemeProvider>

                    <Hidden lgUp>
                        <Menu
                            id="responsive-menu"
                            anchorEl={anchorEl}
                            anchorReference="anchorPosition"
                            anchorPosition={{ top: 65, right: 16 }}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            disablePortal // Add this prop
                            sx={{
                                '& .MuiMenu-paper': {
                                    marginTop: '11%',
                                    width: '100vw',
                                    height: '100vh',
                                    transformOrigin: 'top center',
                                    transform: 'translateX(0%) translateY(0%)',
                                    backgroundColor: '#f3f3ec',
                                    boxShadow: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                                '& .MuiMenuItem-root': {
                                    fontSize: '2rem',
                                    padding: '1rem',
                                    transition: 'color 0.3s ease',
                                    '&:hover': {
                                        color: '#8abbb1',
                                    },
                                },
                                '@media (min-width: 540px)': {
                                    '& .MuiMenu-paper': {
                                        marginTop: '3%', // for tablets
                                    },

                                },
                            }}
                        >
                            <MenuItem onClick={handleMenuClose}>
                                {isLoggedIn ?
                                    <Link to="/mylibrary" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        MyLibrary &gt;
                                    </Link> : <Link to="/" onClick={handleLoginClick} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        MyLibrary &gt;
                                    </Link>}
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose}>
                                <Link to="/allbooks" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    Books &gt;
                                </Link>
                            </MenuItem>

                            <MenuItem onClick={handleMenuClose}>
                                <Link to="/surprise" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    Meet &gt;
                                </Link>
                            </MenuItem>

                            {isLoggedIn && role === 'admin' ?
                                (
                                    <MenuItem onClick={handleMenuClose}>
                                        <Link style={{ textDecoration: 'none', color: 'inherit' }} to="/admin">
                                            Admin &gt;
                                        </Link>
                                    </MenuItem>
                                ) :
                                (

                                    <MenuItem sx={{ display: 'none' }} onClick={handleMenuClose}>
                                        <Link style={{ textDecoration: 'none', color: 'inherit' }} to="/admin">
                                            Admin &gt;
                                        </Link>
                                    </MenuItem>
                                )
                            }

                            <MenuItem onClick={handleMenuClose}>
                                {isLoggedIn ? (
                                    <>
                                        <a className="navlinks" color="inherit" onClick={logout}>
                                            Logout &gt;
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <a className="navlinks" color="inherit" onClick={handleLoginClick}>
                                            Login &gt;
                                        </a>
                                    </>
                                )}
                            </MenuItem>
                        </Menu>
                    </Hidden>
                </Grid>
                <Modal open={isLoginModalOpen} onClose={handleLoginModalClose}>
                    <div>
                        <Login open={isLoginModalOpen} onClose={handleLoginModalClose} />
                    </div>
                </Modal>
            </Grid >
        </>
    );
};

export default NavBar;
