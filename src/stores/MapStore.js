import axios from 'axios';
import {observable, action, computed, makeObservable} from 'mobx';
import L from 'leaflet';

export class MapStore {
    // UserStore;
    constructor(userStore, newStoryStore) {
        this.UserStore = userStore;
        this.NewStoryStore = newStoryStore;
        this.map = null;
        this.countries = [];
        // this.country = '';
        this.bounds = [39.63, 3.33];
        this.searchInput = '';
        this.searchMarker = null;
        this.currentEventMarker = null;
        this.editMarker = null;

        makeObservable(this, {
            map: observable,
            countries: observable,
            // country: observable,
            bounds: observable,
            searchInput: observable,
            searchMarker: observable,
            currentEventMarker: observable,
            editMarker: observable,
            changeCountry: action,
            // getCountries: action,
            typeSearching: action,
            search: action,
            handleClick: action,
            getCoordinates: action,
            getEventsMarkers: action,
            getNewStoryMarkers: action,
            getAllStoriesMarkers: action,
            getCurrentEventMarker: action,
            changeEventMarker: action,
            moveToEvent: action,
            removeMarkers: action,
            addEditMarker: action,
            removeEditMarker: action,
            addNewStoryMarker: action,
            changeEditToNewStory: action,
            changeNewStoryToEdit: action,
            removeAllMarkers: action,
            fitStoryBounds: action,
            backToGlobalZoom: action,
            resetCountry: action
        })
    }

    typeSearching = str => this.searchInput = str;

    async changeCountry(val) {
        this.country = val;
        const result = await axios.get(`http://localhost:4000/bounds/${this.country}`);
        this.bounds = result.data;
        this.map.fitBounds(this.bounds, this.map.getZoom(), {"animate": true, "pan": {"duration": 15}});
    }

    // async getCountries() {
    //     const results = await axios.get('http://localhost:4000/countries');
    //     const countries = results.data;
    //     this.countries = countries;
    // }

    async search() {
        if (!this.country) {
            alert('Please select country before searching');
            return;
        }
        if (!this.searchInput) {
            alert('Please type an address for searching');
            return;
        }
        let results = await axios.get(`http://localhost:4000/search/${this.country}/${this.searchInput}`);
        results = results.data;
        if (results.error === true) {
            alert("We couldn't find this address. Please try again");
            return;
        }
        else {
            this.map.setView([results[0].latitude, results[0].longtitude], 17, this.map.getZoom(), {"animate": true, "pan": {"duration": 10}});
            if (this.searchMarker) {this.searchMarker.setLatLng([results[0].latitude, results[0].longtitude])}
            else {
                const searchIcon = new L.Icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                  });
                this.searchMarker = L.marker([results[0].latitude, results[0].longtitude], {icon: searchIcon}).addTo(this.map)
            }
        }
        this.searchInput = '';
    }

    handleClick() {
        this.map.on('click', e => {
            this.getCoordinates(e.latlng);
        })
        this.resetCountry();
    }

    getCoordinates(latlng) {
        if (this.NewStoryStore.activeClick) {
            this.NewStoryStore.eventCoordinate = [latlng.lat, latlng.lng];
            this.addEditMarker(this.NewStoryStore.eventCoordinate);
            this.NewStoryStore.makeMapUnactive();
            this.NewStoryStore.openEventEditing();
        }
    }

    getEventsMarkers = (events, thisUser) => {
        events.forEach((e, index) => {
            if (index === 0) {
                const coors = e.coordinates;
                this.getCurrentEventMarker([coors.latitude, coors.longtitude]);
            }
            else {
                e.marker.addTo(this.map).on('click', () => {
                    this.moveToEvent(index, thisUser);
                });
            }
        })
    }

    getNewStoryMarkers(events) {
        events.forEach(e =>  e.marker.addTo(this.map));
    } 

    getAllStoriesMarkers(userId) {
        const user = userId === this.UserStore.userId ? this.UserStore.user : this.UserStore.watchedUser;
        user.stories.forEach(s => {
            s.events.forEach(e => e.marker.addTo(this.map));
        });
        this.resetCountry();
    }

    getCurrentEventMarker(coordinates) {
        const greenIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [35, 51],
            iconAnchor: [15, 51],
            popupAnchor: [1, -34],
            shadowSize: [51, 51]
        });
          
        this.currentEventMarker = L.marker(coordinates, {icon: greenIcon}).addTo(this.map);
    }

    changeEventMarker(formerEvent, nextEvent, formerIndex, thisUser) {
        formerEvent.marker.addTo(this.map).on('click', () => {
            this.moveToEvent(formerIndex, thisUser);
        });
        this.map.removeLayer(nextEvent.marker);
        this.currentEventMarker.setLatLng([nextEvent.coordinates.latitude, nextEvent.coordinates.longtitude]);
    }

    moveToEvent(eventIndex, thisUser) {
        if (this.UserStore.currentStoryId === '') {return}
        let stories;
        switch (thisUser) {
            case true: stories = this.UserStore.user ? this.UserStore.user.stories : null;
            break;
            case false: stories = this.UserStore.watchedUser ? this.UserStore.watchedUser.stories : null;
            break;
        }
        // const stories = this.UserStore.user ? this.UserStore.user.stories : null;
        const currentStory = stories ? stories.find(s => s._id === this.UserStore.currentStoryId) : null
        const events = stories ? currentStory.events : null;
        const formerIndex = this.UserStore.currentEvent;
        const formerEvent = events[formerIndex];
        this.UserStore.changeEvent(eventIndex);
        this.changeEventMarker(formerEvent, events[eventIndex], formerIndex, thisUser);
    }
    
    removeMarkers(events) {
        if (this.searchMarker) {this.map.removeLayer(this.searchMarker)}
        if (this.currentEventMarker) {this.map.removeLayer(this.currentEventMarker)}
        events.forEach(e => this.map.removeLayer(e.marker));
        this.resetCountry();
    }

    addEditMarker(coordinates) {
        const redIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [35, 51],
            iconAnchor: [15, 51],
            popupAnchor: [1, -34],
            shadowSize: [51, 51]
        });

        this.editMarker = L.marker(coordinates, {icon: redIcon}).addTo(this.map);
    }

    removeEditMarker() {
        this.map.removeLayer(this.editMarker);
        this.resetCountry();
    }

    addNewStoryMarker = event => event.marker.addTo(this.map);

    changeEditToNewStory(event) {
        this.removeEditMarker();
        this.addNewStoryMarker(event);
    }

    changeNewStoryToEdit(event) {
        this.map.removeLayer(event.marker);
        this.addEditMarker([event.coordinates.latitude, event.coordinates.longtitude]);
    }

    removeAllMarkers() {
        this.UserStore.user.stories.forEach(s => this.removeMarkers(s.events));
        if (this.UserStore.watchedUser.stories) {
            this.UserStore.watchedUser.stories.forEach(s => this.removeMarkers(s.events))
        }
        this.resetCountry();
    }

    fitStoryBounds(story) {
        const storyBounds = [];
        story.events.forEach(e => {
            const eventCoors = [e.coordinates.latitude, e.coordinates.longtitude];
            storyBounds.push(eventCoors);
        })
        this.map.fitBounds(storyBounds, this.map.getZoom(), {"animate": true, "pan": {"duration": 15}});
    }

    backToGlobalZoom() {
        this.bounds = [39.63, 3.33]
        this.map.setView(this.bounds, 3, this.map.getZoom(), {"animate": true, "pan": {"duration": 10}});
    }

    resetCountry = () => this.country = '';
}