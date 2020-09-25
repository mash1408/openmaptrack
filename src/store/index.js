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
        'type': 'FeatureCollection',
        'features': [
        ]
      },
      legendMarker:[
        {
          label: 'Car Parking',
          source: 'https://image.flaticon.com/icons/png/512/51/51778.png'
        },
        {
          label: 'Bus Parking',
          source: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/bus-1734816-1471755.png'
        },
        {
          label: 'Truck Parking',
          source: 'https://www.iconfinder.com/data/icons/eldorado-transport/40/truck_1-512.png'
        },
        {
          label: 'Taxi Parking',
          source: 'https://www.iconfinder.com/data/icons/car-11/100/taxi3-512.png'
        }
      ]
    },
    mutations: {
      addGeoElements: (state, features) => {
        console.log('mutate')
        state.geoJson.features = features
        console.log('GeoJson')
        console.log(JSON.stringify(state.geoJson, null, 2))
      },

      updateGeoElements (state, newFeatures) {
        state.geoJson.features = state.geoJson.features.concat(newFeatures)
        console.log(state.geoJson.features)
      }

    }

    // enable strict mode (adds overhead!)
    // for dev mode only
    // strict: process.env.DEV
  })

  return Store
}
