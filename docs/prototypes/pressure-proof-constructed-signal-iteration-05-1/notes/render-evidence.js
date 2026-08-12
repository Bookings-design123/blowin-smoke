const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const BASE = "http://127.0.0.1:8765/docs/prototypes/pressure-proof-constructed-signal-iteration-05-1/";
const BROWSER = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const surfaces = [
  ["01-home", "pages/01-home.html"], ["02-vape-nicotine-division", "pages/02-vape-nicotine-division.html"],
  ["03-shared-category", "pages/03-shared-category.html"], ["04-universal-pdp", "pages/04-universal-pdp.html"],
  ["05-fitted-component-pdp", "pages/05-fitted-component-pdp.html"], ["06-quick-cart", "pages/06-quick-cart.html"],
  ["07-full-cart", "pages/07-full-cart.html"], ["08-thca-division", "pages/08-thca-division.html"],
  ["09-glass-accessories-division", "pages/09-glass-accessories-division.html"], ["10-search", "pages/10-search.html"],
];
const viewports = [
  {dir:"wide",width:1440,height:900,suffix:"1440x900"}, {dir:"narrow",width:390,height:844,suffix:"390x844"},
  {dir:"320",width:320,height:760,suffix:"320x760"},
];

async function metrics(page) {
  return page.evaluate(() => {
    const controls=[...document.querySelectorAll("button, summary, select, input, .button, .filter-chip")].filter(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=="none"&&s.visibility!=="hidden"&&r.height>0}).map(e=>({label:(e.getAttribute("aria-label")||e.textContent||"").trim().replace(/\s+/g," ").slice(0,80),height:+e.getBoundingClientRect().height.toFixed(2)}));
    const ids=[...document.querySelectorAll("[id]")].map(e=>e.id); const idSet=new Set(ids);
    const ariaRefs=[...document.querySelectorAll("[aria-labelledby],[aria-describedby],[aria-controls]")].flatMap(e=>["aria-labelledby","aria-describedby","aria-controls"].flatMap(a=>(e.getAttribute(a)||"").split(/\s+/).filter(Boolean)));
    return {viewport:{width:innerWidth,height:innerHeight},scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,scrollHeight:document.documentElement.scrollHeight,h1Count:document.querySelectorAll("h1").length,noticeCount:document.querySelectorAll(".prototype-notice").length,duplicateIds:[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))],brokenAria:ariaRefs.filter(id=>!idSet.has(id)),defaultOpenDetails:document.querySelectorAll("details[open]").length,externalScripts:[...document.scripts].filter(s=>/^https?:/.test(s.src)).length,externalAssets:[...document.querySelectorAll("img[src],link[href]")].map(e=>e.getAttribute("src")||e.getAttribute("href")).filter(v=>/^https?:/.test(v)).length,controls:{count:controls.length,minimumHeight:controls.length?Math.min(...controls.map(c=>c.height)):null,below44:controls.filter(c=>c.height<44)},weights:[...new Set([...document.querySelectorAll("body *")].map(e=>getComputedStyle(e).fontWeight))].sort(),disabledDecorations:[...document.querySelectorAll(":disabled")].map(e=>getComputedStyle(e).textDecorationLine),searchVisibleNamed:[...document.querySelectorAll("a")].some(a=>a.textContent.trim()==="Search"&&a.getBoundingClientRect().width>0)};
  });
}

async function semanticMetrics(page, surface) {
  return page.evaluate((surface) => {
    const links=[...document.querySelectorAll("a[href]")];
    const globalChecks={
      thca:links.filter(a=>/^(THCA|Enter THCA|Shop THCA|Browse THCA)$/.test(a.textContent.trim())).every(a=>/08-thca-division\.html/.test(a.getAttribute("href"))),
      glass:links.filter(a=>/^(Glass & Accessories|Enter Glass & Accessories)$/.test(a.textContent.trim())).every(a=>/09-glass-accessories-division\.html/.test(a.getAttribute("href"))),
      search:links.filter(a=>a.textContent.trim()==="Search").every(a=>/10-search\.html/.test(a.getAttribute("href")))
    };
    const current=[...document.querySelectorAll('[aria-current="page"]')].map(a=>a.getAttribute("href"));
    return {surface,globalChecks,current};
  },surface);
}

async function main(){
  for(const d of ["wide","narrow","320","states","comparison/wide","comparison/narrow","overview"]) fs.mkdirSync(path.join(ROOT,"screenshots",d),{recursive:true});
  const browser=await chromium.launch({executablePath:BROWSER,headless:true}); const record={engine:"Headless Google Chrome via Playwright",package:"pressure-proof-constructed-signal-iteration-05-1",capturedAt:new Date().toISOString(),core:[],intermediate:[],states:[],semantic:[],console:[]};
  for(const v of viewports){const c=await browser.newContext({viewport:{width:v.width,height:v.height}});const p=await c.newPage();p.on("console",m=>{if(["warning","error"].includes(m.type())&&!/favicon\.ico/.test(m.text())&&!/404 \(File not found\)/.test(m.text()))record.console.push({surface:p.url(),type:m.type(),text:m.text()})});p.on("pageerror",e=>record.console.push({surface:p.url(),type:"pageerror",text:e.message}));for(const [stem,url] of surfaces){await p.goto(BASE+url,{waitUntil:"load"});await p.screenshot({path:path.join(ROOT,"screenshots",v.dir,`${stem}-${v.suffix}.png`),fullPage:true});record.core.push({surface:stem,viewport:v.suffix,...await metrics(p)});if(v.width===1440)record.semantic.push(await semanticMetrics(p,stem));}await c.close();}
  for(const width of [1024,901]){const c=await browser.newContext({viewport:{width,height:900}});const p=await c.newPage();for(const [stem,url] of surfaces){await p.goto(BASE+url,{waitUntil:"load"});record.intermediate.push({surface:stem,viewport:`${width}x900`,...await metrics(p)});}await c.close();}
  async function state(stem,url,width,height,prepare,fullPage=false,clipSelector=null){const c=await browser.newContext({viewport:{width,height}});const p=await c.newPage();await p.goto(BASE+url,{waitUntil:"load"});if(prepare)await prepare(p);await p.evaluate(()=>scrollTo(0,0));const screenshotPath=path.join(ROOT,"screenshots/states",`${stem}-${width}x${height}.png`);if(clipSelector)await p.locator(clipSelector).screenshot({path:screenshotPath});else await p.screenshot({path:screenshotPath,fullPage});record.states.push({state:stem,clipSelector,...await metrics(p)});await c.close();}
  await state("mobile-navigation-closed","pages/01-home.html",390,844,null);
  await state("mobile-navigation-open","pages/01-home.html",390,844,p=>p.locator("details.mobile-menu").evaluate(e=>e.open=true));
  await state("mobile-navigation-open","pages/01-home.html",320,760,p=>p.locator("details.mobile-menu").evaluate(e=>e.open=true));
  await state("universal-pdp-expanded","pages/04-universal-pdp.html",390,844,p=>p.locator("details.disclosure").evaluateAll(es=>es.forEach(e=>e.open=true)),true);
  await state("fitted-pdp-expanded","pages/05-fitted-component-pdp.html",390,844,p=>p.locator("details.disclosure").evaluateAll(es=>es.forEach(e=>e.open=true)),true);
  await state("full-cart-secondary-expanded","pages/07-full-cart.html",390,844,p=>p.locator("#cart-line-02").evaluate(e=>e.open=true),true);
  await state("home-opening","pages/01-home.html",1440,900,null,false,".home-opening"); await state("home-opening","pages/01-home.html",390,844,null,false,".home-opening");
  await state("whole-house-search","pages/10-search.html",1440,900,null); await state("whole-house-search","pages/10-search.html",390,844,null);
  const tc=await browser.newContext({viewport:{width:1440,height:900}}),tp=await tc.newPage();await tp.goto(BASE+"studies/typography-correction.html");await tp.screenshot({path:path.join(ROOT,"screenshots/states/typography-correction-1440x900.png"),fullPage:true});record.typography=await tp.locator("[data-type-candidate]").evaluateAll(cs=>cs.map(c=>({candidate:c.dataset.typeCandidate,declared:c.dataset.declaredStack||null,roles:[...c.querySelectorAll("[data-type-role]")].map(e=>({role:e.dataset.typeRole,computedFamily:getComputedStyle(e).fontFamily,computedWeight:getComputedStyle(e).fontWeight,declaredWeight:e.dataset.declaredWeight}))})));await tc.close();
  const rows=[...record.core,...record.intermediate,...record.states]; const violations=[];
  for(const r of rows){const label=r.surface||r.state;if(r.scrollWidth>r.clientWidth)violations.push({label,viewport:r.viewport,kind:"horizontal-overflow",value:`${r.scrollWidth}>${r.clientWidth}`});if(r.h1Count!==1)violations.push({label,viewport:r.viewport,kind:"h1-count",value:r.h1Count});if(r.noticeCount!==1)violations.push({label,viewport:r.viewport,kind:"notice-count",value:r.noticeCount});if(r.duplicateIds.length)violations.push({label,viewport:r.viewport,kind:"duplicate-ids",value:r.duplicateIds});if(r.brokenAria.length)violations.push({label,viewport:r.viewport,kind:"broken-aria",value:r.brokenAria});if(r.controls.minimumHeight!==null&&r.controls.minimumHeight<44)violations.push({label,viewport:r.viewport,kind:"control-below-44",value:r.controls.below44});if(r.viewport.width===320&&!r.searchVisibleNamed)violations.push({label,viewport:r.viewport,kind:"named-search-missing"});const badWeights=r.weights.filter(w=>!["400","600","700","800"].includes(w));if(badWeights.length)violations.push({label,viewport:r.viewport,kind:"unsupported-computed-weight",value:badWeights});if(r.disabledDecorations.some(x=>x!=="none"))violations.push({label,viewport:r.viewport,kind:"disabled-decoration",value:r.disabledDecorations});}
  if(record.console.length)violations.push({kind:"console",value:record.console});
  record.validation={pass:violations.length===0,violations};
  fs.writeFileSync(path.join(ROOT,"notes/rendering-evidence.json"),JSON.stringify(record,null,2));await browser.close();if(violations.length)throw new Error(`Rendering validation failed: ${JSON.stringify(violations)}`);
}
main().catch(e=>{console.error(e);process.exitCode=1});
