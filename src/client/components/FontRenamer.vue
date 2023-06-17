<template>

  <v-sheet
    elevation="12"
    max-width="600"
    rounded="lg"
    width="100%"
    class="pa-4 mx-auto"
  >

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

    <v-form action="/upload" method="post" enctype="multipart/form-data" @submit.prevent="submit($event)" ref="form">

      <p class="mb-4">
        <v-file-input :rules="fileRules" label="last opp filer" name="fonts" id="fonts" multiple variant="underlined"></v-file-input>
        <br>
        <v-text-field :rules="textRules" label="velg nytt navn" id="nyttnavn" name="nyttnavn" variant="underlined"></v-text-field>
      </p>

      <v-divider class="mb-4"></v-divider>

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

    </v-form>

    <a href="#" ref="anchor"></a>

    <v-alert 
      variant="outlined"
      color="warning"
      icon="$warning"
      class="mt-4"
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

  </v-sheet>

  <v-card
    class="mx-auto mt-8"
    max-width="400"
    rounded="lg"
    elevation="11"
    v-if="zipItems.length > 0"
  >
    <v-list density="compact" @click:select="onClickSelectVList" v-model:selected="selected" ref="zipList">
      <v-list-item
        v-for="(item, i) in zipItems"
        :key="i"
        :value="item"
        color="primary"
        select-strategy="classic"
        @click="onClickZip(i)"
      >
        <v-list-item-title v-text="item.text"></v-list-item-title>
        <template v-slot:append>
          <v-btn rounded="xl" size="small" color="deep-orange-lighten-1" variant="outlined" class="ms-2" @click.stop="onClickRemoveZip(i)">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-card>

  <v-dialog
    v-model="removeDialog"
    width="auto"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        Slette
      </v-card-title>
      <v-card-text>Slette filen <strong>{{ zipToRemove.replace('/zips/', '') }}</strong>?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="onRemoveCancel"
        >
          Nei fader jeg trykte feil!
        </v-btn>
        <v-btn
          color="red-darken-1"
          variant="text"
          @click="onRemoveConfirm"
        >
          Yup, slett!
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
  import { ref, watch } from 'vue'
  import axios from 'axios'

  const alert = ref('')
  const anchor = ref(null)
  const zipItems = ref([])
  const zipList = ref(null)
  const selected = ref([])
  const removeDialog = ref(false)
  const zipToRemove = ref('')
  const form = ref(null)
  const fileRules = ref([value => value.length > 0 && value[0] instanceof File || 'vennligst velg fil(er)'])
  const textRules = ref([value => value && value.length > 0 || 'vennligst velg nytt navn'])


  // event handlers ----------------------------------------


  const submit = async (event) => {
    closeAlert()
    const { valid } = await form.value.validate()
    if (!valid)
      return
    const data = new FormData(event.target)
    axios({
      url: '/upload', 
      method: 'post', 
      data
    })
      .then(response => {
        if (response && response.data.downloadUrl) {
          downloadZip(response.data.downloadUrl)
        }
        form.value.reset()
        fetchZips()
      })
      .catch(showError)
  }

  const closeAlert = () => {
    alert.value = ''
  }

  const onClickSelectVList = (val) => {
    // if (!val.value)
    //   return
    // console.log('onClickSelectVList', val.id.value)
  }

  const onClickZip = (index) => {
    const item = zipItems.value[index]
    downloadZip(item.value)
  }

  const onClickRemoveZip = (index) => {
    const item = zipItems.value[index]
    removeZip(item)
  }


  // helper functions --------------------------------------


  // get list of zips
  function fetchZips(argument) {
    fetch('/ziplist')
      .then(res => {
        res.json().then(json => {
          // console.log(json)
          zipItems.value = json.files.map(file => {
            return {
              key: Date.now(),
              text: file.fileName,
              value: file.path
            }
          })
        })
      })
  }

  function downloadZip(url) {
    anchor.value.setAttribute('href', url)
    anchor.value.click()
  }

  function removeZip(item) {
    zipToRemove.value = item.value
    removeDialog.value = true
  }

  function onRemoveConfirm() {
    removeDialog.value = false
    axios({
      url: '/removeZip', 
      method: 'get', 
      params: {
        zipName: zipToRemove.value.replace('/zips/', '').replace('.zip', '')
      }
    })
      .then(response => {
        if (response && response.data.ok) {
          zipItems.value = zipItems.value.filter(itm => itm.value !== zipToRemove.value)
        }
      })
      .catch(showError)
  }

  function onRemoveCancel() {
    removeDialog.value = false
    zipToRemove.value = ''
  }

  function showError(err) {
    let msg = ''
    if (err && err.response) {
      if (err.response.data instanceof Blob) {
        const reader = new FileReader()
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
  }


  // initialize --------------------------------------------


  fetchZips()

  // watch the <selected> array and de-select everything always
  watch(selected, async (cur, old) => {
    if (cur.length > 0) {
      zipList.value.select(zipItems.value.indexOf(cur[0], false))
    }
  })


</script>


<style scoped>
  .v-btn--size-small {
    min-width: 40px;
  }
</style>
