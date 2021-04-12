import {inject, observer} from 'mobx-react';
import { makeStyles, Button, Typography, Divider } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Delete, ArrowUpward, ArrowDownward } from '@material-ui/icons';
import NewEvent from './NewEvent';

const EventsList = inject('UserStore', 'Page', 'NewStoryStore', 'MapStore')(observer((props) => {
    const {UserStore, Page, NewStoryStore, MapStore } = props;
    const useStyles = makeStyles(() => ({
        eventsList: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        },
        storyTitle: {
            textAlign : 'center',
            margin: '5%',
            fontWeight: 'bold'
        },
        button: {
            width: '70%',
            marginBottom: '3%'
        },
        list: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        },
        event: {
            width: '80%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#52b788',
            marginBottom: '3%',
            borderRadius: '10px',
            border: '1px solid balck',
            boxShadow: '2px 2px #666'
        },
        eventTitle: {
            fontWeight: 'bold',
            cursor: 'pointer',
            // textAlign: 'center'
            width: '50%'
        }
    }))
    const classes = useStyles();
    const history = useHistory();

    const eventsList = NewStoryStore.eventsList;
    const openDeleteStoryPopup = () => Page.openGeneralPopup('deleteStory');

    const saveStory = async () => {
        MapStore.removeMarkers(NewStoryStore.eventsList);
        await NewStoryStore.saveStory(UserStore.userId);
        await UserStore.fetchUser();
        MapStore.backToGlobalZoom();
        history.push('/');
    }

    const editEvent = (event, index) => {
        MapStore.changeNewStoryToEdit(event);
        NewStoryStore.editEvent(event, index);
    }

    const cancel = async () => {
        const storyId = NewStoryStore.storyId;
        MapStore.removeMarkers(NewStoryStore.eventsList);
        await NewStoryStore.cancelEditing();
        history.push(`/storyPage/${UserStore.userId}/${storyId}`);
        // MapStore.getNewStoryMarkers(NewStoryStore.eventsList);
    }

    const deleteEvent = index => {
        MapStore.removeNewEventMarker(index);
        NewStoryStore.deleteEvent(index);
    }

    const moveUpward = index => NewStoryStore.moveUpward(index);
    const moveDownward = index => NewStoryStore.moveDownward(index);

    return (
        <div className = {classes.eventsList}>
            <Typography className = {classes.storyTitle} variant = 'h4'>{NewStoryStore.storyTitle}</Typography>
            <Divider style={{width: '90%'}}/>


            {!NewStoryStore.editEventDiv && <div className = {classes.list}>     
                <Typography variant = 'h5'>Add a new event by clicking on the map</Typography>
                    {eventsList[0] && eventsList.map((e, index) => <div key = {index} className = {classes.event}>
                        <Button onClick = {() => deleteEvent(index)}><Delete/></Button>
                        <Typography align = 'left' className = {classes.eventTitle} onClick = {() => editEvent(e, index)}>{e.title}</Typography>
                        <div className = {classes.arrows}><Button onClick = {() => moveUpward(index)} disabled = {index === 0}><ArrowUpward/></Button><Button onClick = {() => moveDownward(index)} disabled = {index === NewStoryStore.eventsList.length - 1}><ArrowDownward/></Button></div>
                    </div>)}
                <Button className = {classes.button} color = 'primary' variant="contained" onClick = {saveStory} disabled = {!NewStoryStore.eventsList[0]}>{NewStoryStore.newStory ? 'Save the Story' : 'Save changes'}</Button>
                {!NewStoryStore.newStory && <Button className = {classes.button} variant="contained" onClick = {cancel}>cancel</Button>}
                <Button className = {classes.button} variant="contained" onClick = {openDeleteStoryPopup}>Delete the Story</Button>
            </div>}

            {NewStoryStore.editEventDiv && <NewEvent/>}
        </div>
    )
}))

export default EventsList;