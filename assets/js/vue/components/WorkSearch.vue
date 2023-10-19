<template>
  <div class="work-search">
    <div class="work-search__form">
      <select v-model.number="params.work_categories" @change="filterPosts()">
        <option value="0">All work</option>
        <option
          v-for="(category, index) in categories"
          :key="index"
          :value="category.id"
          v-html="category.name"
        ></option>
      </select>
    </div>
    <TransitionGroup
      name="stagged-fade"
      tag="div"
      class="work-search__results"
      @before-enter="beforeEnter($event)"
      @enter="onEnter($event)"
      @leave="onLeave($event)"
    >
      <template v-for="(post, index) in posts" :key="index">
        <template v-if="index === 0">
          <div :data-index="index" class="work-search__post">
            <div class="work-search__post__image">
              <img
                v-if="post.imageCtaSrc"
                :src="post.imageCtaSrc"
                :srcset="post.imageCtaSrcset"
                alt=""
              />
              <img
                else-if="post.imageSrc"
                :src="post.imageSrc"
                :srcset="post.imageSrcset"
                alt=""
              />
            </div>
            <div class="work-search__post__content">
              <p v-if="post.clientName" class="work-search__post__client">
                {{ post.clientName }}
              </p>
              <h3 class="work-search__post__heading">{{ post.title }}</h3>
              <div
                v-if="post.excerpt"
                class="work-search__post__excerpt"
                v-html="post.excerpt"
              ></div>
              <div class="buttons buttons--left">
                <a class="button button--arrow-right" :href="post.link">
                  View case study
                </a>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <a :data-index="index" class="work-search__post" :href="post.link">
            <div class="work-search__post__image">
              <img
                v-if="post.imageSrc"
                :src="post.imageSrc"
                :srcset="post.imageSrcset"
                alt=""
              />
            </div>
            <div class="work-search__post__content">
              <p v-if="post.clientName" class="work-search__post__client">
                {{ post.clientName }}
              </p>
              <h3 class="work-search__post__heading">{{ post.title }}</h3>
            </div>
          </a>
        </template>
      </template>
    </TransitionGroup>
    <div class="buttons">
      <button
        v-if="showMore"
        @click="getMorePosts()"
        class="work-seach__load-more button button--wide"
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
        categories: [],
        params: {
          page: 1,
          // eslint-disable-next-line camelcase
          per_page: 13,
          // eslint-disable-next-line camelcase
          orderby: 'menu_order',
          order: 'asc',
          // eslint-disable-next-line camelcase
          work_categories: 0,
        },
        loading: false,
        total: 0,
        totalPages: 0,
        staggerDelay: 50,
      };
    },
    mounted() {
      this.getCategories();
      this.getPosts();
    },
    computed: {
      showMore() {
        return this.params.page < this.totalPages || this.loading;
      },
    },
    methods: {
      async getCategories() {
        this.loading = true;

        await this.axios
          // eslint-disable-next-line camelcase
          .get('work_categories', { per_page: -1 })
          .then((response) => {
            this.categories = response.data;
          });

        this.loading = false;
      },
      async getPosts() {
        this.loading = true;

        const params = { ...this.params };

        if (params.work_categories === 0) {
          delete params.work_categories;
        }

        await this.axios
          .get('work', {
            params,
          })
          .then((response) => {
            const posts = [];

            response.data.forEach((post) => {
              posts.push({
                link: post.link,
                title: post.title.rendered,
                excerpt: post.excerpt.rendered,
                clientName: post.client_name,
                imageSrc: post.featured_image_src,
                imageSrcset: post.featured_image_srcset,
                imageCtaSrc: post.featured_cta_image_src,
                imageCtaSrcset: post.featured_cta_image_srcset,
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
          this.params.per_page = 12;
          this.params.offset = 13;
          this.getPosts();
        }
      },
      filterPosts() {
        this.posts = [];
        this.params.page = 1;
        // eslint-disable-next-line camelcase
        this.params.per_page = 13;
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
