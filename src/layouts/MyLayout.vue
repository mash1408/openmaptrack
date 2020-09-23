<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="transparent1">
      <q-toolbar > 
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        /> 

        <q-toolbar-title>
          CSV to GeoJSON
        </q-toolbar-title> 

      </q-toolbar>
    </q-header> 


    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          This a link
        </q-item>  
      </q-list>
    </q-drawer> 

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',

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