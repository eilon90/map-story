import {observable, action, makeObservable} from 'mobx';
import L from 'leaflet';
const axios = require('axios');

export class NewStoryStore {
    constructor() {
        this.storyTitle = '';
        this.storyDescription = '';
        this.eventTitle = '';
        this.eventDescription = '';
        this.eventsList = [];
        this.activeClick = false;
        this.eventCoordinate = [];
        this.photos = [];
        this.editEventDiv = false;
        this.newEvent = true;
        this.eventNum = -1;
        this.newStory = true;
        this.storyId = '';
        this.privateStory = false;
        this.photosToDelete = [];
        this.newPhotos = [];

        makeObservable(this, {
            storyTitle: observable,
            storyDescription: observable,
            eventTitle: observable,
            eventDescription: observable,
            eventsList: observable,
            activeClick: observable,
            eventCoordinate: observable,
            photos: observable,
            editEventDiv: observable,
            newEvent: observable,
            newStory: observable,
            eventNum: observable,
            storyId: observable,
            privateStory: observable,
            photosToDelete: observable,
            newPhotos: observable,
            typeStoryTitle: action,
            typeStoryDesc: action,
            typeEventTitle: action,
            typeEventDesc: action,
            makeMapActive: action,
            makeMapUnactive: action,
            openEventEditing: action,
            closeEventEditing: action,
            backToEventsList: action,
            editCoordinates: action,
            deleteStory: action,
            addPhoto: action,
            addEvent: action,
            changeEvent: action,
            saveStory: action,
            editEvent: action,
            deleteEvent: action,
            moveUpward: action,
            moveDownward: action,
            deleteNewEventPhotos: action,
            deleteStoryPhotos: action,
            openEdit: action,
            cancelEditing: action,
            changePrivacy: action,
            deleteOnePhoto: action
        })
    }

    typeStoryTitle = str => this.storyTitle = str;
    typeStoryDesc = str => this.storyDescription = str;

    typeEventTitle = str => this.eventTitle = str;
    typeEventDesc = str => this.eventDescription = str;

    async deleteStory(userId) {
        if (this.eventsList[0]) {await this.deleteStoryPhotos()}
        this.storyTitle = '';
        this.storyDescription = '';
        this.privateStory = false;
        this.eventsList = [];
        this.photosToDelete = [];
        this.newPhotos = [];
        this.makeMapUnactive();
        if (!this.newStory) {
            await axios.delete(`http://localhost:4000/story/${userId}/${this.storyId}`);
            // await axios.delete(`/story/${userId}/${this.storyId}`);
            this.newStory = true;
            this.storyId = '';
        }
    }


    makeMapActive = () => this.activeClick = true;
    makeMapUnactive = () => this.activeClick = false;

    openEventEditing = () => this.editEventDiv = true;
    closeEventEditing = () => this.editEventDiv = false;

    async backToEventsList() {
        this.closeEventEditing();
        this.makeMapActive();
        this.eventCoordinate = [];
        this.eventTitle = '';
        this.eventDescription = '';
        this.photos = [];
        this.newEvent = true;
        this.eventNum = -1;
    }

    editCoordinates = latLng => this.eventCoordinate = latLng;

    addPhoto(id, description, url) {
        const photo = {
            cloudinary_id: id,
            description: description,
            url: url
        }
        this.photos.push(photo);
        if (!this.newStory) {this.newPhotos.push(id)}
    }

    addEvent() {
        const newStoryMarker = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })

        const newEvent = {
            title: this.eventTitle,
            description: this.eventDescription,
            coordinates: {
                latitude: this.eventCoordinate[0],
                longtitude: this.eventCoordinate[1],
            },
            marker: L.marker(this.eventCoordinate, {icon: newStoryMarker})
        }
        if (this.photos[0]) {
            newEvent.photos = [];
            this.photos.forEach(p => newEvent.photos.push(p));
        }
        if (!this.newStory) {newEvent.newEvent = true}
        this.eventsList.push(newEvent);
    }

    async changeEvent() {
        const changedEvent = {};
        changedEvent.title = this.eventTitle;
        changedEvent.description = this.eventDescription;
        changedEvent.coordinates = {
            latitude: this.eventCoordinate[0],
            longtitude: this.eventCoordinate[1]
        }
        changedEvent.marker = this.eventsList[this.eventNum].marker;
        if (this.eventsList[this.eventNum].photos) {
            let num = 0;
            this.eventsList[this.eventNum].photos.forEach(async (p, index) => {
                if ((!this.photos[0]) || p.cloudinary_id !== this.photos[index + num].cloudinary_id) {
                    if (this.newStory || this.eventsList[this.eventNum].newStory) {
                        await axios.post('http://localhost:4000/deleteImage', {imageId: p.cloudinary_id});
                        // await axios.post('/deleteImage', {imageId: p.cloudinary_id});
                    }
                    else {
                        this.photosToDelete.push(p.cloudinary_id)
                    }
                    num--;
                }
            })
        }

        if (this.photos[0]) {
            changedEvent.photos = [];
            this.photos.forEach(p => changedEvent.photos.push(p));
        }

        this.eventsList.splice(this.eventNum, 1, changedEvent);

        this.eventNum = -1;
    }

    async saveStory(userId) {
        this.makeMapUnactive();
        this.eventsList.forEach(e => delete(e.marker));
        if (!this.newStory) {
            this.eventsList.forEach(e => {
                if (e.newEvent) {delete e.newEvent}
            })
        }
        const story = {
            title: this.storyTitle,
            description: this.storyDescription,
            private: this.privateStory,
            events: this.eventsList
        }
        if (this.newStory) {await axios.post(`http://localhost:4000/story/${userId}`, story)}
        // if (this.newStory) {await axios.post(`/story/${userId}`, story)}
        else {
            if (this.photosToDelete[0]) {
                this.photosToDelete.forEach(async p => {await axios.post('http://localhost:4000/deleteImage', {imageId: p})});
                // this.photosToDelete.forEach(async p => {await axios.post('/deleteImage', {imageId: p})});
                this.photosToDelete = [];
            }
            await axios.post(`http://localhost:4000/changeStory/${userId}/${this.storyId}`, story)
            // await axios.post(`/changeStory/${userId}/${this.storyId}`, story)
        }
        this.storyTitle = '';
        this.storyDescription = '';
        this.privateStory = false;
        this.eventsList = [];
        this.newStory = true;
        this.storyId = '';
        this.newPhotos = [];
    }

    editEvent(event, index) {
        this.eventTitle = event.title;
        if (event.description) {this.eventDescription = event.description};
        this.eventCoordinate = [event.coordinates.latitude, event.coordinates.longtitude];
        if (event.photos) {event.photos.forEach(p => this.photos.push(p))}
        this.newEvent = false;
        this.editEventDiv = true;
        this.eventNum = index;
    }

    async deleteEvent(index) {
        if (this.eventsList[index].photos && this.newStory) {await this.eventsList[index].photos.forEach(async p => await axios.post('/deleteImage', {imageId: p.cloudinary_id}))}
        if (this.eventsList[index].photos && !this.newStory) {
            if (this.eventsList[index].newEvent) {await this.eventsList[index].photos.forEach(async p => await axios.post('http://localhost:4000/deleteImage', {imageId: p.cloudinary_id}))}
            // if (this.eventsList[index].newEvent) {await this.eventsList[index].photos.forEach(async p => await axios.post('/deleteImage', {imageId: p.cloudinary_id}))}
            this.eventsList[index].photos.forEach(p => this.photosToDelete.push(p.cloudinary_id))
        }
        this.eventsList.splice(index, 1);
    } 

    moveUpward(index) {
        const event = this.eventsList[index];
        this.eventsList.splice(index, 1);
        this.eventsList.splice(index - 1, 0 , event);
    }

    moveDownward(index) {
        const event = this.eventsList[index];
        this.eventsList.splice(index, 1);
        this.eventsList.splice(index + 1, 0 , event);
    }

    async deleteNewEventPhotos() {
        if (this.newEvent && this.photos[0]) {this.photos.forEach(async p => await axios.post('http://localhost:4000/deleteImage', {imageId: p.cloudinary_id}))}
        // if (this.newEvent && this.photos[0]) {this.photos.forEach(async p => await axios.post('/deleteImage', {imageId: p.cloudinary_id}))}
        else if (this.photos[0]) {
            this.photos.forEach(async p => {if (this.eventsList[this.eventNum].photos.every(ph => ph.cloudinary_id !== p.cloudinary_id)) {
                await axios.post('http://localhost:4000/deleteImage', {imageId: p.cloudinary_id});
                // await axios.post('/deleteImage', {imageId: p.cloudinary_id});
            }})
        }
    }

    async deleteStoryPhotos() {
        if (this.eventsList[0]) {
            this.eventsList.forEach(async e => {
                if (e.photos[0]) {
                    e.photos.forEach(p => async p => {
                        await axios.post('http://localhost:4000/deleteImage', {imageId: p.cloudinary_id})
                        // await axios.post('/deleteImage', {imageId: p.cloudinary_id})
                    });
                }
            })
        }
    }

    openEdit(story) {
        this.newStory = false;
        this.storyId = story._id;
        this.storyTitle = story.title;
        this.privateStory = story.private;
        this.storyDescription = story.description;
        story.events.forEach((e, index) => {
            this.eventsList[index] = {};
            this.eventsList[index].title = e.title;
            this.eventsList[index].description = e.description;
            this.eventsList[index].coordinates = {
                longtitude: e.coordinates.longtitude,
                latitude: e.coordinates.latitude
            }
            if (e.photos) {
                this.eventsList[index].photos = [];
                e.photos.forEach(p => this.eventsList[index].photos.push(p));
            }
            this.eventsList[index].marker = e.marker;
        });

        const newStoryMarker = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
        this.eventsList.forEach(e => e.marker = L.marker([e.coordinates.latitude, e.coordinates.longtitude], {icon: newStoryMarker}));
    }

    async cancelEditing() {
        if (this.newPhotos[0]) {
            this.newPhotos.forEach(async n => await axios.post('http://localhost:4000/deleteImage', {imageId: n.id}));
            // this.newPhotos.forEach(async n => await axios.post('/deleteImage', {imageId: n.id}));
        }
        this.storyId = '';
        this.newStory = true;
         this.storyTitle = '';
        this.storyDescription = '';
        this.privateStory = false;
        this.eventsList = [];
        this.photosToDelete = [];
        this.newPhotos = [];
        this.makeMapUnactive();
    }

    changePrivacy = value => this.privateStory = value;

    async deleteOnePhoto(photo, index) {
        this.photos.splice(index, 1);
        if (this.newEvent || (!this.eventsList[this.eventNum].photos) || (!this.eventsList[this.eventNum].photos[index]) || this.eventsList[this.eventNum].photos[index].cloudinary_id !== photo.cloudinary_id) {
            await axios.post('http://localhost:4000/deleteImage', {imageId: photo.cloudinary_id})
            // await axios.post('/deleteImage', {imageId: photo.cloudinary_id})
        }
    }
}