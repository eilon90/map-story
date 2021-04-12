import {inject, observer} from 'mobx-react';
import { makeStyles, Typography, Button } from '@material-ui/core';
import { Link, useHistory, useParams } from 'react-router-dom';
import NewStory from '../newStory/NewStory';
import { useEffect } from 'react';

const UserPage = inject('UserStore', 'Page', 'MapStore')(observer((props) => {
    const {UserStore, Page, MapStore} = props;
    const useStyles = makeStyles(() => ({
        userPage: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%'
        },
        storiesCon: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '77%'
        },
        title: {
            textAlign: 'center',
            marginTop: '3%',
            fontWeight: 'bold',
        },
        storiesTitle: {
            textAlign: 'left',
            marginBottom: '3%',
            fontWeight: 'bold'
        },
        button: {
            float: 'bottom',
            bottom: '1px'
        },
        navMenu: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '3%'
        },
        examples: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '3%'
        },
        navButton: {
            fontWeight: 'bold'
        }
    }))
    const classes = useStyles();

    const { userId } = useParams();

    let user;
    const thisUser = (userId === UserStore.userId);
    switch (thisUser) {
        case true: user = UserStore.user ? UserStore.user : null;
        break;
        case false: user = UserStore.watchedUser ? UserStore.watchedUser : null;
        break;
    }
    const stories = user.stories ? user.stories : null;

    const colors = {
        blue: '#2A81CB',
        gold: '#FFD326',
        red: '#CB2B3E',
        orange: '#CB8427',
        yellow: '#CAC428',
        violet: '#9C2BCB',
        black: '#3D3D3D',
    }

    const chooseStory = () => MapStore.removeAllMarkers();

    const removeMarkers = () => MapStore.removeAllMarkers();

    useEffect(() => {
        if (!thisUser && !UserStore.watchedUser._id) {UserStore.fetchWatchedUser(userId)}
    }, [UserStore.watchedUser]);

    useEffect(() => {
        if (!thisUser && stories) {
            MapStore.getAllStoriesMarkers(userId);
            MapStore.backToGlobalZoom();
        }
    }, [UserStore.watchedUser]);

    useEffect(() => {
        if (thisUser && stories) {
            MapStore.getAllStoriesMarkers(userId);
            MapStore.backToGlobalZoom();
        }
    }, [UserStore.user]);

    return (
        <div className = {classes.userPage}>
            {user._id !== '607321afe1775a0c7c5af5f8' && <>
                <Typography variant = 'h4' className = {classes.title}>{`${user && user.firstName} ${user && user.lastName}`}</Typography>
                <div className= {classes.storiesCon}>
                    <Typography variant = 'h6' className = {classes.storiesTitle}>{'Stories:'}</Typography>
                    {stories && stories.map((s, index) => <Button style = {{color: `${colors[s.color]}`}} key = {index} onClick = {chooseStory} component={Link} to={`/storyPage/${userId}/${s._id}`}>{s.title}</Button>)}
                </div>
                {thisUser && <Button className = {classes.button} variant="contained" color="primary" disableElevation onClick = {removeMarkers} component={Link} to={'/newStory'}> Create a new Story </Button>}
            </>}

            {user._id === '607321afe1775a0c7c5af5f8' && <>
                <Typography variant = 'h4' className = {classes.title}>{'Welcome to Mapstore'}</Typography>
                <div className= {classes.navMenu}>
                    <Button className= {classes.navButton} color = 'primary' component = {Link} to = '/login'>Sign in and start to Create your stories</Button>
                    <Button className= {classes.navButton} color = 'primary' component = {Link} to = '/register'>New visitor? create your account here</Button>
                    <Button className= {classes.navButton} color = 'primary' component = {Link} to = '/searchUser'>Search for other users and stories</Button>
                </div>
                <div className= {classes.examples}>
                    <Typography variant = 'h6' className = {classes.storiesTitle}>{'Watch stories examples:'}</Typography>
                    {stories && stories.map((s, index) => <Button style = {{color: `${colors[s.color]}`}} key = {index} onClick = {chooseStory} component={Link} to={`/storyPage/${userId}/${s._id}`}>{s.title}</Button>)}
                </div>
            </>}
        </div>
    )
}))

export default UserPage;