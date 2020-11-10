import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Container, GridList, GridListTile, GridListTileBar, Typography, Popover, IconButton }  from '@material-ui/core';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import InfoIcon from '@material-ui/icons/Info';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { useAuth0 } from '@auth0/auth0-react';

const useStyles = makeStyles((theme) => ({
    resultsDiv:{
        position: 'relative',
        borderRadius: '5px',
        background: '#768B91',
        boxShadow: 'inset -12px -12px 30px #A5C3CB, inset 12px 12px 30px #475357',
        textAlign: 'center',
        color: '#002B36',
        padding: '0.8rem 1.6rem',
        marginBottom: '2rem',
    },
    typography: {
        padding: theme.spacing(2),
        alignItems: 'center',
        color: '#002B36',
        backgroundColor: '#768B91',
    },
    div: {
        display: 'flex-inline',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        overflow: 'hidden',
    },
    gridList: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
    },
    titleBar: {
        background: '#52781e',
        color: '#fffff'
    },
    titleBarTop: {
        background: 'rgba(0, 43, 54, .001)',
        color: '#52781e',
    },
}));

const Results = (props) => {
    const classes = useStyles();
    const [clicks, setClicks] = useState([])
    const [popoverId, setPopoverId] = useState(null);
    const [results, setResults] = useState(null);
    const { data, query } = props.location.state;
    const { user } = useAuth0();
    const [anchorEl, setAnchorEl] = React.useState(null);

    useEffect(() => {
        (async function (){
            let url;
            if (query === 'all') {
                url = `https://cors-anywhere.herokuapp.com/http://openlibrary.org/search.json?q=${data}&limit=50`;
            }
            if (query === 'title') {
                url = `https://cors-anywhere.herokuapp.com/http://openlibrary.org/search.json?title=${data}&limit=50`;
            }
            if (query === 'author') {
                url = `https://cors-anywhere.herokuapp.com/http://openlibrary.org/search.json?author=${data}&limit=50`;
            }
            if (query === 'subject') {
                url = `https://cors-anywhere.herokuapp.com/http://openlibrary.org/search.json?subject=${data}&limit=50`;
            }
            if (query === 'ISBN') {
                url = `https://cors-anywhere.herokuapp.com/http://openlibrary.org/search.json?ISBN=${data}&limit=50`;
            }
            await axios.get(url)
                .then(res => {
                    const data = res.data.docs;
                    setResults(data);
                })
            })();
    }, [data, query]);    
    
    const handleClick = (event, popoverId) => {
        setPopoverId(popoverId);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setPopoverId(null);
        setAnchorEl(null);
    };
    const _handleAddLibrary = (id, title, author, imageURL) =>{
        //adds the ID of the clicked item to the array if it isn't there and removes from array if it is there
        let result =  clicks.includes(id) ? clicks.filter(click => click !== id): [...clicks, id]
        setClicks(result)
        console.log(title, imageURL, author)
        const data = {
            title: title,
            coverURL: imageURL,
            authorName: author
        };
        axios.post(`http://localhost:3000/results/add/${user.sub}`, data)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    if (results === null) {
        return 'Loading...';
    }

    return (
        <>
            <Container maxWidth="lg" style={{marginTop: '2rem'}}>
            <Typography variant="h2">Books</Typography>
            <br />
            <Typography variant="h6">Add books to your library by clicking the <BookmarkIcon fontSize="medium"/> </Typography>
            <br />
                <div className={classes.resultsDiv}>
                <br/>
                    <GridList className={classes.gridList} cols={2} cellHeight={300} spacing={16}>
                        {results.map((result) => {

                            return (
                            <GridListTile key={result.key}>
                                <div width={'auto'} className={classes.div}>
                                    <img src={`http://covers.openlibrary.org/b/id/${result.cover_i}-M.jpg`} alt={result.cover_i} />
                                </div>
                                <GridListTileBar
                                title={result.title}
                                subtitle={<span>by: {result.author_name}</span>}
                                classes={{
                                    root: classes.titleBar,
                                }}
                                actionIcon={
                                    <IconButton aria-label={`info about ${result.title}`} onClick={(e) => handleClick(e, result.key)} className={classes.icon}>
                                    
                                    <InfoIcon />
                                    </IconButton>}
                                    
                            />
                            <Popover
                            id={result.key}
                            open={popoverId === result.key}
                            anchorEl={anchorEl}
                            className={classes.root}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                        >
                            <Typography className={classes.typography}>
                                Title: {result.title}
                            </Typography>
                            <Typography className={classes.typography}>
                                Author: {result.author_name}
                            </Typography>
                            <Typography className={classes.typography}>
                                Genre: (update with API data)
                            </Typography>
                            <Typography className={classes.typography}>
                                Reader: (update with API data)
                            </Typography>
                        </Popover>
                            <GridListTileBar
                                classes={{
                                    root: classes.titleBarTop,
                                }}
                                titlePosition ={'top'}
                                actionIcon={
                                    <IconButton aria-label={`${result.key}`} onClick={() => _handleAddLibrary(result.key, result.title, result.author_name, result.cover_i)}>
                                    {/*makes sure that the correct icon is displayed for clicked or not clicked*/}
                                    {clicks.includes(result.key) ? <BookmarkIcon fontSize="large" className={classes.title} /> : <BookmarkBorderIcon fontSize="large" className={classes.title} />}
                                    </IconButton> }
                            />
                            </GridListTile>
                            )})}
                    </GridList> 
                </div>
            </Container>
        </>
    );
}

export default Results;