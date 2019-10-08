// ==========================================================================
// Find a Location - Atrium Health implementation by Daniel Nedelcu and
// Russell Strauss.
// Author:  Daniel Nedelcu
// Email:   dnedelcu@rightpoint.com
// Date:    07/20/19
// ==========================================================================

import Vue from 'vue/dist/vue.js';
import App from './App.js'
import router from './router/index.js'
import store from './store/store.js'
import "babel-polyfill";


var Application = (function(app, document) {   
    app.init = function () {    
        console.log('Application init')
        /**
         * Vue Global Instance
         *  */     
        
        new Vue({                           
            router,                    
            el: '#LocationApp',
            store,
            render: h => h(App)                                     
            })      
                
    }

    /**
     * Public API
     */    
    return {
        init : app.init
    } 
})(Application || {}, document, window);

    
window.addEventListener('DOMContentLoaded', (event) => {
    Application.init();   
});

// window.onload = () => {
//     Application.init();        
// }