import{r as c,u as ye,b as E,s as Se,d as Pe,e as be,f as xe,g as Ce,h as K,i as we,m as z,k as Re,j as S,A as je,C as Ee,t as $,R as Oe,c as Te,a as Ue}from"./defaultSettings-0c220327.js";import{B as Ne}from"./BsddSearch-eafe0adf.js";import{T as w,S as _e}from"./SettingsComponent-ad6d57c4.js";function De(e,t,n=!0){return{...e,default:t,decode:(...a)=>{const i=e.decode(...a);return i===void 0||n&&i===null?t:i}}}function ie(e,t){if(e==null)return e;if(e.length===0&&(!t||t&&e!==""))return null;const n=e instanceof Array?e[0]:e;return n==null?n:!t&&n===""?null:n}function Me(e){return e==null||e instanceof Array?e:e===""?[]:[e]}function Ie(e){return e==null?e:e?"1":"0"}function Ae(e){const t=ie(e);return t==null?t:t==="1"?!0:t==="0"?!1:null}function Le(e){return e==null?e:String(e)}function ke(e){const t=ie(e,!0);return t==null?t:String(t)}function Be(e){return e==null,e}function Qe(e){const t=Me(e);return t==null,t}const O={encode:Le,decode:ke},Ve={encode:Be,decode:Qe},We={encode:Ie,decode:Ae};function Fe(e){const t=new URLSearchParams,n=Object.entries(e);for(const[r,a]of n)if(a!==void 0&&a!==null)if(Array.isArray(a))for(const i of a)t.append(r,i??"");else t.append(r,a);return t.toString()}'{}[],":'.split("").map(e=>[e,encodeURIComponent(e)]);function Ke(e,t){const n={},r=Object.keys(t);for(const a of r){const i=t[a];e[a]?n[a]=e[a].encode(t[a]):n[a]=i==null?i:String(i)}return n}function ze(e){const t=new URLSearchParams(e),n={};for(let[r,a]of t)Object.prototype.hasOwnProperty.call(n,r)?Array.isArray(n[r])?n[r].push(a):n[r]=[n[r],a]:n[r]=a;return n}class $e{constructor(){this.paramsMap=new Map,this.registeredParams=new Map}set(t,n,r,a){this.paramsMap.set(t,{stringified:n,decoded:r,decode:a})}has(t,n,r){if(!this.paramsMap.has(t))return!1;const a=this.paramsMap.get(t);return a?a.stringified===n&&(r==null||a.decode===r):!1}get(t){var n;if(this.paramsMap.has(t))return(n=this.paramsMap.get(t))==null?void 0:n.decoded}registerParams(t){for(const n of t){const r=this.registeredParams.get(n)||0;this.registeredParams.set(n,r+1)}}unregisterParams(t){for(const n of t){const r=(this.registeredParams.get(n)||0)-1;r<=0?(this.registeredParams.delete(n),this.paramsMap.has(n)&&this.paramsMap.delete(n)):this.registeredParams.set(n,r)}}clear(){this.paramsMap.clear(),this.registeredParams.clear()}}const N=new $e;function Je(e,t){var n,r,a;const i={};let s=!1;const o=Object.keys(e);let l=o;if(t.includeKnownParams||t.includeKnownParams!==!1&&o.length===0){const d=Object.keys((n=t.params)!=null?n:{});l.push(...d)}for(const d of l){const f=e[d];if(f!=null&&typeof f=="object"){i[d]=f;continue}s=!0,i[d]=(a=(r=t.params)==null?void 0:r[d])!=null?a:O}return s?i:e}function se(e,t,n,r){var a;if(!n||!t.length)return e;let i={...e},s=!1;for(const o of t)Object.prototype.hasOwnProperty.call(i,o)||(i[o]=(a=n[o])!=null?a:r,s=!0);return s?i:e}const qe=Object.prototype.hasOwnProperty;function J(e,t){return e===t?e!==0||t!==0||1/e===1/t:e!==e&&t!==t}function oe(e,t,n){var r,a;if(J(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;const i=Object.keys(e),s=Object.keys(t);if(i.length!==s.length)return!1;for(let o=0;o<i.length;o++){const l=(a=(r=n?.[i[o]])==null?void 0:r.equals)!=null?a:J;if(!qe.call(t,i[o])||!l(e[i[o]],t[i[o]]))return!1}return!0}function le(e,t,n){const r={},a=Object.keys(t);for(const i of a){const s=t[i],o=e[i];let l;if(n.has(i,o,s.decode))l=n.get(i);else{if(l=s.decode(o),s.equals&&n.has(i,o)){const u=n.get(i);s.equals(l,u)&&(l=u)}l!==void 0&&n.set(i,o,l,s.decode)}l===void 0&&s.default!==void 0&&(l=s.default),r[i]=l}return r}function Ge(){let e;function t(n,r,a){const i=le(n,r,a);return e!=null&&oe(e,i)?e:(e=i,i)}return t}function Ye(e){let t;for(const n in e)if(e[n].urlName){const a=`${e[n].urlName}\0${n}`;t?t.push(a):t=[a]}return t?t.join(`
`):void 0}function Xe(e){if(e)return Object.fromEntries(e.split(`
`).map(t=>t.split("\0")))}function Ze(e,t){var n;let r={};for(const a in e)((n=t[a])==null?void 0:n.urlName)!=null?r[t[a].urlName]=e[a]:r[a]=e[a];return r}let q,G,Y,A={};const ce=(e,t,n)=>{if(q===t&&Y===e&&G===n)return A;q=t,Y=e;const r=e(t??"");G=n;const a=Xe(n);for(let[i,s]of Object.entries(r)){a?.[i]&&(delete r[i],i=a[i],r[i]=s);const o=A[i];oe(s,o)&&(r[i]=o)}return A=r,r},He={searchStringToObject:ze,objectToSearchString:Fe,updateType:"pushIn",includeKnownParams:void 0,includeAllParams:!1,removeDefaultsFromUrl:!1,enableBatching:!1,skipUpdateWhenNoChange:!0};function ue(e,t){t==null&&(t={});const n={...e,...t};return t.params&&e.params&&(n.params={...e.params,...t.params}),n}const fe={adapter:{},options:He},k=c.createContext(fe);function et(){const e=c.useContext(k);if(e===void 0||e===fe)throw new Error("useQueryParams must be used within a QueryParamProvider");return e}function X({children:e,adapter:t,options:n}){const{adapter:r,options:a}=c.useContext(k),i=c.useMemo(()=>({adapter:t??r,options:ue(a,n)}),[t,n,r,a]);return c.createElement(k.Provider,{value:i},e)}function tt({children:e,adapter:t,options:n}){const r=t;return r?c.createElement(r,null,a=>c.createElement(X,{adapter:a,options:n},e)):c.createElement(X,{options:n},e)}function nt(e,t){var n;for(const r in e)((n=t[r])==null?void 0:n.default)!==void 0&&e[r]!==void 0&&t[r].encode(t[r].default)===e[r]&&(e[r]=void 0)}function rt({changes:e,updateType:t,currentSearchString:n,paramConfigMap:r,options:a}){const{searchStringToObject:i,objectToSearchString:s}=a;t==null&&(t=a.updateType);let o;const l=ce(i,n),u=se(r,Object.keys(e),a.params);let d;if(typeof e=="function"){const P=le(l,u,N);d=e(P)}else d=e;o=Ke(u,d),a.removeDefaultsFromUrl&&nt(o,u),o=Ze(o,u);let f;return t==="push"||t==="replace"?f=s(o):f=s({...l,...o}),f?.length&&f[0]!=="?"&&(f=`?${f}`),f??""}function at({searchString:e,adapter:t,navigate:n,updateType:r}){const i={...t.location,search:e};n&&(typeof r=="string"&&r.startsWith("replace")?t.replace(i):t.push(i))}const it=e=>e(),st=e=>setTimeout(()=>e(),0),U=[];function ot(e,{immediate:t}={}){U.push(e);let n=t?it:st;U.length===1&&n(()=>{const r=U.slice();U.length=0;const a=r[0].currentSearchString;let i;for(let s=0;s<r.length;++s){const o=s===0?r[s]:{...r[s],currentSearchString:i};i=rt(o)}e.options.skipUpdateWhenNoChange&&i===a||at({searchString:i??"",adapter:r[r.length-1].adapter,navigate:!0,updateType:r[r.length-1].updateType})})}function lt(e,t){const{adapter:n,options:r}=et(),[a]=c.useState(Ge),{paramConfigMap:i,options:s}=ct(e,t),o=c.useMemo(()=>ue(r,s),[r,s]);let l=Je(i,o);const u=ce(o.searchStringToObject,n.location.search,Ye(l));o.includeAllParams&&(l=se(l,Object.keys(u),o.params,O));const d=a(u,l,N),f=Object.keys(l).join("\0");c.useEffect(()=>{const g=f.split("\0");return N.registerParams(g),()=>{N.unregisterParams(g)}},[f]);const P={adapter:n,paramConfigMap:l,options:o},p=c.useRef(P);p.current==null&&(p.current=P),c.useEffect(()=>{p.current.adapter=n,p.current.paramConfigMap=l,p.current.options=o},[n,l,o]);const[m]=c.useState(()=>(h,v)=>{const{adapter:y,paramConfigMap:j,options:x}=p.current;v==null&&(v=x.updateType),ot({changes:h,updateType:v,currentSearchString:y.location.search,paramConfigMap:j,options:x,adapter:y},{immediate:!x.enableBatching})});return[d,m]}function ct(e,t){let n,r;return e===void 0?(n={},r=t):Array.isArray(e)?(n=Object.fromEntries(e.map(a=>[a,"inherit"])),r=t):(n=e,r=t),{paramConfigMap:n,options:r}}const ut=()=>{const e=ye(),t=E(Se),n=E(Pe),r=E(be),a=E(xe),i=E(Ce),[s,o]=lt({mainDictionary:O,ifcDictionary:O,filterDictionaries:De(Ve,[]),language:O,includeTestDictionaries:We}),l=c.useRef(!0);return c.useEffect(()=>{if(l.current){if(l.current=!1,!Object.values(s).some(m=>Array.isArray(m)?m.length>0:m!=null&&m!==""))e(K(we));else{const m={mainDictionary:s.mainDictionary?{ifcClassification:{type:"IfcClassification",location:s.mainDictionary}}:null,ifcDictionary:s.ifcDictionary?{ifcClassification:{type:"IfcClassification",location:s.ifcDictionary}}:null,filterDictionaries:s.filterDictionaries.map(g=>({ifcClassification:{type:"IfcClassification",location:g}})),language:s.language||"en-GB",includeTestDictionaries:s.includeTestDictionaries||!1};e(K(m))}z.propertyIsInstanceMap&&e(Re(z.propertyIsInstanceMap))}},[s,e]),c.useMemo(()=>({mainDictionary:t,ifcDictionary:n,filterDictionaries:r,language:a,includeTestDictionaries:i}),[t,n,r,a,i]),c.useEffect(()=>{const p={mainDictionary:t?.ifcClassification.location,ifcDictionary:n?.ifcClassification.location,filterDictionaries:r.map(m=>m.ifcClassification.location),language:a,includeTestDictionaries:i};JSON.stringify(s)!==JSON.stringify(p)&&o(p)},[t,n,r,a,i,o,s]),{bsddSearch:p=>{console.log("bsddSearch called with:",p)},bsddSelect:p=>{console.log("bsddSelect called with:",p)},bsddSearchSave:p=>(console.log("bsddSearchSave called with:",p),Promise.resolve("success")),bsddSearchCancel:()=>{console.log("bsddSearchCancel called")}}};function ft(){const{bsddSearchSave:e,bsddSearchCancel:t}=ut(),n={bsddSearchSave:e,bsddSearchCancel:t};return S.jsx(je,{value:n,children:S.jsx(Ee,{children:S.jsxs(w,{defaultValue:"search",children:[S.jsxs(w.List,{grow:!0,children:[S.jsx(w.Tab,{value:"search",children:$("searchTabTitle")}),S.jsx(w.Tab,{value:"settings",children:$("settingsTabTitle")})]}),S.jsx(w.Panel,{value:"search",children:S.jsx(Ne,{})}),S.jsx(w.Panel,{value:"settings",children:S.jsx(_e,{})})]})})})}/**
 * @remix-run/router v1.21.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function T(){return T=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},T.apply(this,arguments)}var C;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(C||(C={}));const Z="popstate";function dt(e){e===void 0&&(e={});function t(r,a){let{pathname:i,search:s,hash:o}=r.location;return B("",{pathname:i,search:s,hash:o},a.state&&a.state.usr||null,a.state&&a.state.key||"default")}function n(r,a){return typeof a=="string"?a:de(a)}return pt(t,n,null,e)}function b(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function ht(){return Math.random().toString(36).substr(2,8)}function H(e,t){return{usr:e.state,key:e.key,idx:t}}function B(e,t,n,r){return n===void 0&&(n=null),T({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?D(t):t,{state:n,key:t&&t.key||r||ht()})}function de(e){let{pathname:t="/",search:n="",hash:r=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),r&&r!=="#"&&(t+=r.charAt(0)==="#"?r:"#"+r),t}function D(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let r=e.indexOf("?");r>=0&&(t.search=e.substr(r),e=e.substr(0,r)),e&&(t.pathname=e)}return t}function pt(e,t,n,r){r===void 0&&(r={});let{window:a=document.defaultView,v5Compat:i=!1}=r,s=a.history,o=C.Pop,l=null,u=d();u==null&&(u=0,s.replaceState(T({},s.state,{idx:u}),""));function d(){return(s.state||{idx:null}).idx}function f(){o=C.Pop;let h=d(),v=h==null?null:h-u;u=h,l&&l({action:o,location:g.location,delta:v})}function P(h,v){o=C.Push;let y=B(g.location,h,v);n&&n(y,h),u=d()+1;let j=H(y,u),x=g.createHref(y);try{s.pushState(j,"",x)}catch(I){if(I instanceof DOMException&&I.name==="DataCloneError")throw I;a.location.assign(x)}i&&l&&l({action:o,location:g.location,delta:1})}function p(h,v){o=C.Replace;let y=B(g.location,h,v);n&&n(y,h),u=d();let j=H(y,u),x=g.createHref(y);s.replaceState(j,"",x),i&&l&&l({action:o,location:g.location,delta:0})}function m(h){let v=a.location.origin!=="null"?a.location.origin:a.location.href,y=typeof h=="string"?h:de(h);return y=y.replace(/ $/,"%20"),b(v,"No window.location.(origin|href) available to create URL for href: "+y),new URL(y,v)}let g={get action(){return o},get location(){return e(a,s)},listen(h){if(l)throw new Error("A history only accepts one active listener");return a.addEventListener(Z,f),l=h,()=>{a.removeEventListener(Z,f),l=null}},createHref(h){return t(a,h)},createURL:m,encodeLocation(h){let v=m(h);return{pathname:v.pathname,search:v.search,hash:v.hash}},push:P,replace:p,go(h){return s.go(h)}};return g}var ee;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(ee||(ee={}));function mt(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,r=e.charAt(n);return r&&r!=="/"?null:e.slice(n)||"/"}function gt(e,t){t===void 0&&(t="/");let{pathname:n,search:r="",hash:a=""}=typeof e=="string"?D(e):e;return{pathname:n?n.startsWith("/")?n:vt(n,t):t,search:xt(r),hash:Ct(a)}}function vt(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(a=>{a===".."?n.length>1&&n.pop():a!=="."&&n.push(a)}),n.length>1?n.join("/"):"/"}function L(e,t,n,r){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function yt(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function St(e,t){let n=yt(e);return t?n.map((r,a)=>a===n.length-1?r.pathname:r.pathnameBase):n.map(r=>r.pathnameBase)}function Pt(e,t,n,r){r===void 0&&(r=!1);let a;typeof e=="string"?a=D(e):(a=T({},e),b(!a.pathname||!a.pathname.includes("?"),L("?","pathname","search",a)),b(!a.pathname||!a.pathname.includes("#"),L("#","pathname","hash",a)),b(!a.search||!a.search.includes("#"),L("#","search","hash",a)));let i=e===""||a.pathname==="",s=i?"/":a.pathname,o;if(s==null)o=n;else{let f=t.length-1;if(!r&&s.startsWith("..")){let P=s.split("/");for(;P[0]==="..";)P.shift(),f-=1;a.pathname=P.join("/")}o=f>=0?t[f]:"/"}let l=gt(a,o),u=s&&s!=="/"&&s.endsWith("/"),d=(i||s===".")&&n.endsWith("/");return!l.pathname.endsWith("/")&&(u||d)&&(l.pathname+="/"),l}const bt=e=>e.join("/").replace(/\/\/+/g,"/"),xt=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,Ct=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e,he=["post","put","patch","delete"];new Set(he);const wt=["get",...he];new Set(wt);/**
 * React Router v6.28.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function _(){return _=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},_.apply(this,arguments)}const Q=c.createContext(null),M=c.createContext(null),V=c.createContext(null),W=c.createContext({outlet:null,matches:[],isDataRoute:!1});function F(){return c.useContext(V)!=null}function pe(){return F()||b(!1),c.useContext(V).location}function me(e){c.useContext(M).static||c.useLayoutEffect(e)}function Rt(){let{isDataRoute:e}=c.useContext(W);return e?Ut():jt()}function jt(){F()||b(!1);let e=c.useContext(Q),{basename:t,future:n,navigator:r}=c.useContext(M),{matches:a}=c.useContext(W),{pathname:i}=pe(),s=JSON.stringify(St(a,n.v7_relativeSplatPath)),o=c.useRef(!1);return me(()=>{o.current=!0}),c.useCallback(function(u,d){if(d===void 0&&(d={}),!o.current)return;if(typeof u=="number"){r.go(u);return}let f=Pt(u,JSON.parse(s),i,d.relative==="path");e==null&&t!=="/"&&(f.pathname=f.pathname==="/"?t:bt([t,f.pathname])),(d.replace?r.replace:r.push)(f,d.state,d)},[t,r,s,i,e])}var ge=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(ge||{}),ve=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(ve||{});function Et(e){let t=c.useContext(Q);return t||b(!1),t}function Ot(e){let t=c.useContext(W);return t||b(!1),t}function Tt(e){let t=Ot(),n=t.matches[t.matches.length-1];return n.route.id||b(!1),n.route.id}function Ut(){let{router:e}=Et(ge.UseNavigateStable),t=Tt(ve.UseNavigateStable),n=c.useRef(!1);return me(()=>{n.current=!0}),c.useCallback(function(a,i){i===void 0&&(i={}),n.current&&(typeof a=="number"?e.navigate(a):e.navigate(a,_({fromRouteId:t},i)))},[e,t])}const te={};function Nt(e,t){te[t]||(te[t]=!0,console.warn(t))}const R=(e,t,n)=>Nt(e,"⚠️ React Router Future Flag Warning: "+t+". "+("You can use the `"+e+"` future flag to opt-in early. ")+("For more information, see "+n+"."));function _t(e,t){e!=null&&e.v7_startTransition||R("v7_startTransition","React Router will begin wrapping state updates in `React.startTransition` in v7","https://reactrouter.com/v6/upgrading/future#v7_starttransition"),!(e!=null&&e.v7_relativeSplatPath)&&(!t||!t.v7_relativeSplatPath)&&R("v7_relativeSplatPath","Relative route resolution within Splat routes is changing in v7","https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath"),t&&(t.v7_fetcherPersist||R("v7_fetcherPersist","The persistence behavior of fetchers is changing in v7","https://reactrouter.com/v6/upgrading/future#v7_fetcherpersist"),t.v7_normalizeFormMethod||R("v7_normalizeFormMethod","Casing of `formMethod` fields is being normalized to uppercase in v7","https://reactrouter.com/v6/upgrading/future#v7_normalizeformmethod"),t.v7_partialHydration||R("v7_partialHydration","`RouterProvider` hydration behavior is changing in v7","https://reactrouter.com/v6/upgrading/future#v7_partialhydration"),t.v7_skipActionErrorRevalidation||R("v7_skipActionErrorRevalidation","The revalidation behavior after 4xx/5xx `action` responses is changing in v7","https://reactrouter.com/v6/upgrading/future#v7_skipactionerrorrevalidation"))}function Dt(e){let{basename:t="/",children:n=null,location:r,navigationType:a=C.Pop,navigator:i,static:s=!1,future:o}=e;F()&&b(!1);let l=t.replace(/^\/*/,"/"),u=c.useMemo(()=>({basename:l,navigator:i,static:s,future:_({v7_relativeSplatPath:!1},o)}),[l,o,i,s]);typeof r=="string"&&(r=D(r));let{pathname:d="/",search:f="",hash:P="",state:p=null,key:m="default"}=r,g=c.useMemo(()=>{let h=mt(d,l);return h==null?null:{location:{pathname:h,search:f,hash:P,state:p,key:m},navigationType:a}},[l,d,f,P,p,m,a]);return g==null?null:c.createElement(M.Provider,{value:u},c.createElement(V.Provider,{children:n,value:g}))}new Promise(()=>{});/**
 * React Router DOM v6.28.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */const Mt="6";try{window.__reactRouterVersion=Mt}catch{}const It="startTransition",ne=Oe[It];function At(e){let{basename:t,children:n,future:r,window:a}=e,i=c.useRef();i.current==null&&(i.current=dt({window:a,v5Compat:!0}));let s=i.current,[o,l]=c.useState({action:s.action,location:s.location}),{v7_startTransition:u}=r||{},d=c.useCallback(f=>{u&&ne?ne(()=>l(f)):l(f)},[l,u]);return c.useLayoutEffect(()=>s.listen(d),[s,d]),c.useEffect(()=>_t(r),[r]),c.createElement(Dt,{basename:t,children:n,location:o.location,navigationType:o.action,navigator:s,future:r})}var re;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(re||(re={}));var ae;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(ae||(ae={}));const Lt=({children:e})=>{var t;const{navigator:n}=c.useContext(M),r=Rt(),a=(t=c.useContext(Q))==null?void 0:t.router,i=pe();return e({replace(o){r(o.search||"?",{replace:!0,state:o.state})},push(o){r(o.search||"?",{replace:!1,state:o.state})},get location(){var o,l,u;return(u=(l=(o=a?.state)==null?void 0:o.location)!=null?l:n?.location)!=null?u:i}})};function kt(){return S.jsx(Ue,{children:S.jsx(At,{children:S.jsx(tt,{adapter:Lt,children:S.jsx(ft,{})})})})}Te.createRoot(document.getElementById("root")).render(S.jsx(kt,{}));