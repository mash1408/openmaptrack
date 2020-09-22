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
            "properties": {
              "description": ""
            },
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    73.78143310546875,
                    15.396755841628917
                  ],
                  [
                    73.90502929687499,
                    15.437795920240932
                  ],
                  [
                    73.0316162109375,
                    15.358356179450597
                  ],
                  [
                    73.4600830078125,
                    15.252389472825634
                  ],
                  [
                    73.78143310546875,
                    15.396755841628917
                  ]
                ]
              ]
            }
          },
        ]
      }
    },
    mutations: {
      addGeoElement: (state, geoElement) => {
        console.log('mutate');
        console.log(geoElement.geometry.coordinates);
        // var pGeoElement = JSON.parse(geoElement);
        // var pGeoJson = JSON.parse(state.geoJson);
        state.geoJson.features.push(geoElement);

      }
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    // strict: process.env.DEV
  })

  return Store
}
