import{u as b,r as f,h as d,i as l,a7 as n,m as S,a8 as h,k as p}from"./defaultSettings-0c220327.js";const I=()=>{const e=b();return f.useEffect(()=>{let a,s;const g=async()=>{try{await window.CefSharp?.BindObjectAsync("bsddBridge"),window.bsddBridge?(await window.bsddBridge.loadBridgeData().then(o=>{console.log("CefSharp loadBridgeData.");const c=JSON.parse(o);console.log("CefSharp bsddBridgeData:",c);const{ifcData:t,settings:r,propertyIsInstanceMap:i}=c;r&&(e(d(r)),console.log("CefSharp settings:",r)),t?.length>0&&(e(n(t)),e(h(t[0])),console.log("CefSharp initial IFC entities:",t)),i&&(e(p(i)),console.log("CefSharp propertyIsInstanceMap:",i))}),window.updateSelection=o=>{e(n(o)),console.log("CefSharp updateSelection:",o)},window.updateSettings=async o=>{e(d(o)),console.log("CefSharp updateSettings:",o)},console.log("CefSharp connection and global functions are set up successfully.")):(console.error("Failed to bind the bsddBridge object."),e(d(l)))}catch(o){console.error("Error setting up CefSharp connection:",o)}};return a=setInterval(()=>{window.CefSharp?(clearInterval(a),clearTimeout(s),g()):console.log("Waiting for CefSharp to be available...")},100),s=setTimeout(()=>{clearInterval(a),console.log("CefSharp not available, loading default settings."),e(d(l)),e(n(S?.ifcData||[]))},1e3),()=>{clearInterval(a),clearTimeout(s)}},[e]),{bsddSearch:a=>{const s=JSON.stringify(a);window?.bsddBridge?.bsddSearch?window.bsddBridge.bsddSearch(s):console.error("bsddBridge or bsddSearch method is not available.")},bsddSelect:a=>{const s=JSON.stringify(a);window?.bsddBridge?.bsddSelect?window.bsddBridge.bsddSelect(s):console.error("bsddBridge or bsddSelect method is not available.")},bsddSearchSave:a=>{const s=JSON.stringify(a);return console.log("bsddBridge save:",s),window?.bsddBridge?.save?window.bsddBridge.save(s):(console.error("bsddBridge or save method is not available."),Promise.resolve("error"))},bsddSearchCancel:()=>{window?.bsddBridge?.cancel?window.bsddBridge.cancel():console.error("bsddBridge or cancel method is not available.")}}};export{I as u};