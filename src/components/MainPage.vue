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
        label="check Geojson"
        @click="check"
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
        label="Add PolyLine"
        @click="showPolylineSection = true"
      />
      <q-btn
        class="customButtonStyle"
        label="Add Polygon"
        @click="showPolygoneSection = true"
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

      <q-btn
        class="customButtonStyle"
        label="Download CSV"
        @click="getCsvData"
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
      <q-card
        class="q-my-md bg-white"
        v-if="showPolylineSection"
      >
        <q-card-section>
          <q-input
            v-model="polylineCoords"
            label="Coordinates"
          />
        </q-card-section>
        <q-card-section class="q-gutter-md">

          <q-btn
            class="customButtonStyle"
            label="Add"
            @click="addPolyline"
          />
          <q-btn
            class="customButtonStyle"
            label="Close"
            @click="showPolylineSection = false"
          />
        </q-card-section>
      </q-card>
      <q-card
        class="q-my-md bg-white"
        v-if="showPolygoneSection"
      >
        <q-card-section>
          <q-input
            v-model="polygonCoords"
            label="Coordinates"
          />
        </q-card-section>
        <q-card-section class="q-gutter-md">

          <q-btn
            class="customButtonStyle"
            label="Add"
            @click="addPolygon"
          />
          <q-btn
            class="customButtonStyle"
            label="Close"
            @click="showPolygoneSection = false"
          />
        </q-card-section>
      </q-card>
    </div>
    <!-- Edit/Delete buttons -->
    <div
      class="full-width q-pa-sm q-gutter-md q-mt-xl fixed text-right"
      style="z-index: 200;"
    >
      <q-btn
        class="customButtonStyle"
        label="reset"
        @click="reset"
      />
      <q-btn
        class="customButtonStyle"
        label="Edit GeoElement"
        @click="editLayers"
      />
      <q-btn
        class="customButtonStyle"
        label="Delete GeoElement"
      />
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
      count: 545,
      map: '',
      text: '',
      point: '',
      myLines: [],
      myLinesString: [],
      ShowPointSection: false,
      ShowCsvSection: false,
      selectPoint: false,
      showPolygoneSection: false,
      showPolylineSection: false,
      polygonCoords: [],
      polylineCoords: [],
      first: false,
      geoElementMarker: {
        "type": "Feature",
        "geometry": {
          "type": "Point", "coordinates": []
        },
        "properties": {
          "assetStatus": "FULL",
          "id": 897,
          "item": "53 Trailer"
        }
      },
      geoElementLine: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
          ]
        }
      },
      geoElementPolygon: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
          ]
        }
      },
      markersCoords: [],
      baseLayerGroup: new L.layerGroup(),
      layerGroupLines: new L.layerGroup(),
      layerGroupMarkers: new L.layerGroup(),
      layerGroupPolygons: new L.layerGroup(),
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
    },
    geoJsonFeatures () {
      return this.$store.state.geoJson.features;
    },
    pushData () {
      this.features.push(this.geoElementMarker);
    }

  },
  methods: {
    /***************************************************Function running at startup ******************************************************/
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
      this.baseLayerGroup.addTo(this.map);
      this.layerGroupLines.addTo(this.map);
      this.layerGroupMarkers.addTo(this.map);
      this.layerGroupPolygons.addTo(this.map);
      //Render the geoJson data onto the map
      //this.addLayerToMap();
    },
    /***************************************************//////////////******************************************************/
    check () {
      this.baseLayerGroup.clearLayers();
      this.addLayerToMap();
    },
    reset () {
      this.layerGroupLines.clearLayers();
      this.layerGroupMarkers.clearLayers();
      this.layerGroupPolygons.clearLayers();
    },
    /***************************************************GeoJson-related Functions******************************************************/
    addGeoElementPolygon () {

      this.$store.commit('addGeoElement', this.geoElementPolygon);
    },
    addGeoElementMarker () {
      this.$store.commit('addGeoElement', this.geoElementMarker);

    },
    addGeoElementLine () {
      this.$store.commit('addGeoElement', this.geoElementLine);

    },
    getGeoJsonLayer () {
      var baseLayer = L.geoJSON(this.geoJson, {
        style: function (feature) {
          return { color: 'yellow' };// change the style properties here
        },
      }).bindPopup(function (layer) {
        return 'layer';
      });
      return baseLayer;
    },
    addLayerToMap () {
      this.baseLayerGroup.addLayer(this.getGeoJsonLayer());

    },
    /***************************************************PopUp Functions******************************************************/
    addPopupsToMarkers () {
      var i = 0;
      var self = this;
      // create popup contents-->change the url here to change the background image
      var customPopup = "<b>My office</b><br/><img src='https://cdn.pixabay.com/photo/2012/04/23/15/45/parking-38625_960_720.png' alt='maptime logo gif' width='150px'/>";

      // specify popup options 
      var customOptions =
      {
        'maxWidth': '400',
        'width': '200',
        'className': 'popupCustom'
      }
      //finally bind a popup to each layer
      this.layerGroupMarkers.eachLayer(function (layer) {
        layer.bindPopup(customPopup, customOptions).openPopup();
      });


    },
    addPopupsToLines () {
      var i = 0;
      var self = this;
      // create popup contents-->change the url here to change the background image
      var customPopup = "<b>My office</b><br/><img src='https://cdn.pixabay.com/photo/2012/04/23/15/45/parking-38625_960_720.png' alt='maptime logo gif' width='150px'/>";

      // specify popup options 
      var customOptions =
      {
        'maxWidth': '400',
        'width': '200',
        'className': 'popupCustom'
      }

      this.layerGroupLines.eachLayer(function (layer) {
        layer.bindPopup(customPopup, customOptions).openPopup();
      });
    },
    addPopupsToPolygons () {
      var i = 0;
      var self = this;
      // create popup contents-->change the url here to change the background image
      var customPopup = "<b>My office</b><br/><img src='https://cdn.pixabay.com/photo/2012/04/23/15/45/parking-38625_960_720.png' alt='maptime logo gif' width='150px'/>";

      // specify popup options 
      var customOptions =
      {
        'maxWidth': '400',
        'width': '200',
        'className': 'popupCustom'
      }
      this.layerGroupPolygons.eachLayer(function (layer) {
        layer.bindPopup(customPopup, customOptions).openPopup();
      });
    },
    /***************************************************Style Functions******************************************************/
    addStyleToMarkers () {

    },
    addStyleToPolygons () {

    },
    addStyleToLines () {

    },
    /***************************************************Drawing Functions******************************************************/
    drawMarker () {
      //using a pointer to this object, as this does'nt reference within the on query
      var self = this;
      self.drawCursor = new L.Draw.Marker(self.map, self.drawControl.options.marker);
      self.drawCursor.enable()
      //setup the event listener to fire after the marker is drawn
      this.map.on(L.Draw.Event.CREATED, function (e) {
        //getting the layer from the drawn shape(marker)
        var type = e.layerType,
          layer = e.layer;
        if (type === 'marker') {

        }
        //adding that layer to layerGroupMarkers
        self.layerGroupMarkers.addLayer(layer);
        self.addGeoElementMarker();
        self.addPopupsToMarkers();
        self.map.off(L.Draw.Event.CREATED);
      });
      this.map.on('mousedown', function (e) {
        //if there are no elements in the geoELement...coordinates
        if (self.geoElementMarker.geometry.coordinates.length === 0) {
          self.geoElementMarker.geometry.coordinates.push(e.latlng.lng);
          self.geoElementMarker.geometry.coordinates.push(e.latlng.lat);
        }
        else {
          self.geoElementMarker.geometry.coordinates[0] = e.latlng.lng;
          self.geoElementMarker.geometry.coordinates[1] = e.latlng.lat;
        }
        self.geoElementMarker.properties.id = this.count;
        self.count += 1;
        //putting off the mousedown event listener from map
        //since it is to be ran once only(one click for marker)
        self.map.off('mousedown');
      });

    },
    drawLine () {
      //using a pointer to this object, as this does'nt reference within the on query
      var self = this;
      var end = false;
      //Drawing polyline
      self.drawCursor = new L.Draw.Polyline(self.map, self.drawControl.options.marker);
      self.drawCursor.enable();
      //event listener setup to fire when shape is created
      this.map.on(L.Draw.Event.CREATED, function (e) {
        //getting the layer from the drawn shape
        var type = e.layerType,
          layer = e.layer;
        if (type === 'polyline') {

        }
        //adding that layer to the layerGroupLines
        self.layerGroupLines.addLayer(layer);

        self.map.off(L.Draw.Event.CREATED);
        end = true;
        //putting off the mousedown event listener from map
        self.map.off('mousedown');
        self.addPopupsToLines();
        //pushing data to geoJson in the store 
        self.addGeoElementLine();
        //flushing the existing data
        self.geoElementLine.geometry.coordinates.splice(0, self.geoElementLine.geometry.coordinates.length);
        console.log('end');
        return;
      });
      this.map.on('mousedown', function (e) {
        self.geoElementLine.geometry.coordinates.push([e.latlng.lng, e.latlng.lat]);
        //displaying the clicked points in tabular form
        console.table(self.geoElementLine.geometry.coordinates);
        console.log(e);

      })

    },
    drawPolygon () {
      //using a pointer to this object, as this does'nt reference within the on query
      var self = this;
      //for polygon we require array of arrays
      var coordinates = [];
      var end = false;
      this.map.on('mousedown', function (e) {
        //storing the points locally in the coordinates variable
        coordinates.push([e.latlng.lng, e.latlng.lat]);
        //displaying the points in tabular form
        console.table(coordinates)
        console.log(e);

      })
      self.drawCursor = new L.Draw.Polygon(self.map, self.drawControl.options.marker);
      self.drawCursor.enable()
      //setup the event listener to fire after the shape is drawn
      this.map.on(L.Draw.Event.CREATED, function (e) {
        var type = e.layerType,
          //getting the layer of the drawn shape
          layer = e.layer;
        if (type === 'polygon') {
        }
        //add that layer to the layerGroupPolygon group
        self.layerGroupPolygons.addLayer(layer);
        coordinates.push(coordinates[0]);
        self.geoElementPolygon.geometry.coordinates.push(coordinates);
        self.map.off(L.Draw.Event.CREATED);
        self.addPopupsToPolygons();
        end = true;
        // Ensure that last point's coordinates are same as first

        // just to crosscheck before pushing into the geoElement GeoJson
        console.table(self.geoElementPolygon.geometry.coordinates);
        self.addGeoElementPolygon();
        //flushing the existing data 
        self.geoElementPolygon.geometry.coordinates.splice(0, self.geoElementPolygon.geometry.coordinates.length);
        console.log('end');
        self.map.off('mousedown');
        return;
      });

    },
    /***************************************************Edit/Delete Functions******************************************************/
    editLayers () {
      this.layerGroupMarkers.eachLayer(function (layer) {
        layer.on('mouseover', function (e) {
          console.log(e);
        });
      });

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
    },
    addPolyline () {
      var coords = []
      console.log(this.polylineCoords)
      var lines = this.polylineCoords.split(' ')
      for (let i = 0; i < lines.length; i++) {
        var cooordinates = []
        var currentLines = lines[i].split(',')
        for (let j = 0; j < currentLines.length; j++) {
          currentLines[j] = parseFloat(currentLines[j])
        }
        for (let j = 0; j < currentLines.length; j = j + 2) {
          cooordinates.push(currentLines[j], currentLines[j + 1])
          console.log(cooordinates)
          coords.push(cooordinates)
        }
      }
      console.log(coords)
      var polyline = L.polyline(coords, { color: 'red' }).addTo(this.map);
    },
    addPolygon () {
      var coords = []
      console.log(this.polygonCoords)
      //console.log(this.polygonCoords.length)
      var lines = this.polygonCoords.split(' ')
      for (let i = 0; i < lines.length; i++) {
        var cooordinates = []
        var currentLines = lines[i].split(',')
        for (let j = 0; j < currentLines.length; j++) {
          currentLines[j] = parseFloat(currentLines[j])
        }
        for (let j = 0; j < currentLines.length; j = j + 2) {
          cooordinates.push(currentLines[j], currentLines[j + 1])
          console.log(cooordinates)
          coords.push(cooordinates)
        }
      }
      console.log(coords)
      var polygon = L.polygon(coords, { color: 'red' }).addTo(this.map);
    },

    // ############## Conversion Methods ##################################//
    // ** get data in csv format **//
    getCsvData () {
      const data = this.geoJsonFeatures
      const reqData = data.map(row => ({
        geometry: row.geometry.type,
        coordinates: row.geometry.coordinates
      }))
      const csvData = this.convertoCsv(reqData)
      console.log(csvData)
      this.download(csvData)
    },

    /* Convert geojson object to csv */
    convertoCsv (data) {
      const csvRows = []

      // get the headers
      const headers = Object.keys(data[0])
      csvRows.push(headers.join(','))

      // loop over the rows
      for (const row of data) {
        const values = headers.map(header => {
          const escaped = ('' + row[header]).replace(/"/g, '\\"')
          return `"${escaped}"`
        })
        csvRows.push(values.join(','))
      }
      // console.log(csvRows);

      return csvRows.join('\n')
    },
    /* Download csv file */
    download (data) {
      const blob = new Blob([data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.setAttribute('hidden', '')
      a.setAttribute('href', url)
      a.setAttribute('download', 'data.csv')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
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
.popupCustom .leaflet-popup-tip,
.popupCustom .leaflet-popup-content-wrapper {
  background: linear-gradient(
    0deg,
    rgba(34, 193, 195, 1) 0%,
    rgba(253, 187, 45, 1) 95%
  );
  color: white;
  opacity: 0.95;
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
