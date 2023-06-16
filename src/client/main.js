
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import "./style.css";


import { createApp } from "vue";

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import { aliases, mdi } from 'vuetify/iconsets/mdi'

import { md3 } from 'vuetify/blueprints'


const vuetify = createVuetify({
	components,
	directives,
	blueprint: md3,
	theme: {
		defaultTheme: 'dark'
	},
	// icons: {
	// 	defaultSet: 'mdi'
	// }
})


const webFontLoader = await import(/* webpackChunkName: "webfontloader" */'webfontloader')
webFontLoader.load({
	google: {
	  families: ['Josefin Sans:100,300,400,500,700,900&display=swap', 'Roboto:100,300,400,500,700,900&display=swap'],
	},
})

import App from "./App.vue";

createApp(App).use(vuetify).mount("#app");
