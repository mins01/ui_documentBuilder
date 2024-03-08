class DocumentBuilder{
    constructor(container,lfe){
        this.container = container;
        this.lfe = lfe
    }
    addEventListener(){
        this.container.addEventListener('click',this.cbclick);
    }
    removeEventListener(){
        this.container.removeEventListener('click',this.cbclick);

    }
    cbclick=(event)=>{ this.onclick(event); }
    onclick(event){
        console.log('onclick');
        this.clearFocus()
        const target = event.target
        this.setFocus(target)
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
        if(target.dataset.type=='content'){
            target.contentEditable = true
            target.focus();
        }
        this.lfe.show(target)
        return true;
    }

    toPreviousSibling(el,target=null){
        if(!el){ console.warn('대상 element가 없습니다.'); return false; }
        if(!target){
            if(el.parentElement.dataset.type!='layout'){ console.warn('부모가 data-type="layout"이 아닙니다.'); return false; }
            if(!el.previousElementSibling){ console.warn('이전 이웃이 없습니다.'); return false; }
            target = el.previousElementSibling;
        }
        target.insertAdjacentElement('beforebegin',el);
        this.lfe.syncPos();
    }
    toNextSibling(el,target=null){
        if(!el){ console.warn('대상 element가 없습니다.'); return false; }
        if(!target){
            if(el.parentElement.dataset.type!='layout'){ console.warn('부모가 data-type="layout"이 아닙니다.'); return false; }
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

        }else if(toEl.dataset.type=='layout'){
            if(toEl.dataset.type=='layout'){
                if(focusElement.nextElementSibling === toEl){
                    this.toNextSibling(focusElement,toEl);
                }else{
                    this.toPreviousSibling(focusElement,toEl);
                }
            }
        }else if(toEl.dataset.type=='content'){
            if(toEl.dataset.type=='layout'){
                if(focusElement.nextElementSibling === toEl){
                    this.toNextSibling(focusElement,toEl);
                }else{
                    this.toPreviousSibling(focusElement,toEl);
                }
            }else if(toEl.dataset.type=='content'){
                if(focusElement.nextElementSibling === toEl){
                    this.toNextSibling(focusElement,toEl);
                }else{
                    this.toPreviousSibling(focusElement,toEl);
                }
                
            }
        }
        
        
    }
    
    appendWithCreateElementToFocusElement(tag,dataset = null, className = null){
        const parent = this.focusElement;
        if(!parent) return;
        const el = this.createElement(tag,dataset, className);
        this.append(parent,el);
    }
    appendWithCreateElement(parent,tag,dataset = null, className = null){
        const el = this.createElement(tag,dataset, className);
        this.append(parent,el);
    }
    createElement(tag,dataset = null, className = null){
        const el = document.createElement(tag);
        if(dataset){
            for(let k in dataset){
                el.dataset[k] = dataset[k];
            }
        }
        if(className) el.className = className
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

    toHtml(){
        return this.doc.outerHTML.replace(/contenteditable="true"/g,'');
    }

}