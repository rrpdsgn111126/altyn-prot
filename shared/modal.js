/* Modal compositional pattern derived from Altyn App modal 18443:138108.
 * Figma modal surface defaults Secondary, list surface Primary, action buttons Button.mobile/M.
 * No invented Figma component ID; supplied item content is always plain text.
 */
(function (root) {
  "use strict";
  if (!root.AltynBase || !root.AltynBase.createButton) {
    throw new Error("Load components.js before modal.js");
  }
  const make=(tag,cls,text)=>{
    const n=document.createElement(tag);
    if(cls)n.className=cls;
    if(text!==undefined&&text!==null)n.textContent=String(text);
    return n;
  };
  let active=null;
  let counter=0;
  function openModal(options={}){
    if(active)active.close("replaced");
    const host=options.host instanceof HTMLElement?options.host:
      options.trigger?.closest(".ab-screen")||document.body;
    const title=String(options.title||"");
    const overlay=make("div","ab-modal-overlay");
    const sheet=make("section","ab-modal-sheet");
    const id="ab-modal-"+(++counter);
    overlay.dataset.figmaRef="18443:138108";
    sheet.dataset.surface=options.surface==="primary"?"primary":"secondary";
    sheet.setAttribute("role","dialog");
    sheet.setAttribute("aria-modal","true");
    sheet.tabIndex=-1;
    const background=make("div","ab-modal-backdrop");
    background.setAttribute("aria-hidden","true");
    const handleArea=make("div","ab-modal-handle-area");
    handleArea.append(make("div","ab-modal-handle"));
    const header=make("header","ab-modal-header");
    if(title){
      const h=make("h2","ab-modal-title",title);
      h.id=id+"-title";
      sheet.setAttribute("aria-labelledby",h.id);
      header.append(h);
    } else sheet.setAttribute("aria-label",String(options.ariaLabel||"Модальное окно"));
    const scrolling=make("div","ab-modal-scroll");
    const content=make("div","ab-modal-content");
    const items=Array.isArray(options.items)?options.items:[];
    if(items.length){
      const list=make("div","ab-modal-list");
      list.dataset.figmaRef="I18443:138108;9844:99726;18443:138110";
      for(const item of items){
        const data=typeof item==="string"?{label:item}:item;
        if(!data)continue;
        const clickable=typeof data.onClick==="function";
        const row=make(clickable?"button":"div","ab-modal-list-row");
        if(clickable)row.type="button";
        row.append(make("span","ab-modal-list-row__text",data.label||""));
        if(data.iconSrc){
          const img=make("img","ab-modal-list-row__icon");
          img.src=String(data.iconSrc);
          img.alt="";
          row.append(img);
        }else if(data.icon){
          row.append(make("span","ab-modal-list-row__icon",data.icon));
        }
        if(clickable)row.addEventListener("click",()=>data.onClick(api,data));
        list.append(row);
      }
      content.append(list);
    }
    if(options.content instanceof Node)content.append(options.content);
    scrolling.append(content);
    sheet.append(handleArea,header,scrolling);
    const actions=Array.isArray(options.actions)?options.actions:[];
    if(actions.length){
      const footer=make("div","ab-modal-actions");
      for(const action of actions){
        if(!action||!action.label)continue;
        // M is a modal rule: Button.mobile/Size=M, 44px for Primary.
        const button=root.AltynBase.createButton({
          label:action.label,type:action.type||"primary",size:"M",
          block:true,disabled:Boolean(action.disabled),loading:Boolean(action.loading),
          onClick:()=>{
            if(typeof action.onClick==="function")action.onClick(api);
            if(action.closeOnClick!==false)close("action");
          }
        });
        button.dataset.modalButtonSize="M";
        footer.append(button);
      }
      sheet.append(footer);
    }
    const home=make("div","ab-modal-system");
    home.append(make("div","ab-modal-system-handle"));
    sheet.append(home);
    overlay.append(background,sheet);

    const origin=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const oldOverflow=document.body.style.overflow;
    const siblings=Array.from(host.children).map(node=>({node,inert:node.inert}));
    siblings.forEach(v=>v.node.inert=true);
    if(host===document.body)document.body.style.overflow="hidden";
    host.append(overlay);
    let closed=false;
    function close(reason="dismissed"){
      if(closed)return;
      closed=true;
      document.removeEventListener("keydown",onKey,true);
      overlay.remove();
      siblings.forEach(v=>v.node.inert=v.inert);
      if(host===document.body)document.body.style.overflow=oldOverflow;
      if(active===api)active=null;
      if(typeof options.onClose==="function")options.onClose(reason);
      const target=origin?.isConnected?origin:options.trigger;
      if(target?.isConnected)target.focus({preventScroll:true});
    }
    function onKey(event){
      if(event.key==="Escape"){
        event.preventDefault();event.stopPropagation();close("escape");return;
      }
      if(event.key!=="Tab")return;
      const controls=Array.from(sheet.querySelectorAll('button:not(:disabled),input:not(:disabled),a[href], [tabindex="0"]'));
      if(!controls.length){event.preventDefault();sheet.focus();return;}
      const first=controls[0],last=controls[controls.length-1];
      if(event.shiftKey&&(document.activeElement===first||document.activeElement===sheet)){
        event.preventDefault();last.focus();
      } else if(!event.shiftKey&&(document.activeElement===last||!sheet.contains(document.activeElement))){
        event.preventDefault();first.focus();
      }
    }
    background.addEventListener("click",()=>close("backdrop"));
    document.addEventListener("keydown",onKey,true);
    let dragY=null;
    handleArea.addEventListener("pointerdown",e=>{dragY=e.clientY;});
    handleArea.addEventListener("pointerup",e=>{if(dragY!==null&&e.clientY-dragY>48)close("swipe");dragY=null;});
    handleArea.addEventListener("pointercancel",()=>{dragY=null;});
    const api=Object.freeze({close,overlay,sheet});
    active=api;
    sheet.focus({preventScroll:true});
    return api;
  }
  root.AltynBase=Object.freeze({...root.AltynBase,openModal});
})(window);
