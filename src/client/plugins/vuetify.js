
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md3 } from 'vuetify/blueprints'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  // theme: {
  //   themes: {
  //     light: {
  //       colors: {
  //         primary: '#1867C0',
  //         secondary: '#5CBBF6',
  //       },
  //     },
  //   },
  // },
  components,
  directives,
  blueprint: md3,
  theme: {
    defaultTheme: 'dark'
  },
})
