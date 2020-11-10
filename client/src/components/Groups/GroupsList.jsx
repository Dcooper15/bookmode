import React, { useEffect, useState } from 'react'
import GroupDetail from './GroupDetail';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { makeStyles } from '@material-ui/core/styles';
import { GridList, Typography, Button }  from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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
}));

const GroupsList = (props) => {
    const classes = useStyles();
    const { list } = props;
    const [groups, setGroups] = useState(null);
    
    const { user } = useAuth0();

    useEffect(() => {
        (async function (){
            let url = ``;
            if (list === 'All') {
                url = `http://localhost:3000/groups/`
            } else {
                url = `http://localhost:3000/groups/${user.sub}`
            }
            console.log(url);
            axios.get(url)
                .then(res => {
                    const data = res.data;
                    // console.log('res.data:', data)
                    setGroups(data)
                })
            })();
    }, [list, user.sub]);  

    // return while waiting on axios, then render updated page
    if (groups === null) {
        return 'Loading...';
    }

    return (
        <>
            <Typography variant="h6" >List of {list} Groups</Typography>
            <br />
            <div className={classes.groupsDiv}>
                <GridList className={classes.gridList} cols={2} cellHeight={'auto'}>
                    {(groups.length !== 0) ? (groups.map((group) => (
                        <GroupDetail group={group} list={list} />
                    ))) : (
                        <Typography>You're not part of any groups!</Typography>
                    )};
                </GridList> 
            </div>
        </>
    )
}

export default GroupsList;