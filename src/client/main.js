
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import "./style.css";


import { createApp } from "vue";

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import { aliases, mdi } from 'vuetify/iconsets/mdi'

import { md1 } from 'vuetify/blueprints'


const vuetify = createVuetify({
	components,
	directives,
	blueprint: md1,
	theme: {
		defaultTheme: 'dark'
	},
	// icons: {
	// 	defaultSet: 'mdi'
	// }
})




import App from "./App.vue";

createApp(App).use(vuetify).mount("#app");
