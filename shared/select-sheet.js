(function(root){
"use strict";
if(!root.AltynBase) throw Error("Load components.js before select-sheet.js");
const moduleBase=new URL("./",document.currentScript?.src||document.baseURI);
const asset=(name)=>new URL("assets/"+name,moduleBase).href;
const elt=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined&&text!==null)n.textContent=String(text);return n;};
const lower=(v)=>String(v??"").trim().toLocaleLowerCase("ru-RU");
const norm=(items)=>(Array.isArray(items)?items:[]).map((v,i)=>typeof v==="string"?{id:v,value:v,label:v}:v&&typeof v==="object"?{...v,id:String(v.id??v.value??i),value:String(v.value??v.id??i),label:String(v.label??v.name??v.value??v.id??i)}:null).filter(Boolean);
let activeSheet=null,seq=0;
function iconFor(item,kind,cls){
 const wrapper=elt("span",cls);wrapper.setAttribute("aria-hidden","true");
 if(item.iconSrc){const im=elt("img",cls+"__img");im.alt="";im.src=String(item.iconSrc);wrapper.append(im);}
 else if(item.icon){wrapper.append(elt("span",cls+"__glyph",item.icon));}
 else if(kind==="country"){wrapper.append(elt("span",cls+"__glyph","🌐"));}
 else if(kind==="bank"){wrapper.append(elt("span",cls+"__glyph","🏦"));}
 else if(kind==="network"){const im=elt("img",cls+"__img");im.alt="";im.src=asset("network-generic.svg");wrapper.append(im);}
 return wrapper;
}
function openSelectionSheet(o={}){
 if(activeSheet) activeSheet.close("replaced");
 const items=norm(o.items),kind=o.kind||"generic",searchable=o.searchable!==false;
 const host=o.host instanceof HTMLElement?o.host:o.trigger?.closest(".ab-screen")||document.body;
 const id="ab-sheet-"+(++seq),overlay=elt("div","ab-selection-overlay"),back=elt("div","ab-selection-backdrop"),sheet=elt("section","ab-selection-sheet");
 overlay.dataset.figmaRefs="14348:114250,17511:164381,17511:236855";
 back.setAttribute("aria-hidden","true");sheet.id=id;sheet.tabIndex=-1;sheet.setAttribute("role","dialog");sheet.setAttribute("aria-modal","true");
 const grab=elt("div","ab-selection-grab");grab.append(elt("div","ab-selection-handle"));
 const heading=elt("h2","ab-selection-heading",o.title||"Выберите значение");heading.id=id+"-title";sheet.setAttribute("aria-labelledby",heading.id);
 const header=elt("header","ab-selection-header");header.append(heading);
 const body=elt("div","ab-selection-body"),list=elt("div","ab-selection-list"),empty=elt("div","ab-selection-empty",o.emptyText||"Ничего не найдено");
 list.setAttribute("role","listbox");list.setAttribute("aria-label",o.title||"Варианты");empty.setAttribute("role","status");empty.hidden=true;body.append(list,empty);
 sheet.append(grab,header);
 let search=null;
 if(searchable){const wrap=elt("div","ab-selection-search-wrap");search=elt("input","ab-selection-search");search.type="search";search.autocomplete="off";search.spellcheck=false;search.placeholder=o.searchPlaceholder||"Поиск";search.setAttribute("aria-label",search.placeholder);const mag=elt("img","ab-selection-search-icon");mag.alt="";mag.src=asset("search.svg");wrap.append(search,mag);sheet.append(wrap);}
 const bottom=elt("div","ab-selection-bottom");bottom.append(elt("div","ab-selection-home-indicator"));sheet.append(body,bottom);
 overlay.append(back,sheet);
 const prev=document.activeElement instanceof HTMLElement?document.activeElement:null;
 const locked=Array.from(host.children).map(node=>({node,inert:node.inert})),overflow=document.body.style.overflow;
 locked.forEach(v=>v.node.inert=true);
 if(host===document.body)document.body.style.overflow="hidden";
 host.append(overlay);
 let done=false,visible=items,term="";
 function close(reason="dismissed"){
  if(done)return;done=true;document.removeEventListener("keydown",onKey,true);overlay.remove();
  locked.forEach(v=>v.node.inert=v.inert);if(host===document.body)document.body.style.overflow=overflow;
  if(o.trigger)o.trigger.setAttribute("aria-expanded","false");
  if(activeSheet===api)activeSheet=null;
  if(typeof o.onClose==="function")o.onClose(reason);
  const target=(prev?.isConnected?prev:o.trigger);if(target?.isConnected)target.focus({preventScroll:true});
 }
 function draw(){
  const query=lower(term);
  visible=items.filter(item=>[item.label,item.subtitle,item.searchText,item.value].map(lower).join(" ").includes(query));
  const fragment=document.createDocumentFragment();
  visible.forEach(item=>{
   const row=elt("button","ab-selection-row");row.type="button";row.disabled=Boolean(item.disabled);row.dataset.value=item.value;
   row.setAttribute("role","option");row.setAttribute("aria-selected",String(String(o.value??"")===item.value));
   const main=elt("span","ab-selection-row__contents");main.append(elt("span","ab-selection-row__label",item.label));
   if(item.subtitle)main.append(elt("span","ab-selection-row__subtitle",item.subtitle));
   row.append(main);if(kind!=="generic"||item.icon||item.iconSrc)row.append(iconFor(item,kind,"ab-selection-row__icon"));
   row.addEventListener("click",()=>{if(row.disabled)return;if(typeof o.onSelect==="function")o.onSelect(item);close("selected");});
   fragment.append(row);
  });
  list.replaceChildren(fragment);list.hidden=!visible.length;empty.hidden=!!visible.length;
 }
 if(search)search.addEventListener("input",()=>{term=search.value;body.scrollTop=0;draw();});
 function onKey(e){
  if(e.key==="Escape"){e.preventDefault();e.stopPropagation();close("escape");}
  if(e.key!=="Tab")return;
  const candidates=Array.from(sheet.querySelectorAll('input:not(:disabled),button:not(:disabled)'));
  if(!candidates.length){e.preventDefault();sheet.focus();return;}
  const first=candidates[0],last=candidates[candidates.length-1];
  if(e.shiftKey&&(document.activeElement===first||document.activeElement===sheet)){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&(document.activeElement===last||!sheet.contains(document.activeElement))){e.preventDefault();first.focus();}
 }
 back.addEventListener("click",()=>close("backdrop"));document.addEventListener("keydown",onKey,true);
 let dragY=null;grab.addEventListener("pointerdown",e=>{dragY=e.clientY;});grab.addEventListener("pointerup",e=>{if(dragY!==null&&e.clientY-dragY>48)close("swipe");dragY=null;});grab.addEventListener("pointercancel",()=>{dragY=null;});
 const api=Object.freeze({close,overlay,sheet,searchInput:search,getVisibleCount:()=>visible.length});
 activeSheet=api;draw();if(o.trigger)o.trigger.setAttribute("aria-expanded","true");sheet.focus({preventScroll:true});return api;
}
function createSelectField(o={}){
 const field=elt("div","ab-field ab-select-field"),kind=o.kind||"generic";
 field.dataset.figmaId="77:12680";field.dataset.kind=kind;
 const btn=elt("button","ab-select-trigger ab-input-control");btn.type="button";btn.disabled=!!o.disabled;
 btn.setAttribute("aria-haspopup","dialog");btn.setAttribute("aria-expanded","false");if(o.id)btn.id=o.id;
 const label=elt("span","ab-input-label",o.label||"Выберите значение");
 const value=elt("span","ab-select-trigger__value"),trailing=elt("span","ab-select-trigger__trailing");
 trailing.setAttribute("aria-hidden","true");btn.append(label,value,trailing);field.append(btn);
 const hidden=elt("input");hidden.type="hidden";if(o.name)hidden.name=o.name;hidden.disabled=!!o.disabled;field.append(hidden);
 if(o.helper)field.append(elt("span","ab-field__helper",o.helper));
 let items=norm(o.items),selected=o.value==null?"":String(o.value),current=null,sheet=null;
 function render(){
  current=items.find(item=>item.value===selected||item.id===selected)||null;
  const filled=!!current;btn.dataset.floated=String(filled);btn.dataset.hasLabel="true";field.dataset.state=filled?"filled":"enable";
  value.textContent=current?.label||"";btn.setAttribute("aria-label",(o.label||"Выберите значение")+(current?": "+current.label:""));
  trailing.replaceChildren(current?iconFor(current,kind,"ab-select-icon"):elt("span","ab-select-chevron","⌄"));
  hidden.value=current?.value||"";
 }
 function setValue(v,opt={}){
  const before=hidden.value;selected=v==null?"":String(v);render();
  if(!opt.silent&&before!==hidden.value){hidden.dispatchEvent(new Event("change",{bubbles:true}));if(typeof o.onChange==="function")o.onChange(current,current?.value||"");}
 }
 function open(){
  if(btn.disabled)return null;
  sheet=openSelectionSheet({title:o.title||o.label||"Выберите значение",kind,items,searchable:o.searchable,searchPlaceholder:o.searchPlaceholder,emptyText:o.emptyText,
   value:hidden.value,trigger:btn,host:o.host,onSelect:item=>setValue(item.value),
   onClose:reason=>{sheet=null;if(typeof o.onClose==="function")o.onClose(reason);}});
  return sheet;
 }
 btn.addEventListener("click",open);
 field.open=open;field.close=()=>sheet?.close();field.getValue=()=>hidden.value;field.setValue=setValue;
 field.setItems=next=>{items=norm(next);render();};
 render();return field;
}
root.AltynBase=Object.freeze({...root.AltynBase,createSelectField,openSelectionSheet});
})(window);
