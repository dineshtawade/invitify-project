import{c as ce,r,j as s,a as ne,H as pe}from"./app-BtyuQ_7L.js";import{A as me}from"./app-layout-CY4Ddt2g.js";import{C as U}from"./credit-card-BTcx8eMi.js";import{S as he}from"./smartphone-BezefV0N.js";import{T as xe}from"./tablet-DtUDHhwz.js";import{L as fe}from"./laptop-Bpo0nL5y.js";import{X as te}from"./x-DyHWVgXw.js";import{A as be}from"./arrow-left-BgP4Vl0G.js";import{C as ie}from"./circle-check-B0rX8gC2.js";import{C as ue}from"./calendar-oevUK0mY.js";import{S as ve}from"./shield-check-CpRP83kJ.js";import{A as le}from"./arrow-right-CFb31Hvr.js";import{L as ge}from"./loader-circle-BKHdThkN.js";import{S as ye}from"./sparkles-DqbluR1B.js";import{b as we}from"./shopping-bag-74I7iXLP.js";/* empty css            */import"./index-CIdz1Aml.js";import"./button--IkqMI47.js";import"./index-m6uo7M4F.js";import"./index-T71dAo8o.js";import"./index-BHrwo_iV.js";import"./app-logo-icon-ClciVvkX.js";import"./index-FU4hQHEP.js";import"./index-Dlam8HBW.js";import"./settings-Ddfz4M3r.js";import"./createLucideIcon-D4n0A4I2.js";import"./users-BM_l5ZE9.js";import"./globe-C2PG2BJK.js";import"./wallet-lXHUrOMp.js";import"./mail-C2KZY4Jz.js";import"./briefcase-DpDVgAVe.js";import"./chevron-right-miQOSOON.js";import"./menu-tYHGsJY7.js";const je=[{title:"Customer Dashboard",href:"/customer/dashboard"},{title:"Digital Card Templates",href:"/customer/static-templates"}];function rs(m){const e=ce.c(64),{templates:J,plans:E,razorpayKeyId:Se}=m,re=J===void 0?[]:J;let I;e[0]!==E?(I=E===void 0?[]:E,e[0]=E,e[1]=I):I=e[1];const i=I,[h,oe]=r.useState(""),[x,P]=r.useState(null),[l,S]=r.useState("mobile"),[o,Z]=r.useState(null),[f,d]=r.useState("plan"),[t,c]=r.useState(null),[b,ee]=r.useState(""),[u,n]=r.useState(""),[A,F]=r.useState(!1),[v,g]=r.useState(""),y=ke;let z;e[2]!==y||e[3]!==n?(z=a=>{const C=a.target.value;ee(C),n(y(C))},e[2]=y,e[3]=n,e[4]=z):z=e[4];const G=z;let T;e[5]!==i[0]||e[6]!==i.length||e[7]!==d||e[8]!==c||e[9]!==n?(T=a=>{Z(a),d("plan"),c(i.length>0?i[0]:null),ee(""),n(""),g("")},e[5]=i[0],e[6]=i.length,e[7]=d,e[8]=c,e[9]=n,e[10]=T):T=e[10];const D=T;let M;e[11]!==c?(M=()=>{Z(null),c(null),F(!1),g("")},e[11]=c,e[12]=M):M=e[12];const p=M;let B;e[13]!==t||e[14]!==d?(B=()=>{if(!t){g("Please select a plan.");return}g(""),d("details")},e[13]=t,e[14]=d,e[15]=B):B=e[15];const Q=B;let O;e[16]!==p||e[17]!==b||e[18]!==o||e[19]!==t||e[20]!==u?(O=async a=>{if(a.preventDefault(),!(!o||!t)){F(!0),g("");try{const ae=(await ne.post("/customer/business-cards/draft-create",{template_id:o.id,plan_id:t.id,company_name:b,slug:u})).data;p(),window.location.href=ae.redirect}catch(C){g(C.message||"Something went wrong. Please try again."),F(!1)}}},e[16]=p,e[17]=b,e[18]=o,e[19]=t,e[20]=u,e[21]=O):O=e[21];const W=O;let L;e[22]!==h?(L=a=>a.name.toLowerCase().includes(h.toLowerCase()),e[22]=h,e[23]=L):L=e[23];const se=re.filter(L),$=_e,H=me,K=je;let w;e[24]===Symbol.for("react.memo_cache_sentinel")?(w=s.jsx(pe,{children:s.jsx("title",{children:"Digital Card Themes"})}),e[24]=w):w=e[24];const de="flex h-full flex-1 flex-col gap-6 p-6";let q;e[25]===Symbol.for("react.memo_cache_sentinel")?(q=s.jsxs("div",{className:"flex flex-col gap-1",children:[s.jsxs("h1",{className:"text-3xl font-bold font-serif tracking-tight text-[#3e3832] flex items-center gap-2",children:["Digital Business Card Themes ",s.jsx(ye,{className:"size-6 text-[#d3c0a3]"})]}),s.jsx("p",{className:"text-sm text-[#706557]",children:"Select from our premium designs, customize layouts, and connect instantly."})]}),e[25]=q):q=e[25];let Y;e[26]===Symbol.for("react.memo_cache_sentinel")?(Y=s.jsx(we,{className:"absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#706557]"}),e[26]=Y):Y=e[26];let V;e[27]===Symbol.for("react.memo_cache_sentinel")?(V=a=>oe(a.target.value),e[27]=V):V=e[27];let j;e[28]!==h?(j=s.jsxs("div",{className:"flex flex-col md:flex-row md:items-center md:justify-between gap-4",children:[q,s.jsxs("div",{className:"relative w-full md:w-80",children:[Y,s.jsx("input",{type:"text",value:h,onChange:V,placeholder:"Search themes (e.g. Template 12)...",className:"w-full rounded-xl border border-[#ebd9c1] bg-[#fdfbf7] pl-10 pr-4 py-2.5 text-sm text-[#3e3832] placeholder:text-[#706557]/60 focus:border-[#3d5644] focus:outline-none transition-colors"})]})]}),e[28]=h,e[29]=j):j=e[29];const X=se.length===0?s.jsx("div",{className:"flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#ebd9c1] bg-[#fdfbf7]",children:s.jsx("p",{className:"text-[#706557] text-sm",children:"No templates match your search query."})}):s.jsx("div",{className:"grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",children:se.map(a=>s.jsxs("div",{className:"group bg-[#fdfbf7] border border-[#ebd9c1] rounded-2xl p-3 shadow-sm flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-md hover:border-[#d3c0a3]",children:[s.jsx("div",{className:"relative w-full aspect-[9/18] bg-[#1a1a1a] rounded-[24px] overflow-hidden border-[4px] border-[#1a1a1a] shadow-lg flex flex-col p-1 transition-all",children:s.jsxs("div",{className:"relative w-full h-full bg-white rounded-[18px] overflow-hidden",children:[s.jsx("div",{className:"absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#1a1a1a] rounded-b-xl z-10 flex justify-center items-center",children:s.jsx("div",{className:"w-2 h-2 rounded-full bg-black shadow-inner"})}),s.jsx("img",{src:a.thumbnail,alt:a.name,className:"w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105",loading:"lazy",onError:Ne})]})}),s.jsxs("div",{className:"mt-4 px-1 text-center",children:[s.jsx("span",{className:"font-bold font-serif text-md text-[#3e3832] block mb-4 truncate",children:a.name}),s.jsxs("button",{onClick:()=>D(a),className:"w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#ebd9c1] hover:bg-[#e0ccb2] text-[#4a4238] border border-[#d3c0a3] rounded text-[11px] font-bold font-serif tracking-wide shadow-sm transition-colors uppercase",children:[s.jsx(U,{className:"size-3.5"})," Purchase / Use"]})]})]},a.id))});let N;e[30]!==j||e[31]!==X?(N=s.jsxs("div",{className:de,children:[j,X]}),e[30]=j,e[31]=X,e[32]=N):N=e[32];let _;e[33]!==$||e[34]!==D||e[35]!==l||e[36]!==x||e[37]!==S||e[38]!==P?(_=x&&s.jsx("div",{className:"fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4",children:s.jsxs("div",{className:"w-full max-w-5xl h-[90vh] bg-[#fdfbf7] rounded-2xl border border-[#ebd9c1] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200",children:[s.jsxs("div",{className:"p-4 border-b border-[#ebd9c1] flex items-center justify-between text-[#706557] bg-[#fdfbf7]",children:[s.jsxs("div",{children:[s.jsx("h3",{className:"font-bold font-serif text-[#3e3832] text-md",children:x.name}),s.jsx("p",{className:"text-[11px] uppercase tracking-widest font-bold",children:"Live CSS preview"})]}),s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsxs("div",{className:"flex gap-1 border border-[#ebd9c1] rounded-lg p-0.5",children:[s.jsx("button",{onClick:()=>S("mobile"),className:`p-1.5 rounded ${l==="mobile"?"bg-[#3d5644] text-[#fdfbf7]":"hover:bg-[#ebd9c1]/30 hover:text-[#3e3832]"}`,title:"Mobile",children:s.jsx(he,{className:"size-4"})}),s.jsx("button",{onClick:()=>S("tablet"),className:`p-1.5 rounded ${l==="tablet"?"bg-[#3d5644] text-[#fdfbf7]":"hover:bg-[#ebd9c1]/30 hover:text-[#3e3832]"}`,title:"Tablet",children:s.jsx(xe,{className:"size-4"})}),s.jsx("button",{onClick:()=>S("desktop"),className:`p-1.5 rounded ${l==="desktop"?"bg-[#3d5644] text-[#fdfbf7]":"hover:bg-[#ebd9c1]/30 hover:text-[#3e3832]"}`,title:"Desktop",children:s.jsx(fe,{className:"size-4"})})]}),s.jsxs("button",{onClick:()=>{P(null),D(x)},className:"inline-flex items-center gap-1.5 px-4 py-2 bg-[#ebd9c1] hover:bg-[#e0ccb2] text-[#4a4238] border border-[#d3c0a3] rounded-lg text-xs font-bold font-serif tracking-wide shadow-sm transition-colors uppercase",children:[s.jsx(U,{className:"size-3.5"})," Choose this Template"]}),s.jsx("button",{onClick:()=>P(null),className:"p-1 text-[#706557] hover:text-[#3e3832] rounded-lg hover:bg-[#ebd9c1]/50 transition-colors",children:s.jsx(te,{className:"size-5"})})]})]}),s.jsx("div",{className:"flex-1 w-full flex items-center justify-center p-6 overflow-hidden bg-[#ebd9c1]/20",children:s.jsxs("div",{className:`shadow-2xl flex flex-col transition-all duration-300 relative shrink-0 ${l==="mobile"?"w-[375px] aspect-[9/19.5] max-h-full bg-[#1a1a1a] border-[6px] border-[#1a1a1a] rounded-[44px] p-2":l==="tablet"?"w-[768px] aspect-[3/4] max-h-full bg-[#1a1a1a] border-[8px] border-[#1a1a1a] rounded-[32px] p-2":"w-full h-full bg-white rounded-xl shadow-none"}`,children:[l!=="desktop"&&s.jsx("div",{className:"absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1a1a] rounded-b-2xl z-20 flex justify-center items-center",children:s.jsx("div",{className:"size-2 bg-black/80 shadow-inner rounded-full"})}),s.jsx("div",{className:`w-full h-full bg-white overflow-hidden relative ${l==="mobile"?"rounded-[34px]":l==="tablet"?"rounded-[22px]":"rounded-xl border border-[#ebd9c1]"}`,children:s.jsx("iframe",{title:"Template Viewport",srcDoc:$(x.css_file),className:"w-full h-full border-0 select-none overflow-y-auto bg-white"})})]})})]})}),e[33]=$,e[34]=D,e[35]=l,e[36]=x,e[37]=S,e[38]=P,e[39]=_):_=e[39];let k;e[40]!==p||e[41]!==b||e[42]!==y||e[43]!==G||e[44]!==W||e[45]!==Q||e[46]!==A||e[47]!==v||e[48]!==i||e[49]!==f||e[50]!==o||e[51]!==t||e[52]!==d||e[53]!==c||e[54]!==n||e[55]!==u?(k=o&&s.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",children:s.jsxs("div",{className:"w-full max-w-2xl bg-[#fdfbf7] rounded-2xl shadow-2xl border border-[#ebd9c1] overflow-hidden animate-in fade-in zoom-in duration-200",children:[s.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-[#ebd9c1]",children:[s.jsxs("div",{className:"flex items-center gap-3",children:[f==="details"&&s.jsx("button",{onClick:()=>d("plan"),className:"p-1 hover:bg-[#ebd9c1]/50 rounded-lg transition-colors text-[#706557]",children:s.jsx(be,{className:"size-4"})}),s.jsxs("div",{children:[s.jsx("h2",{className:"text-lg font-bold font-serif text-[#3e3832]",children:f==="plan"?"Choose a Subscription Plan":"Your Card Details"}),s.jsxs("p",{className:"text-xs text-[#706557] font-bold tracking-wider uppercase",children:[o.name," — ",o.css_file]})]})]}),s.jsx("button",{onClick:p,className:"p-1.5 hover:bg-[#ebd9c1]/50 rounded-lg text-[#706557]",children:s.jsx(te,{className:"size-4"})})]}),f==="plan"&&s.jsx("div",{className:"p-6 flex flex-col gap-5",children:i.length===0?s.jsxs("div",{className:"text-center py-10 text-[#706557]",children:[s.jsx(U,{className:"size-8 mx-auto mb-2 opacity-40"}),s.jsx("p",{className:"text-sm",children:"No subscription plans available. Please contact the admin."})]}):s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"grid gap-4 sm:grid-cols-2",children:i.map(a=>s.jsxs("button",{onClick:()=>c(a),className:`relative flex flex-col gap-2 rounded-2xl border-2 p-5 text-left transition-all cursor-pointer ${t?.id===a.id?"border-[#3d5644] bg-[#3d5644]/5 shadow-md":"border-[#ebd9c1] hover:border-[#d3c0a3]"}`,children:[t?.id===a.id&&s.jsx("span",{className:"absolute top-3 right-3",children:s.jsx(ie,{className:"size-4 text-[#3d5644]"})}),s.jsxs("div",{className:"flex items-center gap-2 text-[#706557]",children:[s.jsx(ue,{className:"size-4"}),s.jsxs("span",{className:"text-xs font-semibold uppercase tracking-widest",children:[a.duration_months," Month",a.duration_months>1?"s":""]})]}),s.jsxs("div",{className:"text-2xl font-black text-[#3e3832] font-serif",children:["₹",a.price.toLocaleString("en-IN"),s.jsxs("span",{className:"text-xs font-bold font-sans text-[#706557] ml-1",children:["/",a.duration_months,"mo"]})]}),s.jsx("p",{className:"font-bold text-sm text-[#4a4238] font-serif",children:a.name}),a.description&&s.jsx("p",{className:"text-xs text-[#706557] leading-relaxed",children:a.description})]},a.id))}),s.jsxs("div",{className:"flex items-center justify-center gap-6 py-2 text-[#706557]",children:[s.jsxs("span",{className:"flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest",children:[s.jsx(ve,{className:"size-3.5 text-[#3d5644]"})," Secure Payment"]}),s.jsxs("span",{className:"flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest",children:[s.jsx(U,{className:"size-3.5 text-[#3d5644]"})," Razorpay"]}),s.jsxs("span",{className:"flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest",children:[s.jsx(ie,{className:"size-3.5 text-[#d3c0a3]"})," Instant Access"]})]}),v&&s.jsx("p",{className:"text-red-500 text-xs text-center font-bold",children:v}),s.jsxs("div",{className:"flex gap-3 justify-end",children:[s.jsx("button",{onClick:p,className:"px-4 py-2 rounded-xl border border-[#ebd9c1] text-sm font-bold text-[#706557] hover:bg-[#ebd9c1]/30 transition-colors uppercase tracking-widest",children:"Cancel"}),s.jsxs("button",{onClick:Q,disabled:!t,className:"flex items-center gap-2 px-5 py-2 rounded-xl bg-[#3d5644] hover:bg-[#2d4033] text-white text-sm font-bold font-serif shadow-sm disabled:opacity-50 transition-colors tracking-wide uppercase",children:["Next ",s.jsx(le,{className:"size-4"})]})]})]})}),f==="details"&&s.jsxs("form",{onSubmit:W,className:"p-6 flex flex-col gap-5",children:[t&&s.jsxs("div",{className:"flex items-center justify-between rounded-xl bg-[#ebd9c1]/20 border border-[#ebd9c1] px-4 py-3",children:[s.jsxs("div",{children:[s.jsx("p",{className:"text-xs font-bold text-[#3e3832] uppercase tracking-widest",children:t.name}),s.jsxs("p",{className:"text-[11px] text-[#706557] font-bold",children:[t.duration_months," months"]})]}),s.jsxs("span",{className:"text-xl font-black text-[#3d5644] font-serif",children:["₹",t.price.toLocaleString("en-IN")]})]}),s.jsxs("div",{className:"flex flex-col gap-1.5",children:[s.jsx("label",{className:"text-xs font-bold uppercase tracking-widest text-[#706557]",children:"Company / Business Name"}),s.jsx("input",{type:"text",required:!0,value:b,onChange:G,placeholder:"e.g. Acme Corporation",className:"w-full rounded-xl border border-[#ebd9c1] bg-white px-3 py-2.5 text-sm text-[#3e3832] focus:border-[#3d5644] focus:outline-none placeholder:text-[#706557]/50 transition-colors"})]}),s.jsxs("div",{className:"flex flex-col gap-1.5",children:[s.jsx("label",{className:"text-xs font-bold uppercase tracking-widest text-[#706557]",children:"Card URL"}),s.jsxs("div",{className:"flex items-center rounded-xl border border-[#ebd9c1] bg-white overflow-hidden transition-colors focus-within:border-[#3d5644]",children:[s.jsx("span",{className:"px-3 py-2.5 text-[11px] font-mono bg-[#fdfbf7] text-[#706557] border-r border-[#ebd9c1]",children:"/card/"}),s.jsx("input",{type:"text",required:!0,value:u,onChange:a=>n(y(a.target.value)),placeholder:"acme-corporation",className:"w-full bg-transparent px-3 py-2.5 text-sm text-[#3e3832] focus:outline-none placeholder:text-[#706557]/50"})]})]}),v&&s.jsx("p",{className:"text-red-500 text-xs text-center bg-red-50 rounded-lg py-2 px-3 font-bold",children:v}),s.jsxs("div",{className:"flex gap-3 justify-end",children:[s.jsx("button",{type:"button",onClick:p,className:"px-4 py-2 rounded-xl border border-[#ebd9c1] text-[#706557] text-sm font-bold uppercase tracking-widest hover:bg-[#ebd9c1]/30 transition-colors",children:"Cancel"}),s.jsx("button",{type:"submit",disabled:A,className:"flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3d5644] hover:bg-[#2d4033] text-white text-sm font-bold font-serif shadow-sm disabled:opacity-70 transition-colors uppercase tracking-wide",children:A?s.jsxs(s.Fragment,{children:[s.jsx(ge,{className:"size-4 animate-spin"})," Creating..."]}):s.jsxs(s.Fragment,{children:[s.jsx(le,{className:"size-4"})," Create & Preview"]})})]})]})]})}),e[40]=p,e[41]=b,e[42]=y,e[43]=G,e[44]=W,e[45]=Q,e[46]=A,e[47]=v,e[48]=i,e[49]=f,e[50]=o,e[51]=t,e[52]=d,e[53]=c,e[54]=n,e[55]=u,e[56]=k):k=e[56];let R;return e[57]!==H||e[58]!==K||e[59]!==w||e[60]!==N||e[61]!==_||e[62]!==k?(R=s.jsxs(H,{breadcrumbs:K,children:[w,N,_,k]}),e[57]=H,e[58]=K,e[59]=w,e[60]=N,e[61]=_,e[62]=k,e[63]=R):R=e[63],R}function Ne(m){m.target.src="/images/business-cards/template1.png"}function _e(m){return`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                    <link rel="stylesheet" href="/css/business-cards/${m}">
                    <style>
                        * { box-sizing: border-box; }
                        body {
                            margin: 0;
                            padding: 0 0 80px 0;
                            display: flex;
                            justify-content: center;
                            min-height: 100vh;
                        }
                        .preview-wrapper {
                            width: 100%;
                            max-width: 420px;
                            min-height: 100vh;
                        }
                        .card, .card2 {
                            width: 100% !important;
                            max-width: 100% !important;
                            box-sizing: border-box !important;
                        }
                        input, textarea, select {
                            display: block;
                            width: 100%;
                            margin: 6px auto;
                            padding: 10px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            font-size: 13px;
                        }
                        input[type=submit] {
                            cursor: pointer;
                            width: auto;
                            margin: 8px auto;
                            display: block;
                        }
                        input[type=radio] { width: auto; display: inline; margin: 0 4px 0 0; }
                        .share_box { display: block !important; }
                        .card2 iframe {
                            margin: 8px auto;
                            position: relative;
                            border-radius: 5px;
                            width: 100%;
                            min-height: 220px;
                            display: block;
                        }
                    </style>
                </head>
                <body>
                    <div class="preview-wrapper">

                        <!-- ===== HERO CARD ===== -->
                        <div class="card" id="home">
                            <div class="card_content">
                                <img src="/theinvitify-removebg-preview.png" alt="Logo" style="max-height:80px; border-radius:8px; object-fit:contain;">
                            </div>
                            <div class="card_content2">
                                <h2>Demo Enterprises</h2>
                                <p>John Doe</p>
                                <p>Managing Director</p>
                            </div>

                            <!-- Quick Action Buttons -->
                            <div class="dis_flex">
                                <a href="#"><div class="link_btn"><i class="fa fa-phone"></i> Call</div></a>
                                <a href="#"><div class="link_btn"><i class="fa fa-whatsapp"></i> WhatsApp</div></a>
                                <a href="#"><div class="link_btn"><i class="fa fa-map-marker"></i> Direction</div></a>
                                <a href="#"><div class="link_btn"><i class="fa fa-envelope"></i> Mail</div></a>
                                <a href="#"><div class="link_btn"><i class="fa fa-globe"></i> Website</div></a>
                            </div>

                            <!-- Contact Details -->
                            <div class="contact_details">
                                <div class="contact_d"><i class="fa fa-phone"></i><p>+91 9876543210</p></div>
                                <div class="contact_d"><i class="fa fa-phone"></i><p>+91 9123456780</p></div>
                                <div class="contact_d"><i class="fa fa-envelope"></i><p>john.doe@company.com</p></div>
                                <div class="contact_d"><i class="fa fa-map-marker"></i><p>Tech Park, Mumbai, India</p></div>
                            </div>

                            <!-- WhatsApp Share Input -->
                            <div class="dis_flex">
                                <div class="share_wtsp">
                                    <form>
                                        <input type="text" name="phone" placeholder="WhatsApp Number with Country code" value="+91">
                                        <div class="wtsp_share_btn"><i class="fa fa-whatsapp"></i> Share</div>
                                    </form>
                                </div>
                            </div>

                            <!-- Save to Contacts & Share -->
                            <div class="dis_flex">
                                <div class="big_btns">Save to Contacts <i class="fa fa-download"></i></div>
                                <div class="big_btns">Share <i class="fa fa-share-alt"></i></div>
                            </div>

                            <!-- Share Box (always visible in preview) -->
                            <div class="share_box">
                                <div class="close">&times;</div>
                                <p>Share My Digital Card</p>
                                <a href="#"><div class="shar_btns"><i class="fa fa-whatsapp"></i><p>WhatsApp</p></div></a>
                                <a href="#"><div class="shar_btns"><i class="fa fa-comment"></i><p>SMS</p></div></a>
                                <a href="#"><div class="shar_btns"><i class="fa fa-facebook"></i><p>Facebook</p></div></a>
                                <a href="#"><div class="shar_btns"><i class="fa fa-twitter"></i><p>Twitter</p></div></a>
                                <a href="#"><div class="shar_btns"><i class="fa fa-instagram"></i><p>Instagram</p></div></a>
                                <a href="#"><div class="shar_btns"><i class="fa fa-linkedin"></i><p>Linkedin</p></div></a>
                            </div>

                            <!-- Social Media Icons -->
                            <div class="dis_flex">
                                <a href="#"><div class="social_med"><i class="fa fa-facebook"></i></div></a>
                                <a href="#"><div class="social_med"><i class="fa fa-youtube"></i></div></a>
                                <a href="#"><div class="social_med"><i class="fa fa-twitter"></i></div></a>
                                <a href="#"><div class="social_med"><i class="fa fa-instagram"></i></div></a>
                            </div>
                        </div>

                        <!-- ===== QR CODE ===== -->
                        <div class="card2" id="qr_section">
                            <h3>Scan QR Code to go to Visiting Card</h3>
                            <img
                                src="https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=https://invitify.in/demo-enterprises"
                                alt="QR Code"
                                id="qr_code_d"
                                style="display:block;margin:10px auto;"
                            >
                        </div>

                        <!-- ===== ABOUT US ===== -->
                        <div class="card2" id="about_us">
                            <h3>About Us</h3>
                            <p>Est. 2015</p>
                            <p>We are a leading provider of innovative digital solutions, helping small businesses design modern portfolios and engage customers globally. Our team delivers high-quality services with a commitment to excellence.</p>
                        </div>

                        <!-- ===== SHOP ONLINE ===== -->
                        <div class="card2" id="shop_online">
                            <h3>Shop Online</h3>
                            <h3>From Our Store</h3>
                            <div class="order_box">
                                <h2>Premium Package</h2>
                                <p><del><i class="fa fa-rupee"></i>2999</del></p>
                                <h4>1999 <i class="fa fa-rupee"></i></h4>
                                <a href="#"><div class="btn_buy">Enquiry</div></a>
                            </div>
                            <div class="order_box">
                                <h2>Starter Pack</h2>
                                <p><del><i class="fa fa-rupee"></i>1499</del></p>
                                <h4>999 <i class="fa fa-rupee"></i></h4>
                                <a href="#"><div class="btn_buy">Enquiry</div></a>
                            </div>
                        </div>

                        <!-- ===== YOUTUBE VIDEOS ===== -->
                        <div class="card2" id="youtube_video">
                            <h3>Youtube Videos</h3>
                            <iframe
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                frameborder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                            </iframe>
                        </div>

                        <!-- ===== PRODUCTS & SERVICES ===== -->
                        <div class="card2" id="product_services">
                            <h3>Products &amp; Services</h3>
                            <div class="product_s">
                                <p>Web Design</p>
                                <div class="d_dis">
                                    <p>Professional website design tailored to your brand.</p>
                                    <br><br>
                                    <a href="#"><div class="btn_buy">Enquiry Now</div></a>
                                </div>
                            </div>
                            <div class="product_s">
                                <p>Digital Marketing</p>
                                <div class="d_dis">
                                    <p>Grow your business with result-driven digital campaigns.</p>
                                    <br><br>
                                    <a href="#"><div class="btn_buy">Enquiry Now</div></a>
                                </div>
                            </div>
                            <div class="product_s">
                                <p>Mobile App Development</p>
                                <div class="d_dis">
                                    <p>Custom mobile apps for Android &amp; iOS platforms.</p>
                                    <br><br>
                                    <a href="#"><div class="btn_buy">Enquiry Now</div></a>
                                </div>
                            </div>
                        </div>

                        <!-- ===== IMAGE GALLERY ===== -->
                        <div class="card2" id="gallery">
                            <h3>Image Gallery</h3>
                            <div class="img_gall">
                                <img src="https://picsum.photos/seed/gall1/300/200" alt="Gallery Image" style="width:100%;border-radius:6px;margin-bottom:8px;">
                            </div>
                            <div class="img_gall">
                                <img src="https://picsum.photos/seed/gall2/300/200" alt="Gallery Image" style="width:100%;border-radius:6px;margin-bottom:8px;">
                            </div>
                        </div>

                        <!-- ===== PAYMENT INFO ===== -->
                        <div class="card2" id="payment">
                            <h3>Payment Info</h3>
                            <h2>Paytm</h2><p>+91 9876543210</p>
                            <h2>Google Pay</h2><p>+91 9876543210</p>
                            <h2>PhonePe</h2><p>+91 9876543210</p>
                            <h3>Bank Account Details</h3>
                            <h2>Name:</h2><p>Demo Enterprises</p>
                            <h2>Account Number:</h2><p>1234 5678 9012</p>
                            <h2>IFSC Code:</h2><p>DEMO0001234</p>
                            <h2>BANK Name:</h2><p>State Bank of India</p>
                            <h3>GST Number</h3>
                            <h2>GST No:</h2><p>22AAAAA0000A1Z5</p>
                        </div>

                        <!-- ===== FEEDBACK ===== -->
                        <div class="card2" id="feedback">
                            <h3>Feedback</h3>
                            <form id="feedback_form">
                                <p class="select_star">Select Star</p>
                                <div class="rating">
                                    <label><input type="radio" name="r_star" value="1"><span class="icon">★</span></label>
                                    <label><input type="radio" name="r_star" value="2"><span class="icon">★</span><span class="icon">★</span></label>
                                    <label><input type="radio" name="r_star" value="3"><span class="icon">★</span><span class="icon">★</span><span class="icon">★</span></label>
                                    <label><input type="radio" name="r_star" value="4"><span class="icon">★</span><span class="icon">★</span><span class="icon">★</span><span class="icon">★</span></label>
                                    <label><input type="radio" name="r_star" value="5" checked><span class="icon">★</span><span class="icon">★</span><span class="icon">★</span><span class="icon">★</span><span class="icon">★</span></label>
                                </div>
                                <input type="text" name="r_name" placeholder="Your name">
                                <input type="email" name="r_email" placeholder="Your email id">
                                <input type="number" name="r_contact" placeholder="Your contact">
                                <textarea name="r_msg" placeholder="Your feedback"></textarea>
                                <input type="submit" value="Submit Feedback">
                                <p class="note">Note: for privecy and security reasons we do not show your contact details.</p>
                            </form>
                        </div>

                        <!-- ===== LOCATION / MAP ===== -->
                        <div class="card2" id="address" style="text-align:center;">
                            <h3>Location Address</h3>
                            <span style="font-size:13px;text-align:center;color:#3f51b5;">
                                Showing result:
                                <a href="https://www.google.com/maps/search/Mumbai+India" target="_blank" style="color:#3f51b5;">
                                    Tech Park, Mumbai, India <i class="fa fa-external-link"></i>
                                </a>
                            </span>
                            <br>
                            <iframe
                                width="100%"
                                height="260"
                                frameborder="0"
                                scrolling="no"
                                marginheight="0"
                                marginwidth="0"
                                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Mumbai,India&t=&z=14&ie=UTF8&iwloc=B&output=embed">
                            </iframe>
                        </div>

                        <!-- ===== CONTACT US ===== -->
                        <div class="card2" id="enquery">
                            <form>
                                <h3>Contact Us</h3>
                                <input type="text" name="c_name" placeholder="Enter Your Name">
                                <input type="text" name="c_contact" maxlength="13" placeholder="Enter Your Mobile No">
                                <input type="email" name="c_email" placeholder="Enter Your Email Address">
                                <textarea name="c_msg" placeholder="Enter your Message or Query"></textarea>
                                <input type="submit" value="Send!">
                            </form>
                            <br>
                            <div style="background:linear-gradient(45deg,black,black);color:white;padding:20px;border-radius:2px;margin:11px auto;font-size:9px;text-align:center;cursor:pointer;">
                                Create Your Card
                            </div>
                        </div>

                        <br><br><br><br>

                        <!-- ===== BOTTOM STICKY NAVIGATION MENU ===== -->
                        <div class="menu_bottom">
                            <div class="menu_container">
                                <div class="menu_item" onclick="document.getElementById('home').scrollIntoView()"><i class="fa fa-home"></i> Home</div>
                                <div class="menu_item" onclick="document.getElementById('about_us').scrollIntoView()"><i class="fa fa-briefcase"></i>About Us</div>
                                <div class="menu_item" onclick="document.getElementById('product_services').scrollIntoView()"><i class="fa fa-ticket"></i>Product &amp; Services</div>
                                <div class="menu_item" onclick="document.getElementById('shop_online').scrollIntoView()"><i class="fa fa-archive"></i>Shop</div>
                                <div class="menu_item" onclick="document.getElementById('gallery').scrollIntoView()"><i class="fa fa-image"></i>Gallery</div>
                                <div class="menu_item" onclick="document.getElementById('youtube_video').scrollIntoView()"><i class="fa fa-video-camera"></i>Youtube Videos</div>
                                <div class="menu_item" onclick="document.getElementById('payment').scrollIntoView()"><i class="fa fa-money"></i>Payment</div>
                                <div class="menu_item" onclick="document.getElementById('enquery').scrollIntoView()"><i class="fa fa-comment"></i>Enquery</div>
                            </div>
                        </div>

                    </div>
                </body>
            </html>
        `}function ke(m){return m.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-")}export{rs as default};
