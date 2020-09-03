<template>
    <label class="text-reader">
        <q-input id="t" unelevated flat type="file" accept=".csv" @change="loadFile"/>
    </label>
</template>

<script>
export default {
  methods: {
    loadFile (ev) {
      const file = ev.target.files[0]
      const reader = new FileReader()
      reader.onload = e => this.$emit('load', e.target.result)
      reader.readAsText(file)
    }
  }
}
</script>
<style>
</style>
