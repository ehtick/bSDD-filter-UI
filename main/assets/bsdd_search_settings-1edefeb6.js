import{r as l,j as e,A as u,t as r,c as h,a as x}from"./defaultSettings-c2cfe3bc.js";import{B as j}from"./BsddSearch-af895ea5.js";import{C as m,T as s,S as p}from"./SettingsComponent-1517ba55.js";import{u as T,B as b,Q as v,R as g}from"./index-6038c9bb.js";const a="search";function S(){const{bsddSearchSave:t,bsddSearchCancel:n}=T(),[i,c]=l.useState(a),o={bsddSearchSave:t,bsddSearchCancel:n};return e.jsx(u,{value:o,children:e.jsx(m,{children:e.jsxs(s,{defaultValue:a,onChange:d=>c(d??a),children:[e.jsxs(s.List,{grow:!0,children:[e.jsx(s.Tab,{value:"search",children:r("searchTabTitle")}),e.jsx(s.Tab,{value:"settings",children:r("settingsTabTitle")})]}),e.jsx(s.Panel,{value:"search",children:e.jsx(j,{})}),e.jsx(s.Panel,{value:"settings",children:e.jsx(p,{activeTab:i=="settings"})})]})})})}function f(){return e.jsx(x,{children:e.jsx(b,{children:e.jsx(v,{adapter:g,children:e.jsx(S,{})})})})}h.createRoot(document.getElementById("root")).render(e.jsx(f,{}));
