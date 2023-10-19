<template>
  <div class="podcast-search">
    <div class="podcast-search__form">
      <div class="podcast-search__form__radio-group">
        <div
          v-for="(season, index) in series"
          :key="index"
          class="podcast-search__form__radio"
        >
          <input
            type="radio"
            :id="`series-${season.id}`"
            :value="season.id"
            v-model="params.podcasts_series"
          />
          <label :for="`series-${season.id}`">{{ season.name }}</label>
        </div>
      </div>
    </div>
    <TransitionGroup
      name="stagged-fade"
      tag="div"
      class="podcast-search__results"
      @before-enter="beforeEnter($event)"
      @enter="onEnter($event)"
      @leave="onLeave($event)"
    >
      <a
        v-for="(post, index) in posts"
        :key="index"
        :data-index="index"
        class="podcast-search__post"
        :href="post.link"
      >
        <div class="podcast-search__post__image">
          <img
            v-if="post.imageSrc"
            :src="post.imageSrc"
            :srcset="post.imageSrcset"
          />
        </div>
        <div class="podcast-search__post__content">
          <p v-if="post.episode" class="podcast-search__post__episode">
            {{ `Episode ${post.episode}` }}
          </p>
          <h3 class="podcast-search__post__heading">{{ post.title }}</h3>
        </div>
      </a>
    </TransitionGroup>
    <div class="buttons">
      <button
        v-if="showMore"
        @click="getMorePosts()"
        class="podcast-seach__load-more button button--wide"
        :class="{ 'button--loading': loading }"
      >
        Load more
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        posts: [],
        series: [],
        params: {
          page: 1,
          // eslint-disable-next-line camelcase
          per_page: 10,
          orderby: 'episode',
          order: 'desc',
          // eslint-disable-next-line camelcase
          podcasts_series: 0,
        },
        loading: false,
        total: 0,
        totalPages: 0,
        staggerDelay: 50,
      };
    },
    watch: {
      // eslint-disable-next-line func-names
      'params.podcasts_series': function () {
        this.filterPosts();
      },
    },
    mounted() {
      this.getSeries();
      this.getPosts();
    },
    computed: {
      showMore() {
        return this.params.page < this.totalPages || this.loading;
      },
    },
    methods: {
      async getSeries() {
        this.loading = true;

        await this.axios
          .get('podcasts_series', {
            params: {
              // eslint-disable-next-line camelcase
              per_page: 100,
              orderby: 'name',
              order: 'desc',
            },
          })
          .then((response) => {
            this.series = response.data;
          });

        if (this.series.length) {
          const [firstSeries] = this.series;
          // eslint-disable-next-line camelcase
          this.params.podcasts_series = firstSeries.id;
        }

        this.loading = false;
      },
      async getPosts() {
        this.loading = true;

        const params = { ...this.params };

        await this.axios
          .get('podcasts', {
            params,
          })
          .then((response) => {
            const posts = [];

            response.data.forEach((post) => {
              posts.push({
                link: post.link,
                title: post.title.rendered,
                excerpt: post.excerpt.rendered,
                episode: post.episode,
                imageSrc: post.featured_image_src,
                imageSrcset: post.featured_image_srcset,
              });
            });
            this.posts = this.posts.concat(posts);
            this.total = parseInt(response.headers['x-wp-total'], 10);
            this.totalPages = parseInt(response.headers['x-wp-totalpages'], 10);
          });

        this.loading = false;
      },
      getMorePosts() {
        if (this.showMore) {
          this.params.page += 1;
          // eslint-disable-next-line camelcase
          this.params.per_page = 9;
          this.params.offset = 10;
          this.getPosts();
        }
      },
      filterPosts() {
        this.posts = [];
        this.params.page = 1;
        // eslint-disable-next-line camelcase
        this.params.per_page = 10;
        delete this.params.offset;
        this.getPosts();
      },
      beforeEnter(el) {
        // eslint-disable-next-line no-param-reassign
        el.style.opacity = 0;
      },
      onEnter(el) {
        const delay = el.dataset.index * this.staggerDelay;
        setTimeout(() => {
          // eslint-disable-next-line no-param-reassign
          el.style.opacity = 1;
        }, delay);
      },
      onLeave(el) {
        // eslint-disable-next-line no-param-reassign
        el.style.display = 'none';
      },
    },
  };
</script>
