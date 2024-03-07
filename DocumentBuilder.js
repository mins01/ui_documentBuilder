class DocumentBuilder{
    constructor(container){
        this.container = container;
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
    }
    get focusElement(){
        return this.container.querySelector('*[data-focus]');
    }
    setFocus(el){
        if(el){
            const target = el.closest('*[data-type]');
            if(target){
                target.dataset.focus="";
                if(target.dataset.type=='content'){
                    target.contentEditable = true
                    target.focus();
                }
            }
        }
    }

    toPreviousSibling(el){
        if(!el){ console.warn('대상 element가 없습니다.'); return false; }
        if(el.parentElement.dataset.type!='layout'){ console.warn('부모가 data-type="layout"이 아닙니다.'); return false; }
        if(!el.previousElementSibling){ console.warn('이전 이웃이 없습니다.'); return false; }
        const target = el.previousElementSibling;
        target.insertAdjacentElement('beforebegin',el);
    }
    toNextSibling(el){
        if(!el){ console.warn('대상 element가 없습니다.'); return false; }
        if(el.parentElement.dataset.type!='layout'){ console.warn('부모가 data-type="layout"이 아닙니다.'); return false; }
        if(!el.nextElementSibling){ console.warn('다음 이웃이 없습니다.'); return false; }
        const target = el.nextElementSibling;
        target.insertAdjacentElement('afterend',el);
    }
    
    appendWithCreateElementWithFocusElement(tag,dataset = null, className = null){
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

}