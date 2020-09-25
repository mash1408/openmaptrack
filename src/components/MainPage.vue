<template>
  <q-page class="">
    <div
      class="full-width q-pa-sm q-gutter-md fixed text-right	"
      style="z-index: 200;"
    >
      <q-btn
        class="customButtonStyle"
        label="Save"
        @click="save"
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
      <br> <br> <br>
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
      <!-- Delete layer Section -->
      <q-card
        class="q-mt-lg customStyleCard"
        v-if="showDeleteLayersSection"
      >
        <div class="center-contents">
          <h4>Click On Items You Wish To Delete</h4>

        </div>
        <div class="absolute-bottom center-contents">
          <p class="q-ml-xl absolute-left">Click cancel to <b>STOP</b></p>
          <q-btn
            class="q-mb-xs customButtonStyle"
            label="Cancel"
            @click="stopDeletingLayers();showDeleteLayersSection = false"
          />

        </div>
      </q-card>
      <!-- Edit Layer Section-Markers -->
      <q-card
        class="customStyleCard "
        v-if="showIconSection"
      >
        <div class="center-contents">
          <h3>Select Category</h3>
        </div>

        <div class="center-contents absolute-bottom">
          <q-btn
            class="q-ml-xs q-mb-xs q-mr-xs customButtonStyle"
            label="Car Parking"
            @click='editCar'
          />
          <q-btn
            class="q-ml-xs q-mb-xs q-mr-xs customButtonStyle"
            label="Bus Parking"
            @click='editBus'
          />
          <q-btn
            class="q-ml-xs q-mb-xs q-mr-xs customButtonStyle"
            label="Truck Parking"
            @click='editTruck'
          />
          <q-btn
            class=" q-ml-xs q-mb-xs q-mr-xs customButtonStyle"
            label="Taxi Parking"
            @click='editTaxi'
          />
          <q-btn
            class="q-mb-xs customButtonStyle closeButton"
            label="Close"
            @click="stopEditingMarkers();showIconSection = false"
          />
        </div>
      </q-card>
      <!-- Edit Layer-Section Lines -->
      <q-card
        class="customStyleCard "
        v-if="showLinesEditSection"
      >
        <div class="center-contents">
          <h3>Select Category</h3>
        </div>

        <div class="center-contents absolute-bottom">
          <q-btn
            class="q-mb-xs q-ml-xs q-mr-xs customButtonStyle"
            label="Green"
            @click="editLines('green');"
          />
          <q-btn
            class="q-mb-xs q-ml-xs q-mr-xs customButtonStyle"
            label="Purple"
            @click="editLines('purple');"
          />
          <q-btn
            class="q-mb-xs customButtonStyle closeButton"
            label="Close"
            @click="stopEditingLines();showLinesEditSection = false"
          />
        </div>
      </q-card>
      <!-- Edit Layer-Section Polygons -->
      <q-card
        class="customStyleCard "
        v-if="showPolygonsEditSection"
      >
        <div class="center-contents">
          <h3>Select Category</h3>
        </div>

        <div class="center-contents absolute-bottom">
          <q-btn
            class="q-mb-xs q-ml-xs q-mr-xs customButtonStyle"
            label="Green"
            @click="editPolygons('green');"
          />
          <q-btn
            class="q-mb-xs q-ml-xs q-mr-xs customButtonStyle"
            label="Purple"
            @click="editPolygons('purple');"
          />
          <q-btn
            class="q-mb-xs customButtonStyle closeButton"
            label="Close"
            @click="stopEditingPolygons();showPolygonsEditSection = false"
          />
        </div>
      </q-card>
      <!--Legend Section-->
      <q-btn-dropdown
        label="Legends"
        class="legend customButtonStyle"
        dropdown-icon="change_history"
      >
        <q-list>
          <q-item
            v-for="list in legendData"
            :key="list.label"
          >
            <q-item-section><img
                class="icon"
                :src="list.source"
              ></q-item-section>
            <q-item-section>
              <q-item-label>{{list.label}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-avatar
                square
                bordered
                color="green"
                class="icon"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Unknown</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-avatar
                square
                bordered
                color="purple"
                class="icon"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Unknown</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <!--legend end--->
    </div>
    <!-- Edit/Delete and Reset buttons -->
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
        label="Edit Markers"
        @click="showIconSection=true"
      />
      <q-btn
        class="customButtonStyle"
        label="Edit Lines"
        @click="showLinesEditSection=true"
      />
      <q-btn
        class="customButtonStyle"
        label="Edit Polygons"
        @click="showPolygonsEditSection=true"
      />
      <q-btn
        class="customButtonStyle"
        label="Delete GeoElement"
        @click="deleteLayers();showDeleteLayersSection=true"
      />

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
      layerGroupLines: new L.layerGroup(),
      layerGroupMarkers: new L.layerGroup(),
      layerGroupPolygons: new L.layerGroup(),
      layerGroupRectangles: new L.layerGroup(),
      layerGroupCircles: new L.layerGroup(),
      layerGroupCircleMarkers: new L.layerGroup(),
      createdGeoElements: "",
      popUpOptions: {
        autoPan: true,
        autoClose: false
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
      L.control.attribution({ prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps" target="_blank">Leaflet</a> | 2020 © <a href="https://freethink.co.in/" target="_blank">freeTHINK(India)</a> | © <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a>' }).addTo(self.map)

      this.createdGeoElements = new L.FeatureGroup()
      this.drawControl = new L.Control.Draw({
        position: 'bottomright',
        draw: {

          circlemarker: true,
          rectangle: true,
          circle: true,
          toolbar: {
            buttons: {
              polygon: 'Draw an awesome polygon'
            }
          },

          circle: {
            shapeOptions: {
              color: 'steelblue'
            },
          },
          marker: {

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
              color: 'red'
            },
          },
          polygon: {
            showArea: true,
            showLength: true,
            metric: ['km', 'm'],
            shapeOptions: {
              color: 'red'
            },
          }
        }
      });
      self.map.addControl(this.drawControl);

      self.map.on("draw:created", function (e) {
        self.isleftDrawerOpen = true;
        var layerType = e.layerType;
        var layer = e.layer;
        if (layerType === 'marker') {
          self.drawMarker();
          self.layerGroupMarkers.addLayer(layer);
          self.addPopupsToMarkers(layer);
        }
        else if (layerType === 'polyline') {
          self.drawLine();
          self.layerGroupLines.addLayer(layer);
          self.addPopupsToLines(layer);
        }
        else if (layerType === 'polygon') {
          self.drawPolygon();
          self.layerGroupPolygons.addLayer(layer);
          self.addPopupsToPolygons(layer);
        }
        else if (layerType === 'rectangle') {
          self.drawRectangle();
          console.log('ping')
          self.layerGroupRectangles.addLayer(layer);
          console.log(JSON.stringify(self.layerGroupRectangles.toGeoJSON(), null, 2))
          self.addPopupsToRectangles(layer);
        }
        else if (layerType === 'circle') {
          self.drawCircle();
          self.layerGroupCircles.addLayer(layer);
          self.addPopupsToCircles(layer);
        }
        else if (layerType === 'circlemarker') {
          self.drawCircleMarkers();
          self.layerGroupCircleMarkers.addLayer(layer);
          self.addPopupsToCircleMarkers(layer);
        }
      });

      this.baseLayerGroup.addTo(this.map);

      this.layerGroupCircles.addTo(this.map)
      this.layerGroupRectangles.addTo(this.map)
      this.layerGroupLines.addTo(this.map);
      this.layerGroupMarkers.addTo(this.map);
      this.layerGroupPolygons.addTo(this.map);
      this.layerGroupCircleMarkers.addTo(this.map)

      //Render the geoJson data onto the map
      //this.addLayerToMap();
    },
    // Create additional Control placeholders


    /***************************************************GeoJson-related Functions******************************************************/
    save () {
      var lines = this.layerGroupLines.toGeoJSON();
      var circles = this.layerGroupCircles.toGeoJSON();
      var circleMarkers = this.layerGroupCircleMarkers.toGeoJSON();
      var rectangles = this.layerGroupRectangles.toGeoJSON()
      var markers = this.layerGroupMarkers.toGeoJSON();
      var polygons = this.layerGroupPolygons.toGeoJSON();
      var allFeatures = lines.features.concat(markers.features.concat
        (polygons.features.concat
          (circles.features.concat
            (rectangles.features.concat(circleMarkers.features)))));

      console.log(JSON.stringify(allFeatures, null, 2))
      this.$store.commit('addGeoElements', allFeatures);
      // this.addLayerToMap();
    },
    reset () {
      this.layerGroupLines.clearLayers()
      this.layerGroupMarkers.clearLayers()
      this.layerGroupPolygons.clearLayers()
      this.layerGroupCircles.clearLayers()
      this.layerGroupRectangles.clearLayers()
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
    /***************************************************Popup Functions******************************************************/
    addPopupsToLines (layer) {
      var self = this
      layer.bindPopup('Lines', self.popUpOptions);
      //no need to turn off the event as it is supposed to be on till the end
      layer.on('mouseover', function (e) {
        layer.openPopup();
      })

    },
    addPopupsToPolygons (layer) {
      var self = this
      layer.bindPopup('Polygons', self.popUpOptions);
      //no need to turn off the event as it is supposed to be on till the end
      layer.on('mouseover', function (e) {
        layer.openPopup();
      })

    },
    addPopupsToCircleMarkers (layer) {
      var self = this
      layer.bindPopup('Markers', self.popUpOptions);
      //no need to turn off the event as it is supposed to be on till the end
      layer.on('mouseover', function (e) {
        layer.openPopup();
      })

    },
    addPopupsToMarkers (layer) {
      var self = this
      layer.bindPopup('Markers', self.popUpOptions);
      //no need to turn off the event as it is supposed to be on till the end
      layer.on('mouseover', function (e) {
        layer.openPopup();
      })

    },
    addPopupsToRectangles (layer) {
      var self = this
      layer.bindPopup('Rectangles', self.popUpOptions);
      //no need to turn off the event as it is supposed to be on till the end
      layer.on('mouseover', function (e) {
        layer.openPopup();
      })

    },
    addPopupsToCircles (layer) {
      var self = this
      layer.bindPopup('circles', self.popUpOptions);
      //no need to turn off the event as it is supposed to be on till the end
      layer.on('mouseover', function (e) {
        layer.openPopup();
      })

    },
    /***************************************************Draw Functions******************************************************/
    drawMarker () {
      //using a pointer to this object, as this does'nt reference within the on query
      var self = this;
      this.map.on("draw:drawstop", function (e) {
        console.log('Draw end marker');
        self.map.off("draw:drawstop");
      })

    },
    drawLine () {
      //using a pointer to this object, as this does'nt reference within the on query
      var self = this;
      this.map.on("draw:drawstop", function (e) {
        console.log("draw end line")
        self.map.off("draw:drawstop");
      });

    },
    drawPolygon () {
      //using a pointer to this object, as this does'nt reference within the on query
      var self = this;
      this.map.on("draw:drawstop", function (e) {
        console.log('draw end polygon')
        self.map.off("draw:drawstop");
      });

    },
    drawCircle () {
      //using a pointer to this object, as this does'nt reference within the on query
      var self = this;
      this.map.on("draw:drawstop", function (e) {
        console.log('draw end circle')
        self.map.off("draw:drawstop");
      });

    },
    drawCircleMarkers () {
      //using a pointer to this object, as this does'nt reference within the on query
      var self = this;
      this.map.on("draw:drawstop", function (e) {
        console.log('draw end circle')
        self.map.off("draw:drawstop");
      });
      console.log(' stop draw circle marker')
    },
    drawRectangle () {
      //using a pointer to this object, as this does'nt reference within the on query
      var self = this;
      this.map.on("draw:drawstop", function (e) {
        console.log('draw end rectangle')
        self.map.off("draw:drawstop");
      });

    },

    /***************************************************Edit/Delete Functions******************************************************/

    editLines (col) {
      this.layerGroupLines.eachLayer(function (layer) {
        layer.on('click', function (e) {
          layer.setStyle({
            color: col
          })

        });
      });
    },
    editPolygons (col) {
      this.layerGroupPolygons.eachLayer(function (layer) {
        layer.on('click', function (e) {
          layer.setStyle({
            color: col
          })
        });
      });
    },
    updateMarkersIcon (icon, layer) {
      var feature = layer.feature = layer.feature || {};
      feature.type = "Feature"
      feature["properties"] = feature["properties"] || {};
      feature.properties["icon"] = icon;
    },
    editCar () {
      var self = this
      this.layerGroupMarkers.eachLayer(function (layer) {
        layer.on('click', function (e) {
          console.log(e);
          var icon = "https://image.flaticon.com/icons/png/512/51/51778.png"
          self.updateMarkersIcon(icon, layer)
          e.target._icon.setAttribute("src", icon)
        });
      });
      return;
    },
    editTruck () {
      var self = this
      this.layerGroupMarkers.eachLayer(function (layer) {
        layer.on('click', function (e) {
          console.log(e);
          var icon = "https://www.iconfinder.com/data/icons/eldorado-transport/40/truck_1-512.png"
          self.updateMarkersIcon(icon, layer)
          e.target._icon.setAttribute("src", icon)
        });
      });
      return;
    },
    editBus () {
      var self = this
      this.layerGroupMarkers.eachLayer(function (layer) {
        layer.on('click', function (e) {
          console.log(e);
          var icon = "https://cdn.iconscout.com/icon/premium/png-256-thumb/bus-1734816-1471755.png"
          self.updateMarkersIcon(icon, layer)
          e.target._icon.setAttribute("src", icon)
        });
      });
      return;
    },
    editTaxi () {
      var self = this
      this.layerGroupMarkers.eachLayer(function (layer) {
        layer.on('click', function (e) {
          console.log(e);
          var icon = "https://www.iconfinder.com/data/icons/car-11/100/taxi3-512.png"
          self.updateMarkersIcon(icon, layer)
          e.target._icon.setAttribute("src", icon)
        });
      });
      return;
    },
    stopEditingMarkers () {
      var self = this
      this.layerGroupMarkers.eachLayer(function (layer) {

        console.log('Markers stop');
        layer.off('click');

      })
    },
    stopEditingPolygons () {
      var self = this;
      this.layerGroupPolygons.eachLayer(function (layer) {

        console.log('Polygons stop');
        layer.off('click');

      })
    },
    stopEditingLines () {
      var self = this;
      this.layerGroupLines.eachLayer(function (layer) {

        console.log('Lines stop');
        layer.off('click');

      })
    },
    stopDeletingLayers () {
      var self = this
      this.layerGroupMarkers.eachLayer(function (layer) {
        console.log('stop')
        layer.off('click')
      })
      this.layerGroupLines.eachLayer(function (layer) {
        console.log('stop')
        layer.off('click')
      })
      this.layerGroupPolygons.eachLayer(function (layer) {
        console.log('stop')
        layer.off('click')
      })
    },
    deleteLayers () {
      var self = this
      this.layerGroupMarkers.eachLayer(function (layer) {
        layer.on('click', function (e) {
          console.log('deleted')
          self.layerGroupMarkers.removeLayer(layer)
          layer.off('click')
        })
      })
      this.layerGroupLines.eachLayer(function (layer) {
        layer.on('click', function (e) {
          console.log('deleted')
          self.layerGroupLines.removeLayer(layer)
          layer.off('click')
        })
      })
      this.layerGroupPolygons.eachLayer(function (layer) {
        layer.on('click', function (e) {
          console.log('deleted')
          self.layerGroupPolygons.removeLayer(layer)
          layer.off('click')
        })
      })
    },
    setCoordinates (lng, lat) {
      if (this.selectPoint == true) {
        // console.log(lng,lat)
        this.point = lng + ',' + lat
      }
    },
    /***************************************************Manual Add Functions******************************************************/
    AddPoint () {

      var coords = this.point.split(',')
      var marker = L.marker([coords[0], coords[1]])
      this.layerGroupMarkers.addLayer(marker)
      this.point = ''
    },
    // Convert () {
    //   var temp = []
    //   var lines = this.text.split('\n')
    //   for (var i = 0; i < lines.length; i++) {
    //     var obj = {
    //       'type': '',
    //       'coordinates': []
    //     }
    //     var currentline = lines[i].split(',')
    //     obj.type = currentline[0]
    //     for (var j = 1; j < currentline.length; j++) {
    //       currentline[j] = parseFloat(currentline[j])
    //     }
    //     if (currentline[0] === 'Point') { for (j = 1; j < currentline.length; j = j + 2) { obj.coordinates.push(currentline[j], currentline[j + 1]) } }
    //     if (currentline[0] === 'LineString') { for (j = 1; j < currentline.length; j = j + 2) { obj.coordinates.push([currentline[j], currentline[j + 1]]) } }
    //     if (currentline[0] === 'Polygon') { for (j = 1; j < currentline.length; j = j + 2) { temp.push([currentline[j], currentline[j + 1]]) } obj.coordinates.push(temp) }
    //     this.myLines.push(obj)
    //     this.myLinesString.push(JSON.stringify(obj))
    //     console.log(this.myLines)
    //   }
    //   this.text = ''
    // },
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
          properties: {},
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
  background-color: #ff702d;
}
.legend-box {
  text-align: center;
  width: 200px;
  margin-left: 0px;
  background: rgba(210, 146, 133, 0.7);
}
.box {
  margin-top: -12px;
}
</style>

<style lang="stylus" scoped>
.legend {
  position: absolute;
  left: 0px;
  margin-top: 120px;
  width: 160px;
}

.legendlist {
  background: rgba(210, 146, 133, 0.7);
}

.icon {
  height: 30px;
  width: 30px;
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
  float: right;
}

.center-contents {
  text-align: center;
}
</style>

