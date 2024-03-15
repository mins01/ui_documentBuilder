let vappCreateApp = Vue.createApp({
    setup(){
      return{
        // docb: Vue.ref(null),
        // focusElement:Vue.ref({}),
        // docb:Vue.ref(null),
        isFocusMoving:Vue.ref(false),
        focusElement:Vue.ref(null),
        renderCount:0,
        styleColorToRgb:(color)=>{
          return styleColorToRgb(color);
        },
        styleColorToHex:(color)=>{
          return styleColorToHex(color);
        },
        refocus(){
          if(docb.focusElement){
            docb.focusElement.focus()
          } 
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