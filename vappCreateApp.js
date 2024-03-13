let vappCreateApp = Vue.createApp({
    setup(){
      return{
        // docb: Vue.ref(null),
        // focusElement:Vue.ref({}),
        focusElement:Vue.ref(null),
        renderCount:0,
        styleColorToRgb:(color)=>{
          return styleColorToRgb(color);
        },
        styleColorToHex:(color)=>{
          return styleColorToHex(color);
        }
      }
    }
    // data(){
    //   return {
    //     // docb: Vue.ref(null),
    //     // focusElement:Vue.ref({}),
    //     focusElement:null,
    //     renderCount:0,
    //     // count: Vue.ref(0),
    //     // countx: Vue.ref({}),
    //   }
    // }
})
//.mount('#app')