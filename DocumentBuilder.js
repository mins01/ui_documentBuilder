class DocumentBuilder{
    constructor(container,lfe){
        this.container = container;
        this.lfe = lfe
    }
    addEventListener(){
        this.container.addEventListener('click',this.cbclick);
        this.container.addEventListener('keypress',this.cbkeypress);
        this.container.addEventListener('keydown',this.cbkeydown);
    }
    removeEventListener(){
        this.container.removeEventListener('click',this.cbclick);
        this.container.removeEventListener('keypress',this.cbkeypress);
        this.container.removeEventListener('keydown',this.cbkeydown);
    }
    cbclick=(event)=>{ this.onclick(event); }
    onclick(event){
        console.log('onclick');
        // event.stopPropagation();
        event.preventDefault();
        this.clearFocus()
        const target = event.target
        this.setFocus(target)
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
    clearFocus(target = null){
        if(!target){
            target = this.focusElement;
        }
        if(target){ 
            delete target.dataset.focus; 
            if(target.contentEditable){
                target.contentEditable = false;
                target.removeAttribute('contentEditable');
            }
        }
        this.lfe.hide()
    }
    get focusElement(){
        return this.container.querySelector('*[data-focus]');
    }
    get doc(){
        return this.container.querySelector('.doc');
    }
    setFocus(el){
        if(!el){return false;}
        
        const target = el.closest('*[data-type]');
        if(!target){return false;}
        
        target.dataset.focus="";
        if(target.dataset.type=='block' || target.dataset.type=='inline'){
            target.contentEditable = true
            target.focus();
        }
        this.lfe.show(target)
        return true;
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

    removeFocusElement(){
        if(!this.focusElement) return false;
        let next = this.focusElement.nextElementSibling??this.focusElement.previousElementSibling??this.focusElement.parentElement;
        if(!next || !next.dataset.type){ return false; }
        this.focusElement.remove();
        this.setFocus(next);
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