(()=>{var W=Object.freeze,V=Object.defineProperty;var k=(e,t)=>W(V(e,"raw",{value:W(t||e.slice())}));var P=Symbol("component"),T=Symbol("await"),_=Symbol("slot");var y="TEXT",q="COMPONENT",f="NONE",b="PROP",v="CHILDREN",w="SET_PROP",B="PROP_VAL";function*p(e,...t){if(!t.length)yield*e;else if(!t.some(n=>typeof n=="function"))yield*e.reduce((n,i,a)=>[...n,i,...t.length>a?[t[a]]:[]],[]);else{let n=y,i=f,a=f,r=[];for(let o=0;o<e.length;o++){let s="",g={kind:P,slots:{},properties:[],children:[],fn:void 0};for(let l=0;l<e[o].length;l++){let c=e[o][l];if(n===y)c==="<"&&!e[o][l+1]&&typeof t[o]=="function"?(n=q,g.fn=t[o],r.push(g)):s+=c;else if(n===q)if(i===b){let h=r[r.length-1],x=h?.properties[h.properties.length-1];if(a===w){let d="";for(;e[o][l]!=="="&&e[o][l]!=="/"&&e[o][l]!==">"&&e[o][l]!=='"'&&e[o][l]!=="'"&&e[o][l]!==" "&&d!=="...";)d+=e[o][l],l++;if(e[o][l]==="=")a=B;else if(e[o][l]==="/"&&i===b){i=f,a=f;let m=r.pop();r.length||(s="",yield m)}else e[o][l]===">"&&i===b&&(i=v,a=f);d==="..."?h.properties.push(...Object.entries(t[o]).map(([m,Y])=>({name:m,value:Y}))):d&&h.properties.push({name:d,value:!0})}else if(a===B){if(e[o][l]==='"'||e[o][l]==="'"){let d=e[o][l];if(!e[o][l+1])x.value=t[o],a=w;else{let m="";for(l++;e[o][l]!==d;)m+=e[o][l],l++;x.value=m||"",a=w}}else if(e[o][l-1]){let d="";for(;e[o][l]!==" "&&e[o][l]!=="/"&&e[o][l]!==">";)d+=e[o][l],l++;if(x.value=d||"",a=w,e[o][l]==="/"){let m=r.pop();r.length||(yield m)}}else if(x.value=t[o-1],a=w,e[o][l]===">")a=f,i=v;else if(e[o][l]==="/"){let d=r.pop();r.length||(a=f,i=f,n=y,l++,yield d)}}}else if(i===v){let h=r[r.length-1];if(e[o][l]==="<"&&e[o][l+1]==="/"&&e[o][l+2]==="/"){s&&(h.children.push(s),s=""),l+=3;let x=r.pop();r.length||(n=y,i=f,yield x)}else e[o][l]==="<"&&!e[o][l+1]&&typeof t[o]=="function"?(s&&(h.children.push(s),s=""),i=b,a=w,g.fn=t[o],r.push(g)):e[o][l+1]?s+=e[o][l]:s&&h&&(s+=e[o][l],h.children.push(s))}else if(c===">")i=v;else if(c===" ")i=b,a=w;else if(c==="/"&&e[o][l+1]===">"){n=y,i=f;let h=r.pop();r.length||(s="",yield h),l++}else s+=c;else s+=c}i===v&&t.length>o&&r[r.length-1].children.push(t[o]),s&&i!==v&&(yield s),r.length>1&&g.fn&&r[r.length-2].children.push(g),t.length>o&&n!==q&&(yield t[o])}}}function E({promise:e,children:t}){return{promise:e,template:t.find(n=>typeof n=="function")}}E.kind=T;var $=(e,t)=>e?t():"";function F(e){return typeof e.getReader=="function"}async function*z(e){let t=e.getReader(),n=new TextDecoder("utf-8");try{for(;;){let{done:i,value:a}=await t.read();if(i)return;yield n.decode(a)}}finally{t.releaseLock()}}async function*H(e){if(F(e))for await(let t of z(e))yield t;else for await(let t of e)yield t}async function*R(e,t){if(typeof e=="string")yield e;else if(typeof e=="function")yield*R(e(),t);else if(Array.isArray(e))yield*L(e,t);else if(typeof e?.then=="function"){let n=await e;yield*R(n,t)}else if(e instanceof Response&&e.body)yield*H(e.body);else if(e?.[Symbol.asyncIterator]||e?.[Symbol.iterator])yield*L(e,t);else if(e?.fn?.kind===T){let{promise:n,template:i}=e.fn({...e.properties.reduce((r,o)=>({...r,[o.name]:o.value}),{}),children:e.children}),a=t.length;t.push(n().then(r=>({id:a,template:i({pending:!1,error:!1,success:!0},r,null)})).catch(r=>(console.error(r.stack),{id:a,template:i({pending:!1,error:!0,success:!1},null,r)}))),yield*L(p`<awaiting-promise style="display: contents;" data-id="${a.toString()}">${i({pending:!0,error:!1,success:!1},null,null)}</awaiting-promise>`,t)}else if(e?.kind===P){let n=[],i={};for(let a of e.children)if(a?.fn?.kind===_){let r=a.properties.find(o=>o.name==="name")?.value||"default";i[r]=a.children}else n.push(a);yield*R(await e.fn({...e.properties.reduce((a,r)=>({...a,[r.name]:r.value}),{}),children:n,slots:i}),t)}else{let n=e?.toString();n==="[object Object]"?yield JSON.stringify(e):yield n}}async function*L(e,t){for await(let n of e)yield*R(n,t)}var D;async function*N(e){let t=[];for(yield*L(e,t),t=t.map(n=>{let i=n.then(a=>(t.splice(t.indexOf(i),1),a));return i});t.length>0;){let n=await Promise.race(t),{id:i,template:a}=n;yield*N(p(D||(D=k([`
      <template data-id="`,'">',`</template>
      <script>
        {
          let toReplace = document.querySelector('awaiting-promise[data-id="`,`"]');
          const template = document.querySelector('template[data-id="`,`"]').content.cloneNode(true);
          toReplace.replaceWith(template);
        }
      <\/script>
    `])),i.toString(),a,i.toString(),i.toString()))}}var S=class{constructor({routes:t,fallback:n,plugins:i=[],baseHref:a=""}){this.plugins=i,this.fallback={render:n,params:{}},this.routes=t.map(r=>({...r,urlPattern:new URLPattern({pathname:`${a}${r.path}`,search:"*",hash:"*"})}))}_getPlugins(t){return[...this.plugins??[],...t?.plugins??[]]}async handleRequest(t){let n=new URL(t.url),i;for(let r of this.routes){let o=r.urlPattern.exec(n);if(o){i={options:r.options,render:r.render,params:o?.pathname?.groups??{},plugins:r.plugins};break}}let a=i?.render??this?.fallback?.render;if(a){let r=new URL(t.url),o=Object.fromEntries(new URLSearchParams(r.search)),s=i?.params,g=this._getPlugins(i);for(let l of g)try{let c=await l?.beforeResponse({url:r,query:o,params:s,request:t});if(c)return c}catch(c){throw console.log(`Plugin "${l.name}" error on beforeResponse hook`,c),c}return new M(await a({url:r,query:o,params:s,request:t}),i?.options??{})}}},M=class{constructor(t,n={}){let i=N(t),a=new TextEncoder,r=new ReadableStream({async pull(o){try{let{value:s,done:g}=await i.next();g?o.close():o.enqueue(a.encode(s))}catch(s){throw console.error(s.stack),s}}});return new Response(r,{status:200,headers:{"Content-Type":"text/html","Transfer-Encoding":"chunked",...n?.headers??{}},...n})}};function O(){}O.kind=_;var A=globalThis?.Netlify?"server":"worker";var j;function u({title:e,children:t,slots:n}){return p(j||(j=k([`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
        <meta name="Description" content="Passle blog">
        <title>`,`</title>

        `,`
        <style>
          body {
            font-family: system-ui;
            font-size: 1.15em;
          }

          header,
          main,
          footer {
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
          }

          h1 a {
            text-decoration: none;
            color: white;
          }

          *:focus {
            outline: solid 2px blue;
          }

          .shiki {
            padding: 20px;
            line-height: 1.5em;
            border: solid 2px black;
            transition: box-shadow 0.2s ease-in-out;
          }

          nav {
            margin-left: auto;
            margin-right: auto;
            max-width: 300px;
          }

          nav ul {
            display: flex;
            justify-content: center;
            margin: 0;
            padding: 0;
            list-style: none;
          }

          nav ul li {
            margin: 10px;
          }

          h1 {
            color: white;
            margin-top: 60px;

            text-shadow:
            2px 2px 0 #000,
            -1px -1px 0 #000,  
            1px -1px 0 #000,
            -1px 1px 0 #000,
            1px 1px 0 #000;
            text-align: center;
          }

          h2 {
            text-align: center;
          }

          a {
            color: blue;
            font-weight: 700;
            text-decoration: none;
          }

          a:hover,
          a:focus {
            text-decoration: underline;
          }

          footer {
            flex-direction: row;
            border-top: solid 2px black;
            display: flex;
            gap: 60px;
            padding: 20px;
            margin-top: 80px;
            margin-bottom: 80px;
          }

          footer div > p {
            margin-top: 0px;
          }

          .social-links {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          main ul {
            list-style: none;
            margin: 0;
            padding: 0;
          }

          main li.overview-li a {
            padding: 16px;
            display: block;
            border: solid 2px black;
            margin-top: 20px;
            margin-bottom: 20px;
            text-decoration: none;
            box-shadow: 3px 3px 3px black;
            transition: box-shadow 0.2s ease-in-out;
          }

          pre {
            overflow: auto;
          }

          blockquote {
            border-left: solid 2px black;
            font-style: italic;
            margin-left: 0;
            margin-right: 0;
            padding-left: 20px;
            padding-right: 20px;
            font-size: 18px;
          }

          article img {
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
            display: block;
          }
          
          main li.overview-li a:focus,
          main li.overview-li a:hover {
            box-shadow: 6px 6px 6px black;
          }

          .overview-item {
            color: black;
            text-decoration: none;
          }

          .overview-item h3 {
            color: blue;
            margin-bottom: 12px;
          }

          .date {
            margin-top: 0px;
            font-size: 12px;
          }
          
          .description {
            font-weight: 500;
          }

          .blog,
          .thoughts {
            font-weight: 700;
          }
          
          .post h2 a,
          .post h3 a,
          .post h4 a,
          .post h5 a,
          .post h6 a {
            color: black;
          }

          .post h2 a:hover,
          .post h2 a:focus,
          .post h3 a:hover,
          .post h3 a:focus,
          .post h4 a:hover,
          .post h4 a:focus,
          .post h5 a:hover,
          .post h5 a:focus,
          .post h6 a:hover,
          .post h6 a:focus {
            color: blue;
          }

          .post {
            border: solid 2px black;
            padding: 20px;
            box-shadow: 3px 3px 3px black;
            margin-top: 40px;
          }

          .larger-text {
            line-height: 1.45em;
            font-size: 22px;
          }

          .post ul {
            list-style: initial;
            padding-left: 20px;
          }

          .post p {
            line-height: 1.45em;
          }

          .post p code {
            font-weight: 700;
          }

          .post dt {
            font-weight: 700;
          }

          :target + dd {
            text-decoration: underline;
          }

          .post-loading-title {
            height: 1.5em;
            width: 60%;
            background-color: #eee;
            margin-top: 30px;
            margin-bottom: 30px;
            margin-left: auto;
            margin-right: auto;
          }

          .post-loading-bar {
            height: 1em;
            width: 100%;
            background-color: #eee;
            margin-top: 12px;
            margin-bottom: 12px;
          }

          @media (max-width: 600px) {
            nav {
              margin-left: auto;
              margin-right: auto;
            }

            article img {
              max-width: 320px;
            }

            footer {
              flex-direction: column-reverse;
              gap: 10px;
              padding: 12px;
            }

            footer div {
              margin-top: 10px;
            }
          }

        </style>
      </head>
      <body>
        <header>
          <h1><a href="/">PASSLE</a></h1>
          <nav>
            <ul>
              <li><a href="/blog">Blogs</a></li>
              <li><a href="/thoughts">Thoughts</a></li>
              <li><a href="/definitions">Definitions</a></li>
            </ul>
          </nav>
        </header>
        <main>
          `,`
        </main>
        <footer>
          <ul class="social-links">
            <li><a target="_blank" href="https://github.com/thepassle">Github</a></li>
            <li><a target="_blank" href="https://mastodon.social/@passle">Mastodon</a></li>
            <li><a target="_blank" href="https://twitter.com/passle_">Twitter</a></li>
            <li><a target="_blank" href="/rss">RSS</a></li>
          </ul>
          <div>
            <p>This blog was rendered `,`</p>
            <p>The source for this blog can be found <a target="_blank" href="https://github.com/thepassle/blog">here</a>, please feel free to steal it and use it for your own projects</p>
          </div>
        </footer>
      </body>
      <script>
        navigator.serviceWorker.register('/sw.js').then((registration) => {
          console.log('Service worker registered successfully', registration);

          if (!navigator.serviceWorker.controller && `,`) {
            navigator.serviceWorker.addEventListener('message', (event) => {
              if (event?.data?.type === 'SW_ACTIVATED') {
                window.location.reload();
              }
            });
          }
        }).catch((err) => {
          console.log('Service worker registration failed: ', err);
        });

        let refreshing;
        async function handleUpdate() {
          // check to see if there is a current active service worker
          const oldSw = (await navigator.serviceWorker.getRegistration())?.active?.state;

          navigator.serviceWorker.addEventListener('controllerchange', async () => {
            if (refreshing) return;

            // when the controllerchange event has fired, we get the new service worker
            const newSw = (await navigator.serviceWorker.getRegistration())?.active?.state;

            // if there was already an old activated service worker, and a new activating service worker, do the reload
            if (oldSw === 'activated' && newSw === 'activating') {
              refreshing = true;
              window.location.reload();
            }
          });
        }

        handleUpdate();

      <\/script>
    </html>
  `])),e??"",n?.head??"",t,A==="server"?"on the server":"in a service worker",A==="worker")}function C(e){let t=e.toLowerCase().split("-").join(" ");return t.charAt(0).toUpperCase()+t.slice(1)}function I({promise:e}){return p`
    <${E} promise=${()=>e.then(t=>t.text())}>
      ${(t,n,i)=>p`
        ${$(t.pending,()=>p`
          <div class="post-loading-title"></div>
          <div class="loading-content">
            ${Array.from({length:Math.floor(Math.random()*11)+5},()=>Math.random()).map(a=>p`
              <div style="width: ${Math.floor(Math.random()*11)+90}%" class="post-loading-bar"></div>
            `)}
          </div>
        `)}
        ${$(t.error,()=>p`<p>Failed to fetch blog.</p>`)}
        ${$(t.success,()=>n)}
      `}
    <//>
  `}var U=new S({routes:[{path:"/",render:({url:e,params:t,query:n,request:i})=>{let a=fetch(e.origin+"/output/overview.html");return p`
          <${u} title="Passle">
            <h2>Overview</h2>
            ${a}
          <//>
        `}},{path:"/blog",render:({url:e,params:t,query:n,request:i})=>{let a=fetch(e.origin+"/output/blog/overview.html");return p`
          <${u} title="Blog">
            <h2>Blogs</h2>
            ${a}
          <//>
        `}},{path:"/blog/:title",render:({url:e,params:t,query:n,request:i})=>{let a=fetch(e.origin+"/output/blog/"+t.title+"/index.html"),r=C(t.title),o=`${e.origin}/blog/${t.title}`;return p`
          <${u} title="${"Passle blog - "+r}"> 

            <${O} name="head">
              <meta property="og:site_name" content="Passle blog">
              <meta property="og:url" content="${o}"/>
              <meta property="og:type" content="website"/>
              <meta property="og:title" content="${r}"/>
              <meta property="og:description" content="Passle blog"/>
              <meta property="og:image" content="${e.origin}/output/og/${t.title}.png"/>
              <meta property="og:image:alt" content="${r}"/>

              <meta content="@passle_" name="twitter:site"/>
              <meta content="@passle_" name="twitter:creator"/>
              <meta name="twitter:card" content="summary_large_image"/>
              <meta name="twitter:url" content="${o}"/>
              <meta name="twitter:title" content="${r}"/>
              <meta name="twitter:image:alt" content="${r}">
              <meta name="twitter:description" content="Passle blog"/>
              <meta name="twitter:image" content="${e.origin}/output/og/${t.title}.png"/>
              <meta name="twitter:image:src" content="${e.origin}/output/og/${t.title}.png" />

            <//>

            <article class="post">
              <${I} promise=${a}/>
            </article>
          <//>
        `}},{path:"/thoughts",render:({url:e,params:t,query:n,request:i})=>{let a=fetch(e.origin+"/output/thoughts/overview.html");return p`
          <${u} title="Thoughts">
            <h2>Thoughts</h2>
            <p class="larger-text">
              Not quite blogs, not quite tweets. Something in between. Likely opinionated, potentially wrong. Subject to change over time.
            </p>
            ${a}
          <//>
        `}},{path:"/definitions",render:({url:e,params:t,query:n,request:i})=>p`
          <${u} title="Definitions">
            <h2>Definitions</h2>
            <article class="post">
              <dl>
                <dt id="buildless-development"><a href="#buildless-development">Buildless development</a></dt>
                <dd>Local development using native ESM and web standards; code that you write runs in the browser without any transformation. Note that this does not include Vite; Vite does a bunch of non-standard transformations and (pre-)bundling out of the box.</dd>
                
                <dt id="swsr"><a href="#swsr">SWSR</a></dt>
                <dd>Service Worker Side Rendering. SSR, but in a Service Worker.</dd>
                
                <dt id="swtl"><a href="#swtl">SWTL</a></dt>
                <dd>Service Worker Templating Language.</dd>
              </dl>
            </article>
          <//>
        `},{path:"/thoughts/:title",render:({url:e,params:t,query:n,request:i})=>{let a=fetch(e.origin+"/output/thoughts/"+t.title+"/index.html"),r=C(t.title),o=`${e.origin}/thoughts/${t.title}`;return p`
          <${u} title="${"Passle blog - "+r}">
            <${O} name="head">
              <meta property="og:site_name" content="Passle blog">
              <meta property="og:url" content="${o}"/>
              <meta property="og:type" content="website"/>
              <meta property="og:title" content="${r}"/>
              <meta property="og:description" content="Passle blog"/>
              <meta property="og:image" content="${e.origin}/output/og/${t.title}.png"/>
              <meta property="og:image:alt" content="${r}"/>

              <meta content="@passle_" name="twitter:site"/>
              <meta content="@passle_" name="twitter:creator"/>
              <meta name="twitter:card" content="summary_large_image"/>
              <meta name="twitter:url" content="${o}"/>
              <meta name="twitter:title" content="${r}"/>
              <meta name="twitter:image:alt" content="${r}">
              <meta name="twitter:description" content="Passle blog"/>
              <meta name="twitter:image" content="${e.origin}/output/og/${t.title}.png"/>
              <meta name="twitter:image:src" content="${e.origin}/output/og/${t.title}.png" />
            <//>

            <article class="post">
              <${I} promise=${a}/>
            </article>
          <//>
        `}},{path:"/foo",render:({url:e,params:t,query:n,request:i})=>p`
          <${u} title="Foo">
            <h2>Foo</h2>
          <//>
        `}]});self.addEventListener("install",()=>{self.skipWaiting()});self.addEventListener("activate",e=>{e.waitUntil(clients.claim().then(()=>{self.clients.matchAll().then(t=>{t.forEach(n=>n.postMessage({type:"SW_ACTIVATED"}))})}))});self.addEventListener("fetch",e=>{e.request.mode==="navigate"&&e.respondWith(U.handleRequest(e.request))});})();
//# sourceMappingURL=sw.js.map
