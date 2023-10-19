import { createApp, h } from 'vue';
import VueAxios from 'vue-axios';
import axios from 'axios';
import App from './components/App.vue';

export default function initVue() {
  const rootEl = document.getElementById('vue-app');

  if (rootEl !== null) {
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    axios.defaults.baseURL = '/wp-json/wp/v2/';

    const props = {};

    if (rootEl.attributes['data-app']) {
      props.component = rootEl.attributes['data-app'].value;
    }

    createApp({ render: () => h(App, { ...props }) })
      .use(VueAxios, axios)
      .mount(rootEl);
  }
}
