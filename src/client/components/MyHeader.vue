<template>
	
  <div class="text-center">

    <v-icon
      class="mb-5"
      color="success"
      icon="mdi-archive-edit-outline"
      size="112"
    ></v-icon>

    <h1 class="mb-4">{{ title }}</h1>

  </div>

</template>

<script setup>

  defineProps(['title'])
  
</script>