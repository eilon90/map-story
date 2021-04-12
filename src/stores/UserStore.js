import {observable, action, computed, makeObservable} from 'mobx';
import L from 'leaflet';
const axios = require('axios');

export class UserStore {
    constructor() {

        this.userId = '';
        // this.userId = '606e0d76480bac4c3c87429f';
        this.user = {};
        this.currentStoryId = '';
        // this.otherUser = false;
        this.currentEvent = 0;
        this.currentPhoto = 0;
        this.watchedUser = {}

        makeObservable(this, {
            userId: observable,
            user: observable,
            currentStoryId: observable,
            currentEvent: observable,
            currentPhoto: observable,
            watchedUser: observable,
            // otherUser: observable,
            fetchUser: action,
            getStory: action,
            handleNext: action,
            handleBack: action,
            changeEvent: action,
            formerPhoto: action,
            nextPhoto: action,
            moveToFirstPhoto: action,
            resetStories: action,
            getColoredMarkers: action,
            login: action,
            setUserId: action,
            registerUser: action,
            signOut: action
        })
    }

    fetchUser = async() => {
      const user = await axios.get(`/user/${this.userId}`);
      this.user = user.data;
      // this.user.stories.forEach(s => {
      //   s.events.forEach(e => {
      //     e.marker = L.marker([e.coordinates.latitude, e.coordinates.longtitude]);
      //   })
      // })
      this.getColoredMarkers('user');
    }

    getStory = storyId => this.currentStoryId = storyId;

    resetStories() {
      this.currentStoryId = '';
      this.currentEvent = 0;
      this.currentPhoto = 0;
    }

    handleNext = () => this.currentEvent++;
    handleBack = () => this.currentEvent--;
    changeEvent = num => this.currentEvent = num;

    formerPhoto = () => this.currentPhoto--;
    nextPhoto = () => this.currentPhoto++;
    moveToFirstPhoto = () => this.currentPhoto = 0;


    getColoredMarkers(user) {
      const colors = ['blue', 'gold', 'red', 'orange', 'yellow', 'violet', 'black'];

      const currentUser = user === 'user' ? this.user : this.watchedUser;

      currentUser.stories.forEach((s, index) => {
        s.color = colors[index % 7];
        const icon = new L.Icon({
          iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${s.color}.png`,
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        s.events.forEach(e => {
          e.marker = L.marker([e.coordinates.latitude, e.coordinates.longtitude], {icon: icon});
        })
      })
    }

    fetchWatchedUser = async(id) => {
      const user = await axios.get(`/watchedUser/${id}`);
      this.watchedUser = user.data;
      // this.otherUser = (id === this.userId) ? false : true;
      this.getColoredMarkers('watchedUser');
    }

    async login(email, password) {
      try {
        const userId = await axios.post(`/authenticate`, {email, password});
        this.userId = userId.data;
        localStorage.setItem('userId', userId.data);
        return 'ok';
      }
      catch (err) {
        return err.response.data.error;
      }
    }

    setUserId = userId => this.userId = userId;

    async registerUser(newUser) {
      try {
        const userId = await axios.post(`/user`, newUser);
        if (userId.data.error) {return userId.data.error}
        this.userId = userId.data;
        localStorage.setItem('userId', userId.data);
        return "ok";
      }
      catch (err) {
        return err.response.data.error;
      }
    }
    
    signOut() {
      this.userId = '';
      this.user = {};
    }
}

// const greenIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });
// this.user.stories.forEach(s => {
//   s.events.forEach(e => {
//     e.marker = L.marker([e.coordinates.latitude, e.coordinates.longtitude], {icon: greenIcon});