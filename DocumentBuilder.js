class DocumentBuilder{
    constructor(builderContainer,lfe,appContainer){
        this.builderContainer = builderContainer;
        this.appContainer = appContainer
        this.lfe = lfe
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
            this.blur()
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
        this.lfe.hide()
    }
    
    focus(el){
        if(!el){return false;}
        
        const target = el.closest('*[data-type]');
        if(!target){return false;}
        
        target.dataset.focus="";
        this.addEventListenerForfocusElement(target);
        if(target.dataset.type=='block' || target.dataset.type=='inline'){
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
        return true;
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
    }




    toPreviousSibling(el,target=null){
        if(!el){ console.warn('대상 element가 없습니다.'); return false; }
        if(!target){
            if(el.parentElement.dataset.type!='layout' || el.parentElement.dataset.type!='block'){ console.warn('부모가 data-type="layout" || data-type="block" 이 아닙니다.'); return false; }
            if(!el.previousElementSibling){ console.warn('이전 이웃이 없습니다.'); return false; }
            target = el.previousElementSibling;
        }
        target.insertAdjacentElement('beforebegin',el);
        this.lfe.syncPos();
    }
    toNextSibling(el,target=null){
        if(!el){ console.warn('대상 element가 없습니다.'); return false; }
        if(!target){
            if(el.parentElement.dataset.type!='layout' || el.parentElement.dataset.type!='block'){ console.warn('부모가 data-type="layout" || data-type="block" 이 아닙니다.'); return false; }
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
    
    appendWithCreateElementToFocusElement(tag,attributes = null, className = null, child = null){
        const parent = this.focusElement;
        if(!parent) return;
        const el = this.createElement(tag,attributes, className, child);
        this.append(parent,el);
    }
    appendWithCreateElement(parent,tag,attributes = null, className = null, child = null){
        const el = this.createElement(tag,attributes, className, child);
        this.append(parent,el);
    }
    createElement(tag,attributes=null, className = null, child = null){
        const el = document.createElement(tag);
        if(attributes){
            for(let k in attributes){
                el.setAttribute(k,attributes[k]);
            }
        }
        if(className) el.className = className
        if(typeof child === "string"){
            el.textContent = child
        }else if(child){
            el.append(child);
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

}