import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

import { makeStyles } from '@material-ui/core/styles';
import { GridList, Typography, GridListTile }  from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    dashboardDiv:{
        position: 'relative',
        borderRadius: '5px',
        background: '#768B91',
        boxShadow: 'inset -12px -12px 30px #A5C3CB, inset 12px 12px 30px #475357',
        textAlign: 'center',
        color: '#002B36',
        padding: '0.8rem 1.6rem',
        marginBottom: '2rem',
        marginLeft: '1rem',
    },
    gridList: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
    },
    typography: {
        padding: theme.spacing(2),
        alignItems: 'center',
        color: '#002B36',
    },
    link: {
        color: '#002B36',
    },
}));

const GroupsCard = () => {
    const classes = useStyles();
    const [groups, setGroups] = useState(null);
    const { user } = useAuth0();

    useEffect(() => {
        axios.get(`http://localhost:3000/groups/${user.sub}`)
            .then(res => {
                const data = res.data;
                setGroups(data);
            })
            .catch(err => console.log(err));
    }, []);

    if (groups === null) {
        return 'Loading...';
    }

    return (
        <>
            <div className={classes.dashboardDiv}>
            <Typography variant="h6" className={classes.typography}><Link className={classes.link} to="/groups">Your Groups</Link></Typography>
                {(groups.length !== 0) ? (groups.map((group) => (
                    <GridList className={classes.gridList} cols={1} cellHeight={'auto'}>
                    <GridListTile cellHeight={'auto'} key={group.id}>
                        <Typography variant="h6">{group.groupName}</Typography>
                        <br/>
                        <Typography>{group.groupDescription}</Typography>
                    </GridListTile>
                    </GridList> 
                ))) : (
                    <Typography>You're not part of any groups!</Typography>
                )}
            </div>
        </>
    )
}

export default GroupsCard;