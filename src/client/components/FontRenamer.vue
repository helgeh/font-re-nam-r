<template>

  <div class="text-center">
    <v-icon
      class="mb-5"
      color="success"
      icon="mdi-archive-edit-outline"
      size="112"
    ></v-icon>

    <h1 class="mb-4">FontReNamR</h1>
  </div>

  <v-divider class="mb-4"></v-divider>

  <form action="/upload" method="post" enctype="multipart/form-data" @submit.prevent="submit($event)">

    <p class="mb-4">
        
      <v-file-input label="last opp filer" name="fonts" id="fonts" multiple variant="underlined"></v-file-input>

      <br>

        <v-text-field label="velg nytt navn" id="nyttnavn" name="nyttnavn" variant="underlined"></v-text-field>
    </p>

    <v-divider class="mb-4"></v-divider>

    <v-alert 
      variant="outlined"
      color="warning"
      icon="$warning"
      class="mb-4"
      title="Åh nei!"
      v-if="alert != ''"
      closable
    >
      <span v-html="alert"></span>
      <template v-slot:close="{ toggle }">
        <v-btn @click="closeAlert(toggle)">
          <v-icon icon="mdi-close" color="warning"></v-icon>
        </v-btn>
      </template>
    </v-alert>

    <div class="text-end">
      <v-btn
        variant="outlined"
        width="120"
        height="40"
        type="submit"
      >
        <v-icon icon="mdi-transfer-down" size="32"></v-icon>
      </v-btn>
    </div>
  </form>
  <a href="#" ref="anchor"></a>
</template>

<script setup>
import { ref } from 'vue'

// const hello = ref({})

// fetch('/api/v1/hello')
//   .then(r => r.json())
//   .then(({message}) => {
//     hello.value = message
//   })

  import axios from 'axios'

  const alert = ref('')

  const anchor = ref(null)

  const submit = (event) => {
    closeAlert()
    const data = new FormData(event.target)
    axios({
      url: '/upload', 
      method: 'post', 
      data
    })
      .then(response => {
        if (response && response.data.downloadUrl) {
          anchor.value.setAttribute('href', response.data.downloadUrl)
          anchor.value.click()
        }
      })
      .catch(err => {
        let msg = ''
        if (err && err.response) {
          if (err.response.data instanceof Blob) {
            var reader = new FileReader()
            reader.onload = function() {
                console.log(reader.result)
            }
            reader.readAsText(err.response.data)
          }
          else
            msg = err.response.data + '<br />'
        }
        msg += 'Prøv igjen eller hør med Helge hva som kan være feil...'
        alert.value = msg
      })
  }

  const closeAlert = () => {
    alert.value = ''
  }

</script>


<style scoped>
</style>
