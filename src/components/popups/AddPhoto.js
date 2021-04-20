import {inject, observer} from 'mobx-react';
import { useState } from 'react';
import { makeStyles, Dialog, DialogTitle, DialogActions, Button, TextField, Typography } from '@material-ui/core';
import { Check, Close } from '@material-ui/icons';
const axios = require('axios');


const AddPhoto = inject('Page', 'NewStoryStore')(observer((props) => {
    const {Page, NewStoryStore} = props;

    const useStyles = makeStyles(() => ({
        addPhoto: {
            width: '25vw',
            height: '50vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            textAlign: 'center'
        },
        photoDiv: {
            height: '50%'
        },
        photoInput: {
            width: '80%',
            margin: 'auto'
        },
        dascInput: {
            width: '80%'
        },
        img: {
            maxWidth: '90%',
            maxHeight: '100%',
            objectFit: 'cover'
        },
        pictureCard: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }
    }))
    const classes = useStyles();

    const [id, setId] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const uploadPhoto = async e => {
        setLoading(true);
        if (id) {await axios.post('http://localhost:4000/deleteImage', {imageId: id})}
        const file = e.target.files[0];
        const newFormData = new FormData();
        newFormData.append('file', file);
        newFormData.append('upload_preset', 'eilon90_map_story');
        const result = await axios.post('https://api.cloudinary.com/v1_1/eilon90/image/upload', newFormData);
        if (result.data.secure_url && result.data.public_id) {
            setId(result.data.public_id);
            setUrl(result.data.secure_url);
        } 
        setLoading(false);
    }

    const typeDesc = e => setDescription(e.target.value);

    const addPhoto = () => {
        NewStoryStore.addPhoto(id, description, url);
        Page.closePhotoPopup();
        setId('');
        setDescription('');
        setUrl('');
    }

    const cancel = async () => {
        // if (id) {await axios.post('http://localhost:4000/deleteImage', {imageId: id})}
        if (id) {await axios.post('/deleteImage', {imageId: id})}
        setId('');
        setDescription('');
        setUrl('');
        Page.closePhotoPopup();
    }

    return (
        <Dialog maxWidth = '25vw' open = {Page.addPhotoVisible}>
            <div className = {classes.addPhoto} >
                <DialogTitle className = {classes.title} id="alert-dialog-title">Add Photo</DialogTitle>
                <Button className = {classes.photoInput} variant="contained" component="label">Choose Photo<input type = 'file' onChange = {uploadPhoto} hidden/></Button>
                <div className = {classes.photoDiv}>
                    {loading && <Typography>loading...</Typography>}
                    {url && <img className = {classes.img} src = {url}/>}
                </div>
                <TextField className = {classes.dascInput} label = 'Description of the photo' value = {description} onChange = {typeDesc}/>
                <DialogActions>
                    <Button onClick={addPhoto} color="primary" disabled = {url && id ? false : true}><Check/></Button>
                    <Button onClick={cancel} color="primary"><Close/></Button>
                </DialogActions>
            </div>
        </Dialog>
    )
}))

export default AddPhoto;