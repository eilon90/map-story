import {inject, observer} from 'mobx-react';
import { makeStyles, Dialog, Typography } from '@material-ui/core';
import EventFullScreen from './EventFullScreen';

const StoryFullScreen = inject('UserStore', 'Page', 'MapStore')(observer((props) => {
    const {UserStore, Page, MapStore} = props;
    const useStyles = makeStyles(() => ({
        storyFullScreen: {
            backgroundColor: '#83C5BE',
            height: '100vh',
            width: '70vw'
        },
        headerDiv: {
            display: 'block',
            margin: 'auto',
            position: 'relative',
            height: '60%',
            width: '98%',
            top: '-2%',
            zIndex: '1'
        },
        title: {
            textAlign: 'center',
            fontWeight: 'bold',
            margin: '0'
        }
    }))
    const classes = useStyles();

    const thisUser = UserStore.user.stories ? UserStore.user.stories.some(s => s._id === UserStore.currentStoryId) : null;
    let stories;
    switch (thisUser) {
        case true: stories = UserStore.user ? UserStore.user.stories : null;
        break;
        case false: stories = UserStore.watchedUser ? UserStore.watchedUser.stories : null;
        break;
    }
    // const stories = UserStore.user ? UserStore.user.stories : null;
    const currentStory = stories ? stories.find(s => s._id === UserStore.currentStoryId) : null
    const events = currentStory ? currentStory.events : null;
    const currentEventCoors = currentStory ? events[UserStore.currentEvent].coordinates : null;

    const closeFullScreen = () => {
        UserStore.moveToFirstPhoto();
        Page.closeFullScreen();
    }

    const closeByEsc = e => {if (e.keyCode === 27) {closeFullScreen()}}

    return (
        <Dialog open = {Page.fullScreenVisible} maxWidth = '70vw' onKeyDown = {closeByEsc}>
            <div className = {classes.storyFullScreen}>
                <i className = "fas fa-window-close" id = "X" onClick = {closeFullScreen}></i>
                <div className = {classes.headerDiv}>
                    <Typography variant = 'h6' className = {classes.title}>{currentStory && currentStory.title}</Typography>
                    <EventFullScreen/>
                </div>
            </div>
        </Dialog>
    )
}))

export default StoryFullScreen;