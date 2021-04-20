import {inject, observer} from 'mobx-react';
import { makeStyles, Typography, Paper} from '@material-ui/core';

const EventDisplay = inject('UserStore')(observer((props) => {
    const {UserStore} = props;
    const useStyles = makeStyles(() => ({
        eventDisplay: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#52b788',
            width: '92%',
            borderRadius: '10px',
            marginBottom: '3%',
            height: '93%',
            overflow: 'auto'
        }, 
        img: {
            maxWidth: '90%',
            maxHeight: '80%',
            objectFit: 'cover',
            marginBottom: '1%',
            border: '0.2vw ridge #e29578'
        },
        pictureCard: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        title: {
            fontWeight: 'bold',
            margin: '3%',
            fontFamily: "'Kavivanar', cursive",
            width: '95%',
            textAlign: 'center'
        },
        eventDes: {
            marginBottom: '6%',
            color: '#222',
            fontFamily: "'Architects Daughter', cursive",
            width: '95%'
        },
        photoDes: {
            fontSize: 'medium',
            marginBottom: '3%',
            color: '#444',
            width: '95%',
            textAlign: 'center'
        }
    }))
    const classes = useStyles();

    let thisUser = UserStore.user.stories ? UserStore.user.stories.some(s => s._id === UserStore.currentStoryId) : null;
    if (!UserStore.userId) {thisUser = false}
    let stories;
    switch (thisUser) {
        case true: stories = UserStore.user ? UserStore.user.stories : null;
        break;
        case false: stories = UserStore.watchedUser ? UserStore.watchedUser.stories : null;
        break;
    }
    const currentStory = stories ? stories.find(s => s._id === UserStore.currentStoryId) : null
    const events = currentStory ? currentStory.events : null;
    const event = currentStory ? currentStory.events[UserStore.currentEvent] : null;


    return (
        <Paper className = {classes.eventDisplay}>
            <Typography variant = 'h5' className = {classes.title}>{currentStory && event.title}</Typography>
            <Typography variant = 'h5' className = {classes.eventDes}>{currentStory && event.description}</Typography>
            {currentStory && event.photos && event.photos.map((p, index) => <div className = {classes.pictureCard}><img className = {classes.img} key = {index} src = {p.url}/><Typography className = {classes.photoDes} variant = 'h6'>{p.description}</Typography></div>)}
        </Paper>
    )
}))

export default EventDisplay;