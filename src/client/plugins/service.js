
import axios from 'axios'

import FontRenamer from "../components/FontRenamer.vue";
import MyHeader from '../components/MyHeader.vue'
import MyForm from '../components/MyForm.vue'
import MyZipList from '../components/MyZipList.vue'
import MyAlert from '../components/MyAlert.vue'
import MyPrompt from '../components/MyPrompt.vue'
import CatSvg from '../components/CatSvg.vue'


export default {
  install(app, options) {
    app
    	.component('FontRenamer', FontRenamer)
    	.component('MyHeader', MyHeader)
			.component('MyForm', MyForm)
			.component('MyZipList', MyZipList)
			.component('MyAlert', MyAlert)
			.component('MyPrompt', MyPrompt)
			.component('CatSvg', CatSvg)

		app.provide('service', {
			
			getZipList: () => fetch('/ziplist')
	      .then(res => res.json())
	      .then(json => json.files.map(file => {
            return {
              key: Date.now(),
              text: file.fileName,
              value: file.path
            }
          })
	      ),

	    uploadFonts: (data) => {
	    	return new Promise((resolve, reject) => {
			    axios({
			      url: '/upload', 
			      method: 'post', 
			      data
			    })
			      .then(response => {
			        if (response && response.data) {
			        	resolve(response.data)
			        }
			        else resolve({})
			      })
			      .catch(err => {
					    reject(err && err.response || {})
					    if (err && err.response) {
					      if (err.response.data instanceof Blob) {
					        const reader = new FileReader()
					        reader.onload = function() {
					          console.log(reader.result)
					        }
					        reader.readAsText(err.response.data)
					      }
					    }
			      })
			    })
	    },

	    removeZip: (path) => {
		    return new Promise((resolve, reject) => {
		    	axios({
			      url: '/removeZip', 
			      method: 'get', 
			      params: {
			        zipName: path.replace('/zips/', '').replace('.zip', '')
			      }
			    })
			      .then(response => {
			        if (response && response.data) {
			        	resolve(response.data)
			        }
			        else resolve({})
			      })
			      .catch(err => {
					    reject(err && err.response || {})
					    if (err && err.response) {
					      if (err.response.data instanceof Blob) {
					        const reader = new FileReader()
					        reader.onload = function() {
					          console.log(reader.result)
					        }
					        reader.readAsText(err.response.data)
					      }
					    }
			      })
			  })
	    }
		})
  }
}