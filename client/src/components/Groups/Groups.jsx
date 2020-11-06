import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Button, InputBase }  from '@material-ui/core';
import GroupsList from './GroupsList';

const useStyles = makeStyles((theme) => ({
    inputRoot: {
        color: 'primary',
    },
    inputInput: {
        padding: theme.spacing(1),
        transition: theme.transitions.create('width'),
        width: '100%',
        marginLeft: 0,
        [theme.breakpoints.up('md')]: {
            width: '100ch',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.15),
        },
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
            marginLeft: 0,
        },
    },
    margin: {
        margin: theme.spacing(2),
    },
}));

const Groups = () => {
    const [userGroups, setUserGroups] = useState({});
    const [allGroups, setAllGroups] = useState({});
    const [name, setGroupName] = useState('');
    const [description, setGroupDescription] = useState('');
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const _handleNameChange = (data) => {
        console.log(data)
        setGroupName(data);
    };

    const _handleDescChange = (data) => {
        console.log(data)
        setGroupDescription(data);
    };

    const _handleCreateGroup = (e) => {
        e.preventDefault();
        const data = {
            groupName: name,
            groupDescription: description
        };
        axios.post('http://localhost:3000/groups/add', data)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    return (
        <>
            <Container maxWidth="lg" style={{marginTop: '2rem'}}>
                <Typography variant="h2">Groups</Typography>
                <Typography variant="h6">Get connected, create new groups here!</Typography>
                <br />
                <Button type="button" color="secondary" variant="contained" size="large">Add Group</Button>
                <br />
                <br />
                <Typography>
                    <form onSubmit={_handleCreateGroup}>
                        <label>Group Name
                            <div className={classes.search}>
                                <InputBase style={{color: '#93A1A1'}}
                                    placeholder="Type here..."
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    name='groupName' 
                                    onChange={(event) => _handleNameChange(event.target.value)} 
                                />
                            </div>
                        </label>
                        <br />
                        <label>Group Description
                        <div className={classes.search}>
                                <InputBase
                                    style={{color: '#93A1A1'}}
                                    placeholder="Type here..."
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    name='groupDescription'
                                    onChange={(event) => _handleDescChange(event.target.value)} 
                                />
                        </div>
                        </label>
                        <br/>
                        <Button type="submit" color="secondary" variant="contained" size="large">Create New Group</Button>
                        <Button type="button" className={classes.margin} color="secondary" variant="outlined" size="large">Cancel</Button>
                    </form>
                </Typography>
                <br />
                <br />
                {/* <GroupsList list={"User"} /> */}
                <GroupsList list={"All"} />
            </Container>
        </>
    )
}

export default Groups;
