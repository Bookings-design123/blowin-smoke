const fs=require("node:fs"),path=require("node:path");
const ROOT=path.resolve(__dirname,"..");const pages=fs.readdirSync(path.join(ROOT,"pages")).filter(f=>f.endsWith(".html")).sort();const all=[...pages.map(f=>"pages/"+f),"index.html",...fs.readdirSync(path.join(ROOT,"studies")).filter(f=>f.endsWith(".html")).map(f=>"studies/"+f)];
const report={pages:[],brokenLinks:[],brokenFragments:[],brokenAria:[],currentPageFailures:[],semanticRouteFailures:[],external:[],forbidden:[]};
function attrs(tag){return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)].map(m=>[m[1],m[3]]))}
for(const rel of all){const file=path.join(ROOT,rel),html=fs.readFileSync(file,"utf8");const ids=[...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(m=>m[1]);const dup=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];const h1=(html.match(/<h1\b/gi)||[]).length,notices=(html.match(/class=["'][^"']*prototype-notice/gi)||[]).length;report.pages.push({file:rel,h1,notices,duplicateIds:dup});
 for(const m of html.matchAll(/<a\b[^>]*href\s*=\s*(["'])(.*?)\1[^>]*>/g)){const href=m[2];if(/^https?:/.test(href)){report.external.push({file:rel,href});continue}if(/^(mailto:|tel:|javascript:)/.test(href))continue;const [target,frag]=href.split("#"),targetRel=target?path.normalize(path.join(path.dirname(rel),target)):rel,targetFile=path.join(ROOT,targetRel);if(target&&!fs.existsSync(targetFile))report.brokenLinks.push({file:rel,href});if(frag&&fs.existsSync(targetFile)){const th=fs.readFileSync(targetFile,"utf8");if(!new RegExp(`\\bid=["']${frag.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}["']`).test(th))report.brokenFragments.push({file:rel,href});}}
 for(const m of html.matchAll(/<(?:script|img|link)\b[^>]*(?:src|href)\s*=\s*(["'])(.*?)\1[^>]*>/g))if(/^https?:/.test(m[2]))report.external.push({file:rel,asset:m[2]});
 for(const m of html.matchAll(/<(?:[^>]+)\s(aria-labelledby|aria-describedby|aria-controls)\s*=\s*(["'])(.*?)\2[^>]*>/g))for(const ref of m[3].split(/\s+/))if(ref&&!ids.includes(ref))report.brokenAria.push({file:rel,attr:m[1],ref});
 if(rel.startsWith("pages/")){
  const currentBase=path.basename(rel);
  const routeRules=[
   {label:/^(?:THCA|Enter THCA|Shop THCA|Browse THCA)$/i,target:"08-thca-division.html"},
   {label:/^(?:Vape & Nicotine|Enter Vape & Nicotine|Shop Vape & Nicotine|Browse Vape & Nicotine)$/i,target:"02-vape-nicotine-division.html"},
   {label:/^(?:Glass & Accessories|Enter Glass & Accessories|Shop Glass & Accessories|Browse Glass & Accessories)$/i,target:"09-glass-accessories-division.html"},
   {label:/^Search$/i,target:"10-search.html"}
  ];
  for(const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)){
   const tag=m[0],hrefMatch=tag.match(/\bhref\s*=\s*(["'])(.*?)\1/),href=hrefMatch?hrefMatch[2]:"";
   const label=m[2].replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/&#39;/g,"'").replace(/\s+/g," ").trim();
   const [target]=href.split("#"),targetBase=target?path.basename(target):currentBase;
   if(/\baria-current\s*=\s*(["'])page\1/.test(tag)&&targetBase!==currentBase)report.currentPageFailures.push({file:rel,label,href,expected:currentBase});
   const rule=routeRules.find(rule=>rule.label.test(label));
   if(rule&&targetBase!==rule.target)report.semanticRouteFailures.push({file:rel,label,href,expected:rule.target});
  }
 }
}
const text=fs.readFileSync(path.join(ROOT,"shared/prototype.css"),"utf8")+all.map(f=>fs.readFileSync(path.join(ROOT,f),"utf8")).join("\n")+fs.readFileSync(path.join(ROOT,"fixtures/customer-facing-catalog.json"),"utf8");
const weightHits=[...text.matchAll(/(?:font-weight\s*:\s*|data-declared-weight=["'])(\d{3})/g)].map(m=>m[1]);
const unsupportedWeights=[...new Set(weightHits.filter(w=>!["400","600","700","800"].includes(w)))];
if(unsupportedWeights.length)report.forbidden.push({name:"unsupportedWeight",hits:unsupportedWeights});
for(const [name,re] of Object.entries({lineThrough:/text-decoration(?:-line)?\s*:\s*line-through/g,falseAdd:/Added to cart/g,falseThca:/03-shared-category\.html#thca|href=(["'])#thca\1/g,falseSearch:/03-shared-category\.html#search|href=(["'])#search\1/g,falseGlass:/href=["']05-fitted-component-pdp\.html["'][^>]*>Glass & Accessories/g})){const hits=[...text.matchAll(re)].map(m=>m[0]);if(hits.length)report.forbidden.push({name,hits})}
const fixture=JSON.parse(fs.readFileSync(path.join(ROOT,"fixtures/customer-facing-catalog.json"),"utf8"));
const fixtureDemoIds=new Set(JSON.stringify(fixture).match(/DEMO-[A-Z0-9-]+/g)||[]);
const visibleDemoIds=[...new Set(pages.flatMap(file=>(fs.readFileSync(path.join(ROOT,"pages",file),"utf8").match(/DEMO-[A-Z0-9-]+/g)||[])))];
report.fixtureReferences={visibleCount:visibleDemoIds.length,unknown:visibleDemoIds.filter(id=>!fixtureDemoIds.has(id))};
if(report.fixtureReferences.unknown.length)report.forbidden.push({name:"unknownFixtureReference",hits:report.fixtureReferences.unknown});
const categoryHtml=fs.readFileSync(path.join(ROOT,"pages/03-shared-category.html"),"utf8");
const cardClasses=[...categoryHtml.matchAll(/<article class="product-card\s+(quiet|caution|consequence)"/g)].map(m=>m[1]);
const distribution={quiet:cardClasses.filter(x=>x==="quiet").length,caution:cardClasses.filter(x=>x==="caution").length,consequence:cardClasses.filter(x=>x==="consequence").length};
report.category={fixtureCount:fixture.category.results.length,cardCount:cardClasses.length,distribution};
if(fixture.category.results.length!==8||cardClasses.length!==8||distribution.quiet!==5||distribution.caution!==1||distribution.consequence!==2)report.forbidden.push({name:"categoryDistribution",hits:[JSON.stringify(report.category)]});
const visibleActions=[...categoryHtml.matchAll(/<article class="product-card[\s\S]*?<a class="text-link"[^>]*>(.*?)<\/a>[\s\S]*?<\/article>/g)].map(m=>m[1].replace(/<[^>]+>/g,"").trim());
const fixtureActions=fixture.category.results.map(r=>r.action);
report.category.actions={visible:visibleActions,fixture:fixtureActions};
if(JSON.stringify(visibleActions)!==JSON.stringify(fixtureActions))report.forbidden.push({name:"categoryActionCoherence",hits:[JSON.stringify(report.category.actions)]});
const searchHtml=fs.readFileSync(path.join(ROOT,"pages/10-search.html"),"utf8"),declaredSearchCount=Number((searchHtml.match(/PRODUCTS\s*·\s*(\d+)/i)||[])[1]),searchCardCount=(searchHtml.match(/<article class="product-card/g)||[]).length;
report.search={declaredProductCount:declaredSearchCount,renderedProductCards:searchCardCount};
if(declaredSearchCount!==3||searchCardCount!==3||declaredSearchCount!==searchCardCount)report.forbidden.push({name:"searchResultCount",hits:[JSON.stringify(report.search)]});
fs.writeFileSync(path.join(ROOT,"notes/source-validation.json"),JSON.stringify(report,null,2));const bad=report.pages.some(p=>p.h1!==1||p.notices!==1||p.duplicateIds.length)||report.brokenLinks.length||report.brokenFragments.length||report.brokenAria.length||report.currentPageFailures.length||report.semanticRouteFailures.length||report.external.length||report.forbidden.length;console.log(JSON.stringify({...report,pass:!bad},null,2));if(bad)process.exitCode=1;
