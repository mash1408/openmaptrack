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
        ]
      }

    },
    mutations: {
      addGeoElements: (state, features) => {
        console.log('mutate');
        state.geoJson.features = features
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
