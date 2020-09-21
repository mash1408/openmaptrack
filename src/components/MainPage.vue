<template>
  <q-page class="">
    <div
      class="full-width q-pa-sm q-gutter-md fixed text-right	"
      style="z-index: 200;"
    >
      <q-btn
        class="customButtonStyle"
        label="Select from Map"
        @click="selectPointFromMap"
      />
      <q-btn
        class="customButtonStyle"
        label="Draw Polygon"
        @click="drawPolygon"
      />
      <q-btn
        class="customButtonStyle"
        label="Draw Marker"
        @click="drawMarker"
      />
      <q-btn
        class="customButtonStyle"
        label="Draw Line"
        @click="drawLine"
      />
      <q-btn
        class="customButtonStyle"
        label="Add Point"
        @click="ShowPointSection = true"
      />
      <q-btn
        class="customButtonStyle"
        label="CSV To geoJSON"
        @click="ShowCsvSection = true"
      />

      <q-card
        class="q-my-md bg-white"
        v-if="ShowPointSection"
      >
        <q-card-section>
          <q-input
            v-model="point"
            label="Coordinates"
          />
        </q-card-section>
        <q-card-section class="q-gutter-md">

          <q-btn
            class="customButtonStyle"
            label="Add"
            @click="AddPoint"
          />
          <q-btn
            class="customButtonStyle"
            label="Close"
            @click="ShowPointSection = false"
          />
        </q-card-section>
      </q-card>

      <q-card
        class="q-my-md bg-white"
        v-if="ShowCsvSection"
      >
        <q-card-section class="q-gutter-sm row items-start">
          <div id="app">
            <FileReader @load="text=$event"></FileReader>
            <textarea
              rows="8"
              cols="74"
              v-model="text"
            ></textarea>
            <br>
          </div>
          <div>
            <div>
              <q-btn
                @click="Convert"
                class="customButtonStyle"
                label="Convert to geoJSON"
              />
            </div>
            <br>
            <textarea
              rows="8"
              cols="74"
              v-model="myLinesString"
            ></textarea>
          </div>
          <q-btn
            class="customButtonStyle"
            label="Add to Map"
            @click="Add"
          />
          <q-btn
            class="customButtonStyle"
            label="Close"
            @click="ShowCsvSection = false"
          />

        </q-card-section>
      </q-card>

    </div>
    <div class="full-width">
      <div id="mapCanvas"></div>
    </div>
  </q-page>
</template>

<script>
import FileReader from './FileReader'

export default {
  name: 'app',
  data () {
    return {
      map: '',
      text: '',
      point: '',
      myLines: [],
      myLinesString: [],
      ShowPointSection: false,
      ShowCsvSection: false,
      selectPoint: false,
      geoElementMarker: {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
          ]
        }
      },
      geoElementLine: {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
          ]
        }
      },
      geoElementPolygon: {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
          ]
        }
      },
      createdGeoElements: ""
    }
  },
  components: {
    FileReader
  },

  computed: {
    localTiles5To6: function () {
      return 'https://maptrack.in/tiles1588/5To6Ind/{z}/{x}/{y}.png'
    },
    localTiles7To10: function () {
      return 'https://maptrack.in/tiles1588/7To10Ind/{z}/{x}/{y}.png'
    },
    localTiles11To15: function () {
      return 'https://maptrack.in/tiles1588/11To15Go/{z}/{x}/{y}.png'
    },
    localTiles16To17: function () {
      return 'https://maptrack.in/tiles1588/16To17Go/{z}/{x}/{y}.png'
    },
    localTiles18Panaji: function () {
      return 'https://maptrack.in/tiles1588/18Panaji/{z}/{x}/{y}.png'
    },
    geoJson: function () {
      //retrieve the geoJson object from store
      return this.$store.state.geoJson;
    }

  },
  methods: {

    initMap () {
      var self = this

      var baseLayer = self.getBaseMap()

      self.map = L.map('mapCanvas', {
        center: [15.464213, 73.849571],
        zoom: 10,
        minZoom: 5,
        maxZoom: 25,
        layers: [baseLayer],
        attributionControl: false,
        worldCopyJump: true
      })

      L.control.scale({ metric: true, imperial: false }).addTo(self.map)
      L.control.attribution({ prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps" target="_blank">Leaflet</a> | 2020 © <a href="https://freethink.co.in/" target="_blank">freeTHINK(India)</a> | © <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a>' }).addTo(self.map)
      self.map.on('click', function (e) {
        self.setCoordinates(e.latlng.lng, e.latlng.lat);
      });
      this.createdGeoElements = new L.FeatureGroup();
      this.drawControl = new L.Control.Draw({
        position: "bottomright",
        draw: {
          rectangle: false,
          circle: false,
          circlemarker: false,
          polygon: false,
          polyline: false,
          featureGroup: self.createdGeoElements
        }
      });
      self.map.addControl(this.drawControl);

      self.map.on("draw:created", function (e) {
        self.isleftDrawerOpen = true;
        var layerType = e.layerType;
        var layer = e.layer;
        self.createdGeoElements.addLayer(layer);
        self.map.addLayer(self.createdGeoElements);
      });
      //add the geoJson object to the map
      this.addGeoJsonToMap();


    },
    addGeoElementPolygon () {
      this.$store.commit('addGeoElement', this.geoElementPolygon);
      this.addGeoJsonToMap();
      this.createdGeoElements += 1;
    },
    addGeoElementMarker () {
      this.$store.commit('addGeoElement', this.geoElementMarker);
      this.addGeoJsonToMap();
      this.createdGeoElements += 1;
    },
    addGeoElementLine () {
      this.$store.commit('addGeoElement', this.geoElementLine);
      this.addGeoJsonToMap();
      this.createdGeoElements += 1;

    },
    addGeoJsonToMap () {
      //bug needs to be fixed-->'this statement superimposes the modified layer over the existing layer'
      L.geoJSON(this.geoJson, {
        style: function (feature) {
          return { color: 'purple' };// change the style properties here
        },
        onEachFeature: function (feature) {
          //changes for individual features to be made here
        }
      }).bindPopup(function (layer) {
        return 'layer';
      }).addTo(this.map);
    },
    drawMarker () {
      //using a pointer to this object, as this does'nt reference within the on query
      var self = this;
      this.map.on('mousedown', function (e) {
        if (self.geoElementMarker.geometry.coordinates.length === 0) {
          self.geoElementMarker.geometry.coordinates.push(e.latlng.lng);
          self.geoElementMarker.geometry.coordinates.push(e.latlng.lat);
        }
        else {
          self.geoElementMarker.geometry.coordinates[0] = e.latlng.lng;
          self.geoElementMarker.geometry.coordinates[1] = e.latlng.lat;
        }

        self.addGeoElementMarker();
        self.map.off('mousedown');
      });
    },
    drawLine () {
      //using a pointer to this object, as this does'nt reference within the on query
      var self = this;
      this.map.on('mousedown', function (e) {
        length = self.geoElementLine.geometry.coordinates.length;
        //checking if the current clicked point is the same as the previously added point
        if (JSON.stringify(self.geoElementLine.geometry.coordinates[length - 1]) ===
          JSON.stringify([e.latlng.lng, e.latlng.lat])) {
          console.log('end');
          self.map.off('mousedown');
        }
        else {//push the coordinates to the appropriate local data element (geoElement)
          self.geoElementLine.geometry.coordinates.push([e.latlng.lng, e.latlng.lat]);
        }
        self.addGeoElementLine();
      });

    },
    drawPolygon () {
      //using a pointer to this object, as this does'nt reference within the on query
      var self = this;
      this.map.on('mousedown', function (e) {
        //checking if the current clicked point is the same as the first point
        if (JSON.stringify(self.geoElementPolygon.geometry.coordinates[0]) ===
          JSON.stringify([e.latlng.lng, e.latlng.lat])) {
          console.log('end');
          self.map.off('mousedown');//put off the event listener
        }
        else {//push the coordinates to the appropriate local data element (geoElement)
          self.geoElementPolygon.geometry.coordinates.push([e.latlng.lng, e.latlng.lat]);
        }
      });
      this.addGeoElementPolygon(this.geoElementPolygon);
    },

    setCoordinates (lng, lat) {
      if (this.selectPoint == true) {
        // console.log(lng,lat)
        this.point = lng + "," + lat;
      }
    },

    Add () {
      var lin = this.myLines
      L.geoJSON(lin).addTo(this.map)
    },

    selectPointFromMap () {
      this.drawCursor = new L.Draw.Marker(this.map, this.drawControl.options.marker);
      this.drawCursor.enable()
    },

    AddPoint () {
      var lines = this.point.split('\n')
      for (var i = 0; i < lines.length; i++) {
        var obj = {
          'type': '',
          'coordinates': []
        }
        var currentline = lines[i].split(',')
        obj.type = 'Point'
        for (var j = 0; j < currentline.length; j++) {
          currentline[j] = parseFloat(currentline[j])
        }
        for (j = 0; j < currentline.length; j = j + 2) {
          obj.coordinates.push(currentline[j], currentline[j + 1])
        }
        this.myLines = []
        this.myLines.push(obj)
        this.myLinesString.push(JSON.stringify(obj))
        console.log(this.myLines)
      }
      this.text = ''
      this.Add();
    },

    Add () {
      var lin = this.myLines
      console.log(lin[0].coordinates[0])
      console.log(lin[0].coordinates[1])
      for (var i = 0; i < lin.length; i++) {
        var lng = lin[i].coordinates[0]
        var lat = lin[i].coordinates[1]
        L.marker([lng, lat]).addTo(this.map);
      }
      // L.geoJSON(lin).addTo(this.map)
    },

    Convert () {
      var temp = []
      var lines = this.text.split('\n')
      for (var i = 0; i < lines.length; i++) {
        var obj = {
          'type': '',
          'coordinates': []
        }
        var currentline = lines[i].split(',')
        obj.type = currentline[0]
        for (var j = 1; j < currentline.length; j++) {
          currentline[j] = parseFloat(currentline[j])
        }
        if (currentline[0] === 'Point') { for (j = 1; j < currentline.length; j = j + 2) { obj.coordinates.push(currentline[j], currentline[j + 1]) } }
        if (currentline[0] === 'LineString') { for (j = 1; j < currentline.length; j = j + 2) { obj.coordinates.push([currentline[j], currentline[j + 1]]) } }
        if (currentline[0] === 'Polygon') { for (j = 1; j < currentline.length; j = j + 2) { temp.push([currentline[j], currentline[j + 1]]) } obj.coordinates.push(temp) }
        this.myLines.push(obj)
        this.myLinesString.push(JSON.stringify(obj))
        console.log(this.myLines)
      }
      this.text = ''
    },

    getBaseMap: function () {
      var southWest5to6 = L.latLng(3.776559, 55.986328), northEast5to6 = L.latLng(36.456636, 104.501953), boundSet5to6 = L.latLngBounds(southWest5to6, northEast5to6)
      var southWest7to10 = L.latLng(4.653080, 67.763672), northEast7to10 = L.latLng(29.573457, 89.208984), boundSet7to10 = L.latLngBounds(southWest7to10, northEast7to10)
      var southWest11To15 = L.latLng(14.636739, 73.350220), northEast11To15 = L.latLng(15.911150, 74.437866), boundSet11To15 = L.latLngBounds(southWest11To15, northEast11To15)
      var southWest16To17 = L.latLng(14.881087, 73.666077), northEast16To17 = L.latLng(15.813396, 74.358215), boundSet16To17 = L.latLngBounds(southWest16To17, northEast16To17)

      var baseLayer = L.layerGroup([L.tileLayer(this.localTiles5To6, { maxZoom: 6, minZoom: 5, bounds: boundSet5to6 }),
      L.tileLayer(this.localTiles7To10, { maxZoom: 10, minZoom: 7, bounds: boundSet7to10 }),
      L.tileLayer(this.localTiles11To15, { maxZoom: 15, minZoom: 11, bounds: boundSet11To15 }),
      L.tileLayer(this.localTiles16To17, { maxZoom: 25, maxNativeZoom: 17, minZoom: 16, bounds: boundSet16To17 }),
      L.tileLayer(this.localTiles18Panaji, { maxZoom: 25, maxNativeZoom: 18, minZoom: 18 })])
      return baseLayer
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style>
#mapCanvas {
  z-index: 100;
  height: 100vh;
  position: relative;
}

textarea {
  background-color: #fff;
}
body {
  background-color: rgb(158, 158, 158);
}
.customButtonStyle {
  color: #fff;
  background-color: #ff702d;
}
</style>
