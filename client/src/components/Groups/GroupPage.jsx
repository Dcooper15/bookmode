import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, GridList, GridListTile, Button, TextField}  from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';

const useStyles = makeStyles((theme) => ({
    inputRoot: {
        color: 'primary',
    },
    groupBar: {
        background: '#52781e',
        margin: theme.spacing(2),
        padding: theme.spacing(2),
    },
    groupsDiv:{
        position: 'relative',
        borderRadius: '5px',
        background: '#768B91',
        boxShadow: 'inset -12px -12px 30px #A5C3CB, inset 12px 12px 30px #475357',
        textAlign: 'center',
        color: '#002B36',
        padding: '0.8rem 1.6rem',
        marginBottom: '2rem',
    },
    gridList: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
    },
    margin: {
        margin: theme.spacing(2),
    },
}));

const GroupPage = () => {
    const classes = useStyles();
    const [group, setGroup] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const groupId = useParams();
    const { user } = useAuth0();

    useEffect(() => {
        axios.get(`http://localhost:3000/groups/group/${groupId.id}`)
            .then(res => {
                const data = res.data;
                setGroup(data);
            })
            .catch(err => console.log(err));
        axios.get(`http://localhost:3000/groups/comments/${groupId.id}`)
            .then(res => {
                const data = res.data;
                console.log("comment response data", data);
                setComments(data);
            })
            .catch(err => console.log(err));
    }, [groupId.id]);

    const _handleJoinGroup = (e) => {
        e.preventDefault();
        const data = {
            groupId: group.id
        };
        axios.post(`http://localhost:3000/groups/join/${user.sub}`, data)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    const _handleLeaveGroup = (e) => {
        e.preventDefault();
        const data = {
            groupId: group.id
        };
        axios.post(`http://localhost:3000/groups/leave/${user.sub}`, data)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    const _handleComment = (data) => {
        setNewComment(data);
    }

    const _handleAddComment = (e) => {
        e.preventDefault();
        const data = {
            content: newComment,
            userId: user.sub
        }
        console.log("add comment data", data);
        axios.post(`http://localhost:3000/groups/comments/${groupId.id}`, data)
            .then(res => {
                console.log("comment response", res)
                const data = res.data;
                const newCommentData = {
                    content: newComment,
                    userId: user.sub,
                    createdAt: 'Just Now'
                };
                setComments([...comments, newCommentData]);
            })
            .catch(err => console.log(err));
        setNewComment('');
    }

    // return while waiting on axios, then render updated page
    if (group === null) {
        return (
            <>
                <Typography variant="h6">Loading</Typography>
            </>
        )
    }

    return (
        <Container maxWidth="lg" style={{marginTop: '2rem'}}>
            <Typography variant="h2">{group.groupName}</Typography>
            <br/>
            <Typography variant="h6">{group.groupDescription}</Typography>
            <br/>
            <form onSubmit={_handleJoinGroup}>
                <input value={group.id} name="groupId" hidden></input>
                <Button type="submit" color="secondary" variant="contained" size="large">Join This Group</Button>
            </form>
            <form onSubmit={_handleLeaveGroup}>
                <input value={group.id} name="groupId" hidden></input>
                <Button type="submit" color="secondary" variant="contained" size="large">Leave This Group</Button>
            </form>
            <br />
            <Typography variant="h6">Members</Typography>
            <div className={classes.groupsDiv}>
                <GridList className={classes.gridList} cols={2} cellHeight={'auto'}>
                    {(group.Users.length !== 0) ? (group.Users.map(user => (
                        <GridListTile className={classes.groupBar} cellHeight={'auto'} key={user.id}>
                        <Typography variant="h6" style={{color: '#fff'}}>{user.name}</Typography>
                        {!!user.user_group.isAdmin ?
                        <Typography style={{color: '#fff'}}>(admin)</Typography>
                        : <Typography style={{color: '#fff'}}>(member)</Typography> }
                    </GridListTile>
                    ))) : (
                        <Typography>You're not part of any groups!</Typography>
                    )};
                </GridList> 
            </div>
            <div>
                <h4>Add new comments</h4>
            </div>
            <form onSubmit={_handleAddComment} className={classes.root} noValidate autoComplete="off">
                <TextField 
                    id="filled-multiline-static"
                    label="New Comment"
                    multiline
                    rows={4}
                    defaultValue="Default Value"
                    variant="filled" 
                    onChange={(event) => _handleComment(event.target.value)}
                    value={newComment}
                />
                <Button type="submit" color="secondary" variant="contained" size="medium">Add Comment</Button>
            </form>
            <div>
                <p>Display all group comments</p>
            </div>
            {(comments.length !== 0) ? (
                comments.map((comment) => {
                    return (
                        <div>
                            <p>{comment.createdAt}</p>
                            <p>{comment.content}</p>
                        </div>
                    )
                })
            ) : (
                <p>This group has no comments yet! Why don't you add one?</p>
            )}
        </Container>
    )
}

export default GroupPage;