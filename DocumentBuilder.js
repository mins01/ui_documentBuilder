class DocumentBuilder{
    builderContainer = null;
    appContainer = null;
    lfe = null;
    doc = null;
    page = null;
    lastFocusElement = null;
    constructor(builderContainer,lfe,appContainer){
        this.builderContainer = builderContainer;
        this.appContainer = appContainer
        this.lfe = lfe
        this.doc = this.builderContainer.querySelector('.doc')
        this.page = this.builderContainer.querySelector('.page')
        this.lastFocusElement = null;
    }
    get editMode(){
        return this.appContainer.classList.contains('edit-mode');
    }
    /**
     * @param {any} b
     */
    set editMode(b){
        b?this.appContainer.classList.add('edit-mode'):this.appContainer.classList.remove('edit-mode')
        this.blur();
    }
    set docWidth(width='auto'){
        this.doc.style.width = width;
    }
    get docWidth(){
        return this.doc.style.width??'auto';
    }
    addEventListener(){
        this.builderContainer.addEventListener('click',this.cbclick);
        // this.builderContainer.addEventListener('keypress',this.cbkeypress);
        // this.builderContainer.addEventListener('keydown',this.cbkeydown);
    }
    removeEventListener(){
        this.builderContainer.removeEventListener('click',this.cbclick);
        // this.builderContainer.removeEventListener('keypress',this.cbkeypress);
        // this.builderContainer.removeEventListener('keydown',this.cbkeydown);
    }
    cbclick=(event)=>{ this.onclick(event); }
    onclick(event){
        console.log('onclick');
        // event.stopPropagation();
        // event.preventDefault();
        if(event.target != this.focusElement){
            this.focus(event.target)
        }
    }
    cbkeypress=(event)=>{ this.onkeypress(event); }
    onkeypress(event){
        console.log('onkeypress');
        // event.stopPropagation();
        // event.preventDefault();
        return false;
    }
    cbkeydown=(event)=>{ this.onkeydown(event); }
    onkeydown(event){
        console.log('onkeydown');
        // event.stopPropagation();
        // event.preventDefault();
    }
    get focusElement(){
        return this.builderContainer.querySelector('*[data-focus]');
    }
    set focusElement(target){
        target.dataset.focus="";
        this.syncFocusElement();
    }
    syncFocusElement(){
        // const focusElement = this.focusElement
        // document.querySelectorAll('*[data-sync-value]').forEach((el)=>{
        //     let syncValue = el.dataset.syncValue;
        //     let r = eval(syncValue)
        //     console.log(r);
        //     el.value = r;
        // })
    }
    get doc(){
        return this.builderContainer.querySelector('.doc');
    }

    blur(target = null){
        if(!target){
            target = this.focusElement;
        }
        if(target){
            this.removeEventListenerForfocusElement(target);
            delete target.dataset.focus; 
            if(target.contentEditable){
                target.contentEditable = false;
                target.removeAttribute('contentEditable');
            }
        }
        this.lastFocusElement = null;
        this.lfe.hide()
        delete this.appContainer.dataset.focusType
        delete this.appContainer.dataset.focusStatus
    }
    
    focus(el,force=false){
        if(!el){return false;}
        
        const target = el.closest('*[data-type]');
        if(!target){return false;}
        
        if(this.lastFocusElement == target){
            return false;
        }else{
            this.blur()
        }
        this.focusElement = target;

        this.addEventListenerForfocusElement(target);
        if(target.dataset.type) this.appContainer.dataset.focusType = target.dataset.type;
        if(target.dataset.status) this.appContainer.dataset.focusStatus = target.dataset.status;

        if(target.dataset.status && target.dataset.status?.indexOf('readonly')!==-1){

        }else if(target.dataset.type=='block' || target.dataset.type=='inline'){
        
            target.contentEditable = true
            target.focus();
            if(target.textContent.length == 0|| target.tagName=='BUTTON'){
                const range = window.document.createRange();
                range.setStart(target, 0);
                range.setEnd(target, 0);
        
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        this.lfe.show(target)
        this.lastFocusElement = this.focusElement;
        return true;
    }

    clear(){
        this.blur();
        this.page.innerHTML = '';
    }
    clearAndInitFromHtml(html){
        this.clear();
        const elements = this.fromHtml(html);
        [...elements].forEach(element => {
            this.append(this.page,element); 
        });
        this.blur();
        setTimeout(()=>{
            this.focus(this.page.querySelector('*[data-type="block"]'));
        },100)
        
    }
    

    addEventListenerForfocusElement(focusElement){
        if(!focusElement) return false;
        focusElement.addEventListener('click',this.cbclickForFocusElement);
        focusElement.addEventListener('keypress',this.cbkeypressForFocusElement);
    }
    removeEventListenerForfocusElement(focusElement){
        if(!focusElement) return false;
        focusElement.removeEventListener('click',this.cbclickForFocusElement);
        focusElement.removeEventListener('keypress',this.cbkeypressForFocusElement);
    }
    cbclickForFocusElement = (event)=>{ return this.onclickForFocusElement(event); }
    onclickForFocusElement(event){
        console.log('onclickForFocusElement');
    }
    cbkeypressForFocusElement = (event)=>{ return this.onkeypressForFocusElement(event); }    
    onkeypressForFocusElement(event){
        console.log('onkeypressForFocusElement');
        // console.log(event);
        if(event.target.tagName=='BUTTON'){
            // event.stopPropagation();
            if(event.code == 'Space'){
                event.preventDefault();
                document.execCommand('insertText',null,' ');
            }else if(event.code == 'Enter'){
                event.preventDefault();
                document.execCommand('insertText',null,'\n');
            }
        }
    }
    // https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
    /**
     * @param {String} HTML representing a single element.
     * @param {Boolean} flag representing whether or not to trim input whitespace, defaults to true.
     * @return {Element | HTMLCollection | null}
     */
    fromHtml(html, trim = true){
        // Process the HTML string.
        html = trim ? html.trim() : html;
        if (!html) return null;
    
        // Then set up a new template element.
        const template = document.createElement('template');
        template.innerHTML = html;
        const result = template.content.children;
    
        return result;
    }




    toPreviousSibling(el,target=null){
        if(!el){ console.warn('대상 element가 없습니다.'); return false; }
        if(!target){
            if(!(el.parentElement.dataset.type=='layout' || el.parentElement.dataset.type=='block')){ console.warn('부모가 data-type="layout" or data-type="block" 이 아닙니다.'); return false; }
            if(!el.previousElementSibling){ console.warn('이전 이웃이 없습니다.'); return false; }
            target = el.previousElementSibling;
        }
        target.insertAdjacentElement('beforebegin',el);
        this.lfe.syncPos();
    }
    toNextSibling(el,target=null){
        if(!el){ console.warn('대상 element가 없습니다.'); return false; }
        if(!target){
            if(!(el.parentElement.dataset.type=='layout' || el.parentElement.dataset.type=='block')){ console.warn('부모가 data-type="layout" or data-type="block" 이 아닙니다.'); return false; }
            if(!el.nextElementSibling){ console.warn('다음 이웃이 없습니다.'); return false; }
            target = el.nextElementSibling;
        }
        target.insertAdjacentElement('afterend',el);
        this.lfe.syncPos();
    }
    startEventMoveToAsPointerEvent(){
        document.addEventListener('pointermove',this.moveToAsPointerEvent);
        document.addEventListener('pointerup',(event)=>{
            document.removeEventListener('pointermove',this.moveToAsPointerEvent)
        },{once:true});
    }
    moveToAsPointerEvent = (event)=>{
        // console.log(event.x,event.y);
        const focusElement = this.focusElement;
        let toEl = document.elementFromPoint(event.x,event.y);
        if(!focusElement || !toEl || focusElement===toEl || focusElement.contains(toEl) || toEl.classList.contains('page') || focusElement.classList.contains('page')){
            // 동작하면 안되는 조건

        }else if(focusElement.dataset.type=='layout'){
            if(toEl.dataset.type=='layout'){
                if(focusElement.nextElementSibling === toEl){ this.toNextSibling(focusElement,toEl); }
                else{ this.toPreviousSibling(focusElement,toEl); }
            }
        }else if(focusElement.dataset.type=='block'){
            if(toEl.dataset.type=='layout'){
                toEl.append(focusElement)
            }else if(toEl.dataset.type=='block'){
                if(focusElement.nextElementSibling === toEl){ this.toNextSibling(focusElement,toEl); }
                else{ this.toPreviousSibling(focusElement,toEl); }
                
            }
        }else if(focusElement.dataset.type=='inline'){
            if(toEl.dataset.type=='block'){
                toEl.append(focusElement)
            }else if(toEl.dataset.type=='inline'){
                if(focusElement.nextElementSibling === toEl){ this.toNextSibling(focusElement,toEl); }
                else{ this.toPreviousSibling(focusElement,toEl); }
            }
        }
    }
    // moveTo(target,toEl){
    //     if(target.nextElementSibling === toEl){ this.toNextSibling(target,toEl); }
    //     else{ this.toPreviousSibling(target,toEl); }
    // }
    
    appendWithCreateElementToFocusElement(tag,attributes = null, properties = null, children = null){
        const parent = this.focusElement;
        if(!parent) return;
        const el = this.createElement(tag,attributes, properties, children);
        this.append(parent,el);
    }
    appendWithCreateElement(parent,tag,attributes = null, properties = null, children = null){
        const el = this.createElement(tag,attributes, properties, children);
        this.append(parent,el);
    }
    createElement(tag,attributes=null, properties = null, children = null){
        const el = document.createElement(tag);
        if(attributes){
            for(let k in attributes){
                el.setAttribute(k,attributes[k]);
            }
        }
        if(properties){
            for(let k in properties){
                el[k] = properties[k];
            }
        }
        if(typeof children === "string"){
            el.textContent = children
        }else if(children){
            children.forEach((child)=>{
                el.append(child);
            })
        } 
        return el;
    }
    append(parent,el){
        parent.append(el);
    }

    /**
     * Document.execCommand() 를 사용한다. Deprecated 상태지만 대체기능이 없다.
     * @param {*} aCommandName 
     * @param {*} aShowDefaultUI 
     * @param {*} aValueArgument 
     */
    execCommand(commandId, showUI=false, value=null){
        if(!this.focusElement) return false;
        return document.execCommand(commandId,showUI,value)
    }
    removeFocusElement(){
        if(!this.focusElement) return false;
        let next = this.focusElement.nextElementSibling??this.focusElement.previousElementSibling??this.focusElement.parentElement;
        if(!next || !next.dataset.type){ return false; }
        this.focusElement.remove();
        this.focus(next);
    }
    styleFocusElement(k,v){
        if(!this.focusElement) return false;
        this.focusElement.style[k]=v;
    }
    clearStyleFocusElement(k){
        if(!this.focusElement) return false;
        this.focusElement.style[k]=null;
    }
    toggleStyleFocusElement(k,v){
        if(!this.focusElement) return false;
        if(this.focusElement.style[k]==v){
            this.focusElement.style[k]=null;
        }else{
            this.focusElement.style[k]=v;
        }
        
    }

    toHtml(){
        return this.doc.outerHTML.replace(/contenteditable="true"/g,'');
    }
    toHtmlFromPage(){
        return this.page.outerHTML.replace(/contenteditable="true"/g,'');
    }
    toHtmlFromPageInnerHtml(){
        return this.page.innerHTML.replace(/contenteditable="true"/g,'');
    }

}