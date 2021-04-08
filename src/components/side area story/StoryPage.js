import {inject, observer} from 'mobx-react';
import { makeStyles, useTheme, Typography, MobileStepper, Button } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight, Edit } from '@material-ui/icons';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import EventDisplay from './EventDisplay';
import StoryFullScreen from '../full screen story/StoryFullScreen';

const StoryPage = inject('UserStore', 'MapStore', 'Page', 'NewStoryStore')(observer((props) => {
    const {UserStore, MapStore, Page, NewStoryStore} = props;
    const useStyles = makeStyles(() => ({
        Storypage: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '95vh'
        },
        eventCon: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: '80%'
        },
        title: {
            textAlign: 'center',
            marginTop: '3%',
            fontWeight: 'bold'
        },
        stepper: {
            backgroundColor: '#83C5BE',
            width: '80%',
            margin: 'auto'
        },
        button: {
            float: 'bottom',
            bottom: '3%'
        },
        backButton: {
            margin: '0',
            padding: '0'
        },
        privateText: {
            color: '#DC143C',
            fontWeight: 'bold',
            fontSize: 'medium'
        }
    }))
    const classes = useStyles();
    const theme = useTheme();

    const { userId, storyId } = useParams();
    let user;
    const thisUser = (userId === UserStore.userId);
    switch (thisUser) {
        case true: user = UserStore.user ? UserStore.user : null;
        break;
        case false: user = UserStore.watchedUser ? UserStore.watchedUser : null;
        break;
    }
    const stories = user.stories ? user.stories : null;
    const currentStory = stories ? stories.find(s => s._id === storyId) : null
    const events = currentStory ? currentStory.events : null;
    const numOfEvents = currentStory ? events.length : null;
    // const currentEventCoors = currentStory ? events[UserStore.currentEvent].coordinates : null;

    useEffect(() => {
        if (!thisUser && !UserStore.watchedUser._id) {UserStore.fetchWatchedUser(userId)}
    }, [UserStore.watchedUser]);

    useEffect(() => {
        if (UserStore.user) {
            UserStore.getStory(storyId);
        };
    }, [UserStore.user]);

    useEffect(() => {
        if (events) {
            MapStore.getEventsMarkers(events, thisUser);
            MapStore.fitStoryBounds(currentStory);
        };
    }, [events])
    

    const handleNext = () => {
        const formerIndex = UserStore.currentEvent;
        const formerEvent = events[formerIndex];
        UserStore.handleNext();
        MapStore.changeEventMarker(formerEvent, events[UserStore.currentEvent], formerIndex, thisUser);
    };

    const handleBack = () => {
        const formerIndex = UserStore.currentEvent;
        const formerEvent = events[UserStore.currentEvent];
        UserStore.handleBack();
        MapStore.changeEventMarker(formerEvent, events[UserStore.currentEvent], formerIndex, thisUser);
    };

    const openFullScreen = () => Page.openFullScreen();

    const resetStories = () => {
        MapStore.removeMarkers(events);
        UserStore.resetStories();
        MapStore.backToGlobalZoom();
    }

    const openEdit = () => {
        MapStore.removeMarkers(events);
        NewStoryStore.openEdit(currentStory);
        MapStore.getNewStoryMarkers(NewStoryStore.eventsList);
    }

    return (
        <>
        {!Page.fullScreenVisible && <div className = {classes.Storypage}>
        
            <Typography variant = 'h4' className = {classes.title}>{currentStory && currentStory.title}</Typography>
            {currentStory && currentStory.private && <Typography variant = 'h6' className = {classes.privateText}>Private</Typography>}
            {UserStore.user && thisUser && <Button onClick = {openEdit} component={Link} to = '/newStory' startIcon = {<Edit/>}>Edit Story</Button>}
            <Button className = {classes.backButton} color="primary" onClick = {resetStories} component={Link}  to={`/userPage/${user._id}`}>Back to {`${UserStore.user && user.firstName}'s stories`}</Button>

            <MobileStepper className= {classes.stepper} steps={numOfEvents} position="static" variant="text" activeStep={UserStore.currentEvent}
                nextButton={<Button size="small" onClick={handleNext} disabled = {UserStore.currentEvent === numOfEvents - 1}>
                Next {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />} </Button>}
                backButton={<Button size="small" onClick={handleBack} disabled={UserStore.currentEvent === 0}>
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />} Back </Button>}
            />
            <div className= {classes.eventCon}>
                <EventDisplay/>
            </div>
            <Button className = {classes.button} variant="contained" color="primary" onClick = {openFullScreen}> Story Full Screen </Button>
        </div>}
        <StoryFullScreen/>
        </>
    )
}))

export default StoryPage;