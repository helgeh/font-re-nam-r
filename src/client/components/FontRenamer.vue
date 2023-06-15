<template>

  <v-icon
    class="mb-5"
    color="success"
    icon="mdi-check-circle"
    size="112"
  ></v-icon>

  <h1 class="mb-4">FontReNamR</h1>

  <v-divider class="mb-4"></v-divider>

  <form action="/upload" method="post" enctype="multipart/form-data">

    <p class="mb-4">
        
      <v-file-input label="Font Files" name="fonts" id="fonts" multiple variant="underlined"></v-file-input>

      <br>

        <v-text-field label="Font Name" id="nyttnavn" name="nyttnavn" variant="underlined"></v-text-field>
    </p>

    <v-divider class="mb-4"></v-divider>

    <div class="text-end">
      <v-btn
        variant="outlined"
        width="120"
        type="submit"
      >
        Last opp
      </v-btn>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const hello = ref({})

fetch('/api/v1/hello')
  .then(r => r.json())
  .then(({message}) => {
    hello.value = message
  })


const first = ref('')
const last = ref('')
const email = ref('')
const password = ref('')
const terms = ref(false)
</script>


<style scoped>
.read-the-docs {
  color: #888;
}
</style>
