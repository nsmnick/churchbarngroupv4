<template>
  <div class="app">
    <component :is="component" />
  </div>
</template>

<script>
  import WorkSearch from './WorkSearch.vue';
  import PodcastSearch from './PodcastSearch.vue';

  export default {
    name: 'App',
    components: {
      WorkSearch,
      PodcastSearch,
    },
    props: {
      component: {
        type: String,
        default: '',
      },
    },
  };
</script>
