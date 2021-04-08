import {inject, observer} from 'mobx-react';
import { makeStyles, FormControl, Typography, Select, MenuItem, TextField, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { Search } from '@material-ui/icons';
import { useEffect, useState } from 'react';

const SearchUser = inject('UserStore', 'Page', 'MapStore', 'Search')(observer((props) => {
    const {UserStore, Page, MapStore, Search} = props;
    const useStyles = makeStyles(() => ({
        searchUser: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        form: {
            width: '70%'
        },
        select: {
            
        },
        textField: {
            width: '70%',
            margin: '5%',
            borderRadius: '5px'
        },
        usersResults: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        storiesResults: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        searchButton: {
            width: '40%'
        },
        resultButton: {
            
        },
        storyName: {
            fontWeight: 'bold',
            marginTop: '4%'
        },
        userName: {
            fontWeight: 'bold',
            marginTop: '4%'
        }
    }))
    const classes = useStyles();

    useEffect(() => {
        Search.resetValues();
        setSearchFor(0);
        if(MapStore.map) {MapStore.backToGlobalZoom()}
        if(UserStore.user.stories) {MapStore.removeAllMarkers()}
    }, []);

    const [searchfor, setSearchFor] = useState(0);
    const history = useHistory();
    const changeSearchFor = e => setSearchFor(e.target.value);
    const typeSearch = e => Search.typeSearch(e.target.value);
    const searchByEnter = e => {if (e.keyCode === 13) {search()}}
    const search = () => {
        switch (searchfor) {
            case 0: Search.searchUser();
            break;
            case 1: Search.searchStory();
            break;
        }
    }

    const goToUser = async userId => {
        await UserStore.fetchWatchedUser(userId);
        history.push(`/userPage/${userId}`);
    };

    const goToStory = async (userId, storyId) => {
        await UserStore.fetchWatchedUser(userId);
        history.push(`/storyPage/${userId}/${storyId}`);
    }

    return (
        <div className = {classes.searchUser}>
            <h1>Search user</h1>
            <FormControl variant="outlined" className = {classes.form} size = "small">
                <Typography variant = 'subtitle2'>Search for:</Typography>
                <Select className = {classes.select} value = {searchfor} onChange={changeSearchFor}>
                    <MenuItem value = {0}>User name</MenuItem>
                    <MenuItem value = {1}>Story name</MenuItem>
                </Select>
            </FormControl>
            <TextField placeholder = 'searching text...' size="small" variant = 'outlined' className = {classes.textField} value = {Search.searchStirng} onChange = {typeSearch} onKeyDown = {searchByEnter}/>
            <Button className = {classes.searchButton} variant = 'contained' onClick = {search}>Search</Button>
            <div className = {classes.usersResults}>
                {Search.users.map((u, index) => <Button className = {classes.userName} key = {index} onClick = {async () => goToUser(u._id)}>{u.firstName} {u.lastName}</Button>)}
            </div>
            <div className = {classes.storiesResults}>
                {Search.stories.map((s, index) => <div key = {index} className = {classes.storyName}>
                    <Button className = {classes.resultButton} onClick = {async () => goToStory(s.userId, s.storyId)}><div><Typography variant = 'BUTTON TEXT' className = {classes.storyName}>{s.storyTitle}</Typography><Typography style = {{textTransform: 'none', alignText: 'left'}} variant = 'body2'>{s.userName}</Typography></div></Button>
                </div>)}
            </div>
        </div>
    )
}))

export default SearchUser;