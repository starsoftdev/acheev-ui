// @flow

import React, { Component } from 'react';
import { history } from 'components/ConnectedRouter';
import { geolocated } from 'react-geolocated';
import type { Map } from 'immutable';
import { Map as LMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon, icon as lIcon } from 'leaflet';
import scrollToElement from 'scroll-to-element';

import IconMapDoctor from 'images/sprite/Icon-Map-Doctor.png';
import IconMapDispensary from 'images/sprite/Icon-Map-Dispensary.png';
import IconMapLP from 'images/sprite/Icon-Map-LP.png';

import IconMapDoctorActive from 'images/sprite/Icon-Map-Doctor-active.png';
import IconMapDispensaryActive from 'images/sprite/Icon-Map-Dispensary-active.png';
import IconMapLPActive from 'images/sprite/Icon-Map-LP-active.png';

import IconMarkerShadow from 'images/sprite/marker-shadow.png';

import { DEFAULT_LAT, DEFAULT_LONG } from 'enum/constants';
import 'leaflet/dist/leaflet.css';
import BusinessItem from './BusinessItem';
import './styles.scss';

const markerIcons = {
  clinics: IconMapDoctor,
  dispensaries: IconMapDispensary,
  producers: IconMapLP,
};

const activeMarkerIcons = {
  clinics: IconMapDoctorActive,
  dispensaries: IconMapDispensaryActive,
  producers: IconMapLPActive,
};

type Props = {
  data: Map<string, Object>,
  province: Map<string, Object>,
  category: string,
  coords: Object,
  isGeolocationAvailable: boolean, // boolean flag indicating that the browser supports the Geolocation API
  isGeolocationEnabled: boolean, // boolean flag indicating that the user has allowed the use of the Geolocation API
  positionError: Object,
};

type State = {
  centerLocation: Array<number>,
  userLocation: Array<number>,
  mapZoom: number,
  selectedMarkerRef: string,
  isMapView: boolean,
};

class BusinessesList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const center = props.province.get('center');
    this.state = {
      centerLocation: [center.get('lat'), center.get('lng')],
      userLocation: [DEFAULT_LAT, DEFAULT_LONG],
      mapZoom: center.get('zoom'),
      selectedMarkerRef: '',
      isMapView: false,
    };
    this.markers = {};
  }

  componentWillReceiveProps(newProps) {
    const {
      coords,
      isGeolocationEnabled,
      isGeolocationAvailable,
      positionError,
      province,
    } = this.props;
    const detectedGeoLocation =
      !coords && newProps.coords && !newProps.positionError;

    if (
      isGeolocationEnabled &&
      isGeolocationAvailable &&
      !positionError &&
      detectedGeoLocation
    ) {
      this.setState({
        userLocation: [newProps.coords.latitude, newProps.coords.longitude],
      });
      if (province.get('value') === '') {
        this.setState({
          centerLocation: [newProps.coords.latitude, newProps.coords.longitude],
          mapZoom: 12,
        });
      }
      window.dispatchEvent(new Event('resize'));
    }
  }

  onClickViewOnMap = (data: Object) => {
    scrollToElement('#map', { offset: -15 });

    const latitude = data.getIn(['locations', 0, 'latLon', 0]) || DEFAULT_LAT;
    const longitude = data.getIn(['locations', 0, 'latLon', 1]) || DEFAULT_LONG;

    if (longitude && latitude) {
      this.setState({
        centerLocation: [latitude, longitude],
        mapZoom: 12,
      });
      setTimeout(() => {
        const slug = data.get('slug');
        if (this.markers[slug]) {
          this.markers[slug].leafletElement.openPopup();
        }
      }, 100);

      window.dispatchEvent(new Event('resize'));
    }
  };

  onPopupClose = () => {
    this.setState({ selectedMarkerRef: '' });
  };

  onPopupOpen = ref => {
    this.setState({ selectedMarkerRef: ref });
  };

  markers: { [string]: ?Marker };

  render() {
    const { data, province, category } = this.props;
    const provinceValue = province.get('value');
    let filteredData = null;
    this.markers = {};
    const markerIcon = lIcon({
      iconUrl: markerIcons[category],
      iconSize: [26, 41],
      iconAnchor: [13, 40],
      popupAnchor: [0, -42],
      shadowUrl: IconMarkerShadow,
      shadowSize: [41, 41],
      shadowAnchor: [13, 40],
    });
    const activeMarkerIcon = lIcon({
      iconUrl: activeMarkerIcons[category],
      iconSize: [26, 41],
      iconAnchor: [13, 40],
      popupAnchor: [0, -42],
      shadowUrl: IconMarkerShadow,
      shadowSize: [41, 41],
      shadowAnchor: [13, 40],
    });
    if (data) {
      if (provinceValue !== '') {
        filteredData = data
          .entrySeq()
          .filter(
            item =>
              item[1].getIn(['locations', 0, 'province']) === provinceValue
          );
      } else {
        filteredData = data.entrySeq();
      }
    }
    if (!data || (data && data.size === 0)) {
      return (
        <div className="businessesList">
          <div className="text-center row mb-lg">
            <div className="column">
              Sorry no businesses found in this province.
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="businessesList">
        <div className="text-center row mb-lg">
          <div className="shrink column">Showing {data.size} results</div>
        </div>
        <div className="text-center row">
          <div className="small-12 column large-5">
            <div className="businessesList__list small-12">
              {filteredData &&
                filteredData.map(([key, value]) => (
                  <BusinessItem
                    data={value}
                    key={key}
                    isMapView={this.state.isMapView}
                    onClickViewOnMap={this.onClickViewOnMap}
                    category={category}
                  />
                ))}
            </div>
          </div>
          <div
            className="small-12 large-7 column hide-for-small-only"
            style={{ position: 'relative' }}
          >
            <div id="map">
              <LMap
                center={this.state.centerLocation}
                zoom={this.state.mapZoom}
                attributionControl={false}
                doubleClickZoom
              >
                <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                <Marker
                  position={this.state.userLocation}
                  icon={divIcon({
                    className: 'businessList__iconUserLocation',
                    iconSize: [20, 20],
                    html:
                      '<svg viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle fill="#0a78b3" cx="50" cy="50" r="50"/></svg>',
                  })}
                >
                  <Popup>
                    <div>Current Location</div>
                  </Popup>
                </Marker>
                {filteredData &&
                  filteredData.map(([key, value]) => {
                    // see https://github.com/facebook/immutable-js/issues/667 for detailed description
                    const latitude =
                      value.getIn(['locations', 0, 'latLon', 0]) || DEFAULT_LAT;
                    const longitude =
                      value.getIn(['locations', 0, 'latLon', 1]) ||
                      DEFAULT_LONG;
                    const slug = value.get('slug').toString();
                    let icon = markerIcon;
                    let offsetIndex = 0;
                    if (slug === this.state.selectedMarkerRef) {
                      icon = activeMarkerIcon;
                      offsetIndex = 1000;
                    }

                    return (
                      <Marker
                        ref={input => {
                          this.markers[slug] = input;
                        }}
                        position={[latitude, longitude]}
                        icon={icon}
                        key={key}
                        riseOnHover
                        zIndexOffset={offsetIndex}
                      >
                        <Popup
                          onClose={this.onPopupClose}
                          onOpen={() => {
                            this.onPopupOpen(slug);
                          }}
                        >
                          <div>
                            <h4>{value.get('name')}</h4>
                            {value.get('telephone') && (
                              <div className="mb-sm">
                                {value.get('telephone')}
                              </div>
                            )}
                            {value.get('address') && (
                              <div className="mb-sm">
                                {value.get('address')}
                              </div>
                            )}
                            {value.get('website') && (
                              <div className="mb-sm">
                                {value.get('website')}
                              </div>
                            )}
                            <a
                              onClick={() =>
                                history.push(`/${category}/${slug}`)}
                              role="button"
                            >
                              View Full Profile
                            </a>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
              </LMap>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  userDecisionTimeout: 5000,
})(BusinessesList);
