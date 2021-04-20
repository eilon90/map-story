import {inject, observer} from 'mobx-react';
import { makeStyles, useTheme, Typography, BottomNavigation, BottomNavigationAction, MobileStepper, Button } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight, ChevronLeft, ChevronRight } from '@material-ui/icons';
import { Photo, Subject } from '@material-ui/icons';

const EventFullScreen = inject('UserStore', 'MapStore', 'Page')(observer((props) => {
    const {UserStore, MapStore, Page} = props;
    const useStyles = makeStyles(() => ({
        eventFullScreen: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            backgroundColor: '#83C5BE',
            borderRadius: '10px',
            marginBottom: '3%',
            height: '50vh'
        }, 
        img: {
            maxWidth: '90vw',
            maxHeight: '73vh',
            objectFit: 'cover',
            display: 'block',
            margin: 'auto',
            border: '0.4vw ridge #e29578',
            marginTop: '0.5%'
        },
        pictureCard: {
            width: '100%'
        },
        title: {
            fontWeight: 'bold',
            marginLeft: '3%',
            fontFamily: "'Kavivanar', cursive",
            display: 'inline',
            width: '20%'
        },
        eventDes: {
            color: '#222',
            fontFamily: "'Architects Daughter', cursive",
            marginTop: '1%',
            marginLeft: '3%',
        },
        photoDes: {
            fontSize: 'medium',
            color: '#444',
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: '0.5%'
        },
        nav: {
            display: 'inline',
            position: 'relative',
            backgroundColor: '#52b788',
            borderRadius: '10px',
            width: '14%'
        },
        header: {
            backgroundColor: '#52b788',
            borderRadius: '10px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        stepper: {
            backgroundColor: '#52b788',
            width: '27%',
            display: 'flex',
            justifyContent: 'space-around',
            margin: '0 auto',
            padding: '0',
            marginRight: '22.5%'
        },
        stepperButton: {
            position: 'relative',
            top: '2px',
            margin: '0'
        },
        photosarrows: {
            fontSize: '600%'
        },
        pictureWithArrows: {
            marginTop: '1%',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around'
        },
        photobutton: {
            width: '2%'
        }
    }))
    const classes = useStyles();
    const theme = useTheme();

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
    const events = stories ? currentStory.events : null;
    const event = stories ? currentStory.events[UserStore.currentEvent] : null;
    const numOfEvents = stories ? events.length : null;
    const photo = stories && event.photos ? event.photos[UserStore.currentPhoto] : null;

    const photoTextChange = () => Page.photoTextChange();

    const handleNext = () => {
        const formerIndex = UserStore.currentEvent;
        const formerEvent = events[UserStore.currentEvent];
        UserStore.moveToFirstPhoto();
        UserStore.handleNext();
        MapStore.changeEventMarker(formerEvent, events[UserStore.currentEvent], formerIndex, thisUser);
    };

    const handleBack = () => {
        const formerIndex = UserStore.currentEvent;
        const formerEvent = events[UserStore.currentEvent];
        UserStore.moveToFirstPhoto();
        UserStore.handleBack();
        MapStore.changeEventMarker(formerEvent, events[UserStore.currentEvent], formerIndex, thisUser);
    };

    const formerPhoto = () => UserStore.formerPhoto()

    const nextPhoto = () => UserStore.nextPhoto()

    return (
        <div className = {classes.eventFullScreen}>
            <div className = {classes.header}>
                <Typography variant = 'h5' className = {classes.title}>{stories && event.title}</Typography>
                <MobileStepper className= {classes.stepper} steps={numOfEvents} position="static" variant="text" activeStep={UserStore.currentEvent}
                    nextButton={<Button size="small" className = {classes.stepperButton} onClick={handleNext} disabled = {UserStore.currentEvent === numOfEvents - 1}>
                    Next {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />} </Button>}
                    backButton={<Button size="small" className = {classes.stepperButton} onClick={handleBack} disabled={UserStore.currentEvent === 0}>
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />} Back </Button>}
                />
                <BottomNavigation value = {Page.photoTextToggle} onChange = {photoTextChange} showLabels className={classes.nav}>
                    <BottomNavigationAction label="View Photos" icon={<Subject />} />
                    <BottomNavigationAction label="View Text" icon={<Photo />} />
                </BottomNavigation>
            </div>

            {Page.photoTextToggle === 0 && photo && <div className = {classes.pictureWithArrows}>
                {stories && UserStore.currentPhoto > 0 ? <Button onClick = {formerPhoto} className = {classes.photobutton}><ChevronLeft className = {classes.photosarrows}/></Button> : <div className = {classes.photobutton}></div>}
                <div className = {classes.pictureCard}>
                    <img className = {classes.img} src = {stories && photo.url}/>
                    <Typography className = {classes.photoDes} variant = 'h6'>{stories && photo.description}</Typography>
                </div>
                {stories && UserStore.currentPhoto < event.photos.length - 1 ? <Button onClick = {nextPhoto} className = {classes.photobutton}><ChevronRight className = {classes.photosarrows}/></Button> : <div className = {classes.photobutton}></div>}
            </div>}

            {Page.photoTextToggle === 1 && <Typography variant = 'h5' className = {classes.eventDes}>{stories && event.description}</Typography>}            
        </div>
    )
}))

export default EventFullScreen;