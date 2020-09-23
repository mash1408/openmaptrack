import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.console.log(self.geoElementLine.geometry.coordinates[length - 1], 
        [e.latlng.lng, e.latlng.lat]);
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      geoJson: {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Point", "coordinates": [73.93798828125,
                15.44309082346371]
            },
            "properties": {
              "assetStatus": "FULL",
              "id": 1747,
              "item": "53 Trailer"
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Point", "coordinates": [72.2900390625,
                14.859850400601037]
            },
            "properties": {
              "assetStatus": "LOADED",
              "id": 1745,
              "item": "53 Trailer"
            }
          }
        ]
      }

    },
    mutations: {
      addGeoElement: (state, geoElement) => {
        console.log('mutate');
        console.log(JSON.stringify(geoElement, null, 2));
        state.geoJson['features'].push(geoElement);

        console.log('GeoJson');
        console.log(JSON.stringify(state.geoJson, null, 2));
      }
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    // strict: process.env.DEV
  })

  return Store
}
