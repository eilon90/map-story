import {inject, observer} from 'mobx-react';
import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import { AddPhotoAlternate, Check, Close, Delete } from '@material-ui/icons';

const NewEvent = inject('Page', 'NewStoryStore', 'MapStore')(observer((props) => {
    const {Page, NewStoryStore, MapStore} = props;
    const useStyles = makeStyles(() => ({
        newEvent: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        },
        textField: {
            width: '80%',
            margin: '4%'
        },
        innerNewEvent: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            height: '74vh'
        },
        buttons: {
            marginTop: '5%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        pictureCard: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '50%',
            margin: '0 2%'
        },
        img: {
            maxWidth: '90%',
            maxHeight: '80%',
            objectFit: 'cover',
            marginBottom: '1%',
            border: '0.2vw ridge #e29578'
        },
        photosDiv: {
            height: '30%',
            width: '80%',
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '3%',
            justifyContent: 'space-around'
        },
        photosHeader: {
            width: '80%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        deletePhoto: {
            color: '#DC143C',
            cursor: 'pointer'
        }
    }))
    const classes = useStyles();

    const typeTitle = e => NewStoryStore.typeEventTitle(e.target.value);
    const typeDesc = e => NewStoryStore.typeEventDesc(e.target.value);

    const addEvent = () => {
        NewStoryStore.addEvent();
        MapStore.changeEditToNewStory(NewStoryStore.eventsList[NewStoryStore.eventsList.length - 1]);
        NewStoryStore.backToEventsList();
    }

    const changeEvent = async () => {
        MapStore.changeEditToNewStory(NewStoryStore.eventsList[NewStoryStore.eventNum]);
        await NewStoryStore.changeEvent();
        NewStoryStore.backToEventsList();
    }

    const cancel = () => {
        NewStoryStore.deleteNewEventPhotos();
        NewStoryStore.newEvent ? MapStore.removeEditMarker() : MapStore.changeEditToNewStory(NewStoryStore.eventsList[NewStoryStore.eventNum]);
        NewStoryStore.backToEventsList();
    }

    const openPhotoPopup = () => Page.openPhotoPopup();

    const deleteOnePhoto = (p, index) => NewStoryStore.deleteOnePhoto(p, index);

    return (
        <div className = {classes.newEvent}>
            {NewStoryStore.newStory && <Typography className = {classes.pageTitle} variant = 'h5'>New Event</Typography>}
            <div className = {classes.innerNewEvent}>
                <TextField className = {classes.textField}  label = 'Title' value = {NewStoryStore.eventTitle} onChange = {typeTitle}/>
                <TextField className = {classes.textField} label = 'Description' multiline rows={20} variant="outlined" value = {NewStoryStore.eventDescription} onChange = {typeDesc}/>
                <div className = {classes.photosHeader}>
                    <Typography variant = 'h6' style = {{fontWeight: 'BOLD'}}>Photos:</Typography>
                    <Button startIcon={<AddPhotoAlternate/>} onClick = {openPhotoPopup} disabled = {NewStoryStore.photos.length < 3 ? false : true}>Add Photo</Button>
                </div>
                <div className = {classes.photosDiv}>
                    {!NewStoryStore.photos[0] && <Typography>No Photos</Typography>}
                    {NewStoryStore.photos.map((p, index) => <div className = {classes.pictureCard}>
                        <img className = {classes.img} key = {index} src = {p.url}/>
                        <Typography className = {classes.photoDes} variant = 'h6'>{p.description}</Typography>
                        <Delete className = {classes.deletePhoto} onClick = {() => deleteOnePhoto(p, index)}/>
                    </div>)}
                </div>
            </div>
            <div className = {classes.buttons}>
                {NewStoryStore.newEvent && <Button className = {classes.button} color = 'primary' variant="contained" onClick = {addEvent} startIcon={<Check/>} disabled = {NewStoryStore.eventTitle ? false : true}>Add the event</Button>}
                {!NewStoryStore.newEvent && <Button className = {classes.button} color = 'primary' variant="contained" onClick = {changeEvent} startIcon={<Check/>} disabled = {NewStoryStore.eventTitle ? false : true}>Save</Button>}
                <Button className = {classes.button} variant="contained" onClick = {cancel} startIcon={<Close/>}>Cancel</Button>
            </div>
        </div>
    )
}))

export default NewEvent;