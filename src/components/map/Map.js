import { makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react'
import {inject, observer} from 'mobx-react';
import { MapContainer, TileLayer, Marker, Popup, leaflet } from 'react-leaflet';
import Search from './Search';
import L from 'leaflet';

const Map = inject('UserStore', 'MapStore')(observer((props) => {
    const {UserStore, MapStore} = props;
    const useStyles = makeStyles(() => ({
        map: {

        }
    }))
    const classes = useStyles();

      useEffect(() => {
        MapStore.map = L.map('map', {center: [39.63, 3.33], zoom: 3, minZoom: 3, maxNativeZoom: 22, layers: [L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWlsb245MCIsImEiOiJja2lkaG1nZ2wwMWM3MnJsYmt0NmhjaXd4In0.FIqX_7bwQX0hh3o8FJj8Vg", {attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', maxZoom: 20, tileSize: 512, zoomOffset: -1})]});
        MapStore.handleClick();
    }, [])

    return (
        <div className = {classes.map}>
            <div id="map" style = {{height: '100%', width: '100%', zIndex: '1'}}></div>
            <Search/>
            {/* <MapContainer style = {{height: '100%', width: '100%', zIndex: '1'}} center={[39.63, 3.33]} bounds = {MapStore.bounds} zoom={3} scrollWheelZoom={true}>
            <TileLayer
                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                url='https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWlsb245MCIsImEiOiJja2lkaG1nZ2wwMWM3MnJsYmt0NmhjaXd4In0.FIqX_7bwQX0hh3o8FJj8Vg' id = 'mapbox/streets-v11' maxZoom = {19} minZoom = {3} />
            <Marker position={[51.505, -0.09]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            <MapActs/>
            </MapContainer> */}
        </div>
    )
}))

export default Map;