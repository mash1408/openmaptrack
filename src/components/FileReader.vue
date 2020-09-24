<template>
    <label  class="text-reader">
        <q-input filled id="t"  type="file" accept=".csv" @input="val => { readCsv(val[0]) }"/>
    </label>
</template>

<script>
export default {
  methods: {
    // loadFile (ev) {
    //   const file = ev.target.files[0]
    //   const reader = new FileReader()
    //   reader.onload = e => this.$emit('load', e.target.result)
    //   reader.readAsText(file)
    // }

    // ###################### read csv file ###########################
    readCsv (file) {
      // console.log(e.target.files);
      // const file = e.target.files[0];
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        const csv = reader.result.trim()
        this.$emit('load', csv)
        // console.log(csv);
        // const geoJson = this.converToJson(csv);
        // this.convertedJson = JSON.stringify(geoJson, null, 2);
        // console.log(JSON.stringify(geoJson));
      }
    }

  }
}
</script>
<style>
</style>
