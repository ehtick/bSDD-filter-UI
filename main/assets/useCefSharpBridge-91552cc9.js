import{u as b,b as p,s as h,r as w,d,e as l,f as g,m as u,g as f,h as B,i as v,k as C}from"./defaultSettings-f426fabb.js";const k=()=>{const e=b();return p(h),w.useEffect(()=>{let t,s;const S=async()=>{try{if(await window.CefSharp?.BindObjectAsync("bsddBridge"),window.bsddBridge){window.updateSelection=async a=>{e(g(a)),console.log("CefSharp updateSelection:",a)},window.updateEditSelection=async a=>{e(f(a)),console.log("CefSharp updateEditSelection:",a)},window.updateSettings=async a=>{e(d(a)),console.log("CefSharp updateSettings:",a)};const i=await window.bsddBridge.loadBridgeData();console.log("CefSharp loadBridgeData.");const c=JSON.parse(i);console.log("CefSharp bsddBridgeData:",c);const{ifcData:o,settings:r,propertyIsInstanceMap:n}=c;if(r&&(await e(d(r)),console.log("CefSharp settings:",r)),o?.length>0){const a=B(o);await e(f(o)),a&&e(v(a))}n&&(e(C(n)),console.log("CefSharp propertyIsInstanceMap:",n)),console.log("CefSharp connection and global functions are set up successfully.")}else console.error("Failed to bind the bsddBridge object."),await e(d(l))}catch(i){console.error("Error setting up CefSharp connection:",i)}};return t=setInterval(()=>{window.CefSharp?(clearInterval(t),clearTimeout(s),S()):console.log("Waiting for CefSharp to be available...")},100),s=setTimeout(()=>{clearInterval(t),console.log("CefSharp not available, loading default settings."),e(d(l)),e(g(u?.ifcData||[]))},1e3),()=>{clearInterval(t),clearTimeout(s)}},[e]),{bsddSearch:t=>{const s=JSON.stringify(t);window?.bsddBridge?.bsddSearch?window.bsddBridge.bsddSearch(s):console.error("bsddBridge or bsddSearch method is not available.")},bsddSelect:t=>{const s=JSON.stringify(t);window?.bsddBridge?.bsddSelect?window.bsddBridge.bsddSelect(s):console.error("bsddBridge or bsddSelect method is not available.")},bsddSearchSave:t=>{const s=JSON.stringify(t);return console.log("bsddBridge save:",s),window?.bsddBridge?.save?window.bsddBridge.save(s):(console.error("bsddBridge or save method is not available."),Promise.resolve("error"))},bsddSearchCancel:()=>{window?.bsddBridge?.cancel?window.bsddBridge.cancel():console.error("bsddBridge or cancel method is not available.")}}};export{k as u};