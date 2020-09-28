<template>
  <q-page class="">
    <!-- Left Sidebar -->
    <q-drawer
      v-model="drawer"
      show-if-above
      side="right"
      :width="300"
      :breakpoint="500"
      :height="500"
      elevated
      bordered
      overlay
    >

      <q-scroll-area
        class="fit"
        style="height: 200px; max-width: 300px;"
      >
        <q-list padding>
          <!--  Close Drawer -->
          <q-btn
            flat
            round
            dense
            icon="close"
            v-on:click="drawer=!drawer"
          />
          <!-- Collapsible list -->
          <q-list
            bordered
            class="rounded-borders sidebar-list"
          >
            <!-- Add Manually -->
            <q-expansion-item
              expand-separator
              v-model="manualAdd"
              icon=""
              label="Add Manually"
              caption="Select Category"
            >
              <q-card class="q-my-md bg-white">
                <q-card-section>
                  <p> Enter coordinates for point</p>
                  <q-input
                    v-model="point"
                    label="Coordinates"
                  />
                  <q-btn
                    class="q-ml-xs q-mt-xs customButtonStyle"
                    label="Add"
                    @click="AddPoint"
                  />
                  <q-btn
                    class="q-ml-xs q-mt-xs customButtonStyle"
                    label="Close"
                    @click="manualAdd=false"
                  />
                </q-card-section>
                <q-card-section class="q-gutter-md">

                </q-card-section>
                <q-card-section>
                  <p> Enter coordinates for Line</p>
                  <q-input
                    v-model="polylineCoords"
                    label="Coordinates"
                  />
                  <q-btn
                    class="q-ml-xs q-mt-xs customButtonStyle"
                    label="Add"
                    @click="addPolyline"
                  />
                  <q-btn
                    class=" q-ml-xs q-mt-xs customButtonStyle"
                    label="Close"
                    @click="manualAdd=false"
                  />
                </q-card-section>
                <q-card-section>
                  <p> Enter coordinates for Polygon</p>
                  <q-input
                    v-model="polygonCoords"
                    label="Coordinates"
                  />
                  <q-btn
                    class=" q-ml-xs q-mt-xs customButtonStyle"
                    label="Add"
                    @click="addPolygon"
                  />
                  <q-btn
                    class=" q-ml-xs q-mt-xs customButtonStyle"
                    label="Close"
                    @click="manualAdd=false"
                  />
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <!-- add two more expansion list for csv to geoJson and download geoJson -->
            <q-expansion-item
              expand-separator
              icon=""
              label="CSV to GeoJSON"
              caption="Select Category"
            >
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

              <br> <br> <br>
              <!--  Card for converting to geoJSON -->
              <q-card
                class="q-my-md bg-white"
                v-if="ShowCsvSection"
              >
                <q-card-section class="q-gutter-sm row items-start">
                  <div id="app">
                    <FileReader @load="text=$event"></FileReader>
                    <textarea
                      style="resize:none"
                      rows="13"
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
                      style="resize:none"
                      rows="13"
                      cols="74"
                      v-model="geoJsonText"
                    ></textarea>
                  </div>
                  <q-btn
                    class="customButtonStyle"
                    label="Add to Map"
                    @click="AddToMap"
                  />
                  <q-btn
                    class="customButtonStyle"
                    label="Close"
                    @click="ShowCsvSection = false"
                  />

                </q-card-section>
              </q-card>
            </q-expansion-item>
            <!-- Help Section -->
            <q-expansion-item
              expand-separator
              v-model="manualAdd"
              icon=""
              label="Add Manually"
              caption="Select Category"
            >

            </q-expansion-item>

          </q-list>
        </q-list>
      </q-scroll-area>

    </q-drawer>

    <div
      class="full-width q-pa-sm q-gutter-md fixed text-center "
      style="z-index: 200;"
    >

      <q-btn
        round
        color="red"
        icon="directions"
        @click="drawer=!drawer"
      />
      <!-- save dialog -->
      <q-btn
        class="customButtonStyle"
        label="Save"
        @click="confirmSave=true"
      />
      <q-dialog
        v-model="confirmSave"
        persistent
      >
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar
              icon="cloud_upload"
              color="pink-10"
              text-color="white"
            />
            <span class="q-ml-sm">This will save the changes globally</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Cancel"
              class="customButtonStyle"
              v-close-popup
            />
            <q-btn
              flat
              label="Save"
              class="customButtonStyle"
              v-close-popup
              @click="save"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- save end -->
      <!-- reset -->
      <q-btn
        class="customButtonStyle"
        label="Reset"
        @click="confirmReset=true"
      />
      <q-dialog
        v-model="confirmReset"
        persistent
      >
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar
              icon="layers_clear"
              color="pink-10"
              text-color="white"
            />
            <span class="q-ml-sm">Are you sure you want to reset</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Keep Working"
              class="customButtonStyle"
              v-close-popup
            />
            <q-btn
              flat
              label="OK"
              class="customButtonStyle"
              v-close-popup
              @click="reset"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- reset end -->

      <!--Legend Section-->
      <q-btn-dropdown
        label="Legends"
        class="legend customButtonStyle "
        dropdown-icon="change_history"
      >
        <q-list dense>
          <q-item
            v-for="list in legendData"
            :key="list.label"
          >
            <q-item-section avatar>
              <img
                class="icon"
                :src="list.source"
              >
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-caption">{{list.label}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-avatar
                square
                bordered
                color="green"
                class="icon"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-caption">Unknown</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-avatar
                square
                bordered
                color="purple"
                class="icon"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-caption">Unknown</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <!--legend end--->
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
      drawer: true,
      miniState: true,
      map: '',
      text: '',
      geoJsonText: '',
      point: '',
      myLines: [],
      myLinesString: [],
      ShowPointSection: false,
      ShowCsvSection: false,
      selectPoint: false,
      showPolygoneSection: false,
      showPolylineSection: false,
      showIconSection: false,
      showDeleteLayersSection: false,
      showLinesEditSection: false,
      showPolygonsEditSection: false,
      polygonCoords: [],
      polylineCoords: [],
      baseLayerGroup: new L.layerGroup(),
      layerGroupCentral: new L.layerGroup(),

      layerGroupType: new L.layerGroup(),
      createdGeoElements: "",
      qmarkers: false,
      qlines: false,
      qpolygons: false,
      qcirclemarkers: false,
      qrectangles: false,
      qcircles: false,
      manualAdd: false,
      del: false,
      confirmSave: false,
      confirmReset: false,
      defaultIcon: "",
      popUpContentMarker: '',
      popUpOptions: {
        autoPan: true,
        autoClose: true,
        'className': 'custom-popup'
      },
      legendData: this.$store.state.legendMarker
    }
  },
  components: {
    FileReader,

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
      // retrieve the geoJson object from store
      return this.$store.state.geoJson
    },
    geoJsonFeatures () {
      return this.$store.state.geoJson.features
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
      L.control.attribution({
        prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps" target="_blank">Leaflet</a> | 2020 © <a href="https://freethink.co.in/" target="_blank">freeTHINK(India)</a> | © <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> |  <a href="https://www.flaticon.com/auth title="A JS library for interactive maps" target="_blank">Leaflet</a> | 2020 © <a href="https://freethink.co.in/" target="_blank">freeTHINK(India)</a> | © <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> Icon </a>'
      }).addTo(self.map)


      this.createdGeoElements = new L.featureGroup(this.layerGroupCentral).addTo(this.map)
      //Creating a custom icon
      this.defaultIcon = L.icon({
        iconUrl: '../statics/icons/map-marker.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [1, -30],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
      });

      this.drawControl = new L.Control.Draw({
        position: 'bottomleft',

        draw: {
          circlemarker: false,
          circle: false,
          marker: {
            icon: this.defaultIcon,
            shapeOptions: {
              riseOnHover: true,
            },
          },
          polyline: {
            allowIntersection: false,
            showLength: true,
            metric: ['km', 'm'],
            drawError: {
              color: '#b00b00',
              timeout: 2500
            },
            shapeOptions: {
              color: 'blue'
            },
          },
          polygon: {
            showArea: true,
            showLength: true,
            metric: ['km', 'm'],
            shapeOptions: {
              color: 'blue'
            },
          },
          rectangle: {
            showArea: true,
            showLength: true,
            metric: ['km', 'm'],
            shapeOptions: {
              color: 'blue'
            },
          }
        },
        edit: {
          featureGroup: this.createdGeoElements,
          remove: true,
          edit: false,
        }
      });
      self.map.addControl(this.drawControl);

      self.map.on("draw:created", function (e) {
        self.isleftDrawerOpen = true;
        var layerType = e.layerType;
        var layer = e.layer;
        if (layerType === 'marker') {
          self.draw(layer)
          layer.bindPopup(self.getPopUpMarker(layer), self.popUpOptions)
          self.createdGeoElements.addLayer(layer)
        }
        else if (layerType === 'polyline') {
          self.draw(layer)
          layer.bindPopup(self.getPopUpLine(layer), self.popUpOptions)
          self.createdGeoElements.addLayer(layer)
        }
        else if (layerType === 'polygon') {
          self.draw(layer)
          layer.bindPopup(self.getPopUpPolygon(layer), self.popUpOptions)
          self.createdGeoElements.addLayer(layer)
        }
        else if (layerType === 'rectangle') {
          self.draw(layer)
          layer.bindPopup(self.getPopUpRectangle(layer), self.popUpOptions)
          self.createdGeoElements.addLayer(layer)
        }
      });

      this.baseLayerGroup.addTo(this.map)

      this.layerGroupCentral.addTo(this.map)



      var colored = L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
        }
      );

      var baseMaps = {
        "BaseMap": baseLayer,
        "Colored": colored
      };

      var overlayMaps = {

      }
      this.map.zoomControl.setPosition('topleft')

      L.control.layers(baseMaps, null, { position: 'topleft' }).addTo(this.map);


      //Render the geoJson data onto the map
      //this.addLayerToMap();

    },
    /***************************************************GeoJson-related Functions******************************************************/
    getPopUpMarker (layer) {
      var container = L.DomUtil.create('div'),
        DeleteMarker = this.createButton('Delete Layer', container, "customButton"),
        p = this.createP('Select Type Of Parking', container, "customText")
      var carParking = this.createButton('', container, "carParking")
      var taxiParking = this.createButton('', container, "taxiParking")
      var truckParking = this.createButton('', container, "truckParking")
      var busParking = this.createButton('', container, "busParking")

      L.DomEvent.on(DeleteMarker, 'click', () => {
        this.layerGroupCentral.removeLayer(layer)
      });

      L.DomEvent.on(carParking, 'click', () => {
        this.updateIcon(layer, 'https://image.flaticon.com/icons/png/512/51/51778.png')
      });
      L.DomEvent.on(taxiParking, 'click', () => {
        this.updateIcon(layer, 'https://www.iconfinder.com/data/icons/car-11/100/taxi3-512.png')
      });
      L.DomEvent.on(truckParking, 'click', () => {
        this.updateIcon(layer, 'https://www.iconfinder.com/data/icons/eldorado-transport/40/truck_1-512.png')
      });
      L.DomEvent.on(busParking, 'click', () => {
        this.updateIcon(layer, 'https://cdn.iconscout.com/icon/premium/png-256-thumb/bus-1734816-1471755.png')
      });
      return container
    },
    getPopUpLine (layer) {
      var container = L.DomUtil.create('div'),
        DeleteMarker = this.createButton('Delete Layer', container, "customButton"),
        p = this.createP('What Type Of Parking Lot?', container, "customText")
      var paid = this.createButton('Paid', container, "customPaid"),
        unpaid = this.createButton('Free', container, "customUnpaid")
      L.DomEvent.on(DeleteMarker, 'click', () => {
        this.layerGroupCentral.removeLayer(layer)
      });

      L.DomEvent.on(unpaid, 'click', () => {
        this.editColor('green', layer)
      });
      L.DomEvent.on(paid, 'click', () => {
        this.editColor('red', layer)
      });
      return container
    },
    getPopUpPolygon (layer) {
      var container = L.DomUtil.create('div'),
        DeleteMarker = this.createButton('Delete Layer', container, "customButton"),
        p = this.createP('What Type Of Parking Lot?', container, "customText")
      var paid = this.createButton('Paid', container, "customPaid"),
        unpaid = this.createButton('Free', container, "customUnpaid")

      L.DomEvent.on(DeleteMarker, 'click', () => {
        this.layerGroupCentral.removeLayer(layer)
      });
      L.DomEvent.on(unpaid, 'click', () => {
        this.editColor('green', layer)
      });
      L.DomEvent.on(paid, 'click', () => {
        this.editColor('red', layer)
      });
      return container
    },
    getPopUpRectangle (layer) {
      var container = L.DomUtil.create('div'),
        DeleteMarker = this.createButton('Delete Layer', container, "customButton"),
        p = this.createP('What Type Of Parking Lot?', container, "customText")
      var paid = this.createButton('Paid', container, "customPaid"),
        unpaid = this.createButton('Free', container, "customUnpaid")

      L.DomEvent.on(DeleteMarker, 'click', () => {
        this.layerGroupCentral.removeLayer(layer)
      });
      L.DomEvent.on(unpaid, 'click', () => {
        this.editColor('green', layer)
      });
      L.DomEvent.on(paid, 'click', () => {
        this.editColor('red', layer)
      });
      return container
    },

    save () {
      var central = this.layerGroupCentral.toGeoJSON()
      console.log(JSON.stringify(central.features, null, 2))
      this.$store.commit('addGeoElements', central.features);
      // this.addLayerToMap();
    },
    draw (layer) {
      var self = this
      self.layerGroupCentral.addLayer(layer);
      // self.map.off("draw:draw");
    },
    reset () {
      this.layerGroupCentral.clearLayers()
    },
    createButton (label, container, className) {
      var btn = L.DomUtil.create('button', '', container);
      btn.setAttribute('type', 'button');
      btn.innerHTML = label;
      btn.className = className
      return btn;
    },
    createP (label, container, className) {
      var p = L.DomUtil.create('p', '', container);
      p.setAttribute('type', 'p');
      p.innerHTML = label;
      p.className = className
      return p;
    },
    getGeoJsonLayer () {
      var baseLayer = L.geoJSON(this.geoJson, {
        // style: function (feature) {
        //   return { color: 'yellow' };// change the style properties here
        // },
      }).bindPopup(function (layer) {
        return 'layer'
      })
      return baseLayer
    },
    addLayerToMap () {
      this.baseLayerGroup.addLayer(this.getGeoJsonLayer())
    },

    updateColor (col, layer) {
      var feature = layer.feature = layer.feature || {};
      feature.type = "Feature"
      feature["properties"] = feature["properties"] || {};
      feature.properties["color"] = col;
    },
    editColor (col, layer) {
      layer.setStyle({
        color: col
      })
      this.updateColor(col, layer)
    },
    updateIcon (layer, icon) {
      layer._icon.setAttribute("src", icon)
      console.log(layer)
      this.updateMarkersIcon()
    },
    updateMarkersIcon (icon, layer) {
      var feature = layer.feature = layer.feature || {};
      feature.type = "Feature"
      feature["properties"] = feature["properties"] || {};
      feature.properties["icon"] = icon;
    },

    /***************************************************Manual Add Functions******************************************************/
    AddPoint () {

      var coords = this.point.split(',')
      var marker = L.marker([coords[0], coords[1]])
      this.layerGroupMarkers.addLayer(marker)
      this.point = ''
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
      var polyline = L.polyline(coords, { color: 'red' });
      this.layerGroupLines.addLayer(polyline)
    },
    addPolygon () {
      var coords = []
      console.log(this.polygonCoords)
      // console.log(this.polygonCoords.length)
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
      var polygon = L.polygon(coords, { color: 'red' })
      this.layerGroupPolygons.addLayer(polygon);
    },

    // ############## Conversion Methods ##################################//
    // ** get data in csv format **//
    getCsvData () {
      if (this.geoJsonFeatures.length === 0) {
        return alert('No Geo Elements found on map!')
      }

      const data = this.geoJsonFeatures
      const reqData = data.map(row => ({
        geometry: row.geometry.type,
        coordinates: row.geometry.coordinates,
        icon: row.properties.icon ? row.properties.icon : ' '
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
    },

    /** ************   Convert csv text to JSON  ********************/
    converToJson (csv) {
      const geoJson = {
        type: 'FeatureCollection',
        features: []
      }
      const features = geoJson.features
      // console.log(geoJson);
      const records = csv.split('\n').splice(1)
      const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g

      records.forEach(record => {
        let data = record.split(regex)
        data = data.filter(value => {
          return value !== ',' && value !== ''
        })

        features.push({
          type: 'Feature',
          properties: {
            icon: data[2].replaceAll('"', '')
          },
          geometry: {
            type: data[0].replaceAll('"', ''),
            coordinates: this.parseCoords(data)
          }
        })
      })

      return geoJson
    },

    /** ************   Parse appropriate coordinates for different geometry  ********************/
    parseCoords (data) {
      const type = data[0].replaceAll('"', '')
      let coords = data[1].replaceAll('"', '').split(',')
      coords = coords.map(value => parseFloat(value))

      if (type === 'Point') {
        return coords
      } else if (type === 'LineString') {
        coords = this.splitIntoSubArray(coords, 2)
        return coords
      } else if (type === 'Polygon') {
        coords = this.splitIntoSubArray(coords, 2)
        coords = [coords]
        return coords
      }
    },

    //* *************   function to split 1D array to multi dimensional array  ********************/
    splitIntoSubArray (arr, count) {
      const newArray = []
      while (arr.length > 0) {
        newArray.push(arr.splice(0, count))
      }
      return newArray
    },

    //* *************   Convert csv text to geojson  ********************/
    Convert () {
      if (!this.text) {
        return alert('Upload a csv file!')
      }
      const json = this.converToJson(this.text)

      this.geoJsonText = JSON.stringify(json, null, 2)
      this.text = ''
    },

    //* *************   Add csv data to map  ********************/
    AddToMap () {
      if (!this.text) {
        return alert('Upload a csv file!')
      }
      const features = this.converToJson(this.text).features

      this.$store.commit('updateGeoElements', features)
      this.text = ''
      this.addLayerToMap()
      this.ShowCsvSection = false
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
  background-color: #720505;
}
.customText {
  color: rgb(104, 23, 9);
}
.customButton {
  color: #fff;
  background-color: #720505;
}
.customPaid {
  color: #fff;
  background-color: red;
}
.customUnpaid {
  color: #fff;
  background-color: green;
}
.carParking {
  background-image: url("https://image.flaticon.com/icons/png/512/51/51778.png");
  background-size: cover;
  width: 40px;
  height: 40px;
}
.busParking {
  background-image: url("https://cdn.iconscout.com/icon/premium/png-256-thumb/bus-1734816-1471755.png");
  background-size: cover;
  width: 40px;
  height: 40px;
}
.truckParking {
  background-image: url("https://www.iconfinder.com/data/icons/eldorado-transport/40/truck_1-512.png");
  background-size: cover;
  width: 40px;
  height: 40px;
}
.taxiParking {
  background-image: url("https://www.iconfinder.com/data/icons/car-11/100/taxi3-512.png");
  background-size: cover;
  width: 40px;
  height: 40px;
}
.custom-popup .leaflet-popup-content-wrapper {
  background: whitesmoke;
  color: #fff;
  font-size: 16px;
  /* line-height: 24px; */
}
.custom-popup .leaflet-popup-content-wrapper a {
  color: whitesmoke;
}

.leaflet-control-zoom {
  transform: translateY(-50%);
  top: 320px;
  bottom: 0;
}

.leaflet-touch .leaflet-bar {
  border: none;
  background-clip: padding-box;
}
.leaflet-bottom {
  bottom: 25px;
}
.leaflet-div-icon {
  background: radial-gradient(
    circle,
    rgb(238, 229, 233) 0%,
    rgba(80, 78, 78, 0.778) 81%
  );
  border: none;
  border-radius: 10px;
}

.sidebar-list q-btn {
  width: 100%;
}
</style>

<style lang="stylus" scoped>
.legend {
  position: absolute;
  left: 0px;
  margin-top: 35vh;
  width: 160px;
}

.legendlist {
  background: rgba(210, 146, 133, 0.7);
}

.icon {
  height: 20px;
  width: 20px;
}

.customButtonStyle {
  background-color: $accent;
}

.customStyleCard {
  top: 20px;
  height: 100px;
  background: rgba(210, 146, 133, 0.7);
}

.closeButton {
  float: center;
}

.center-contents {
  text-align: center;
}

.space {
  margin: 10px 15px;
}

.card_bg {
  background: rgba(210, 146, 133, 0.5);
}
</style>

