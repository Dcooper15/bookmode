import React, { useState } from 'react'
import GroupDetail from './GroupDetail';

const GroupsList = () => {
    const [groups, setGroups] = useState([]);
    
    const renderGroups = () => {
        if (groups.length !== 0) {
            return (groups.map((group) => {
                <GroupDetail group={group} />
            }))
        } else {
            return <p>You're not part of any groups!</p>
        }
    }

    return (
        <>
            <h2>Render List of Users Groups Here</h2>
            {renderGroups()}
        </>
    )
}

export default GroupsList;