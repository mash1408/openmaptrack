<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="transparent1">
      <q-toolbar > 

        <q-toolbar-title>
          OpenMapTrack
        </q-toolbar-title> 
        <q-space ></q-space>
        <q-btn flat round dense icon="map" v-on:click="goToMap"  />
        <q-btn flat round dense icon="home" v-on:click="goToLanding" />

      </q-toolbar>
    </q-header> 

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',
  methods: {
    goToLanding: function() {
      return this.$router.push("/index")
    },
    goToMap: function() {
      return this.$router.push('/')
    }
  },

  data () {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>

<style  scoped>
  .transparent1 {
    opacity: .9;
  }
</style>