(()=>{var M=Object.freeze,U=Object.defineProperty;var O=(e,t)=>M(U(e,"raw",{value:M(t||e.slice())}));var k=Symbol("component"),P=Symbol("await"),T=Symbol("slot");var v="TEXT",N="COMPONENT",g="NONE",b="PROP",y="CHILDREN",w="SET_PROP",A="PROP_VAL";function*p(e,...t){if(!t.length)yield*e;else if(!t.some(a=>typeof a=="function"))yield*e.reduce((a,r,i)=>[...a,r,...t.length>i?[t[i]]:[]],[]);else{let a=v,r=g,i=g,n=[];for(let o=0;o<e.length;o++){let s="",f={kind:k,slots:{},properties:[],children:[],fn:void 0};for(let l=0;l<e[o].length;l++){let c=e[o][l];if(a===v)c==="<"&&!e[o][l+1]&&typeof t[o]=="function"?(a=N,f.fn=t[o],n.push(f)):s+=c;else if(a===N)if(r===b){let h=n[n.length-1],x=h?.properties[h.properties.length-1];if(i===w){let d="";for(;e[o][l]!=="="&&e[o][l]!=="/"&&e[o][l]!==">"&&e[o][l]!=='"'&&e[o][l]!=="'"&&e[o][l]!==" "&&d!=="...";)d+=e[o][l],l++;if(e[o][l]==="=")i=A;else if(e[o][l]==="/"&&r===b){r=g,i=g;let m=n.pop();n.length||(s="",yield m)}else e[o][l]===">"&&r===b&&(r=y,i=g);d==="..."?h.properties.push(...Object.entries(t[o]).map(([m,I])=>({name:m,value:I}))):d&&h.properties.push({name:d,value:!0})}else if(i===A){if(e[o][l]==='"'||e[o][l]==="'"){let d=e[o][l];if(!e[o][l+1])x.value=t[o],i=w;else{let m="";for(l++;e[o][l]!==d;)m+=e[o][l],l++;x.value=m||"",i=w}}else if(e[o][l-1]){let d="";for(;e[o][l]!==" "&&e[o][l]!=="/"&&e[o][l]!==">";)d+=e[o][l],l++;if(x.value=d||"",i=w,e[o][l]==="/"){let m=n.pop();n.length||(yield m)}}else if(x.value=t[o-1],i=w,e[o][l]===">")i=g,r=y;else if(e[o][l]==="/"){let d=n.pop();n.length||(i=g,r=g,a=v,l++,yield d)}}}else if(r===y){let h=n[n.length-1];if(e[o][l]==="<"&&e[o][l+1]==="/"&&e[o][l+2]==="/"){s&&(h.children.push(s),s=""),l+=3;let x=n.pop();n.length||(a=v,r=g,yield x)}else e[o][l]==="<"&&!e[o][l+1]&&typeof t[o]=="function"?(s&&(h.children.push(s),s=""),r=b,i=w,f.fn=t[o],n.push(f)):e[o][l+1]?s+=e[o][l]:s&&h&&(s+=e[o][l],h.children.push(s))}else if(c===">")r=y;else if(c===" ")r=b,i=w;else if(c==="/"&&e[o][l+1]===">"){a=v,r=g;let h=n.pop();n.length||(s="",yield h),l++}else s+=c;else s+=c}r===y&&t.length>o&&n[n.length-1].children.push(t[o]),s&&r!==y&&(yield s),n.length>1&&f.fn&&n[n.length-2].children.push(f),t.length>o&&a!==N&&(yield t[o])}}}function W({promise:e,children:t}){return{promise:e,template:t.find(a=>typeof a=="function")}}W.kind=P;function Y(e){return typeof e.getReader=="function"}async function*V(e){let t=e.getReader(),a=new TextDecoder("utf-8");try{for(;;){let{done:r,value:i}=await t.read();if(r)return;yield a.decode(i)}}finally{t.releaseLock()}}async function*F(e){if(Y(e))for await(let t of V(e))yield t;else for await(let t of e)yield t}async function*_(e,t){if(typeof e=="string")yield e;else if(typeof e=="function")yield*_(e(),t);else if(Array.isArray(e))yield*E(e,t);else if(typeof e?.then=="function"){let a=await e;yield*_(a,t)}else if(e instanceof Response&&e.body)yield*F(e.body);else if(e?.[Symbol.asyncIterator]||e?.[Symbol.iterator])yield*E(e,t);else if(e?.fn?.kind===P){let{promise:a,template:r}=e.fn({...e.properties.reduce((n,o)=>({...n,[o.name]:o.value}),{}),children:e.children}),i=t.length;t.push(a().then(n=>({id:i,template:r({pending:!1,error:!1,success:!0},n,null)})).catch(n=>(console.error(n.stack),{id:i,template:r({pending:!1,error:!0,success:!1},null,n)}))),yield*E(p`<awaiting-promise style="display: contents;" data-id="${i.toString()}">${r({pending:!0,error:!1,success:!1},null,null)}</awaiting-promise>`,t)}else if(e?.kind===k){let a=[],r={};for(let i of e.children)if(i?.fn?.kind===T){let n=i.properties.find(o=>o.name==="name")?.value||"default";r[n]=i.children}else a.push(i);yield*_(await e.fn({...e.properties.reduce((i,n)=>({...i,[n.name]:n.value}),{}),children:a,slots:r}),t)}else{let a=e?.toString();a==="[object Object]"?yield JSON.stringify(e):yield a}}async function*E(e,t){for await(let a of e)yield*_(a,t)}var B;async function*R(e){let t=[];for(yield*E(e,t),t=t.map(a=>{let r=a.then(i=>(t.splice(t.indexOf(r),1),i));return r});t.length>0;){let a=await Promise.race(t),{id:r,template:i}=a;yield*R(p(B||(B=O([`
      <template data-id="`,'">',`</template>
      <script>
        {
          let toReplace = document.querySelector('awaiting-promise[data-id="`,`"]');
          const template = document.querySelector('template[data-id="`,`"]').content.cloneNode(true);
          toReplace.replaceWith(template);
        }
      <\/script>
    `])),r.toString(),i,r.toString(),r.toString()))}}var $=class{constructor({routes:t,fallback:a,plugins:r=[],baseHref:i=""}){this.plugins=r,this.fallback={render:a,params:{}},this.routes=t.map(n=>({...n,urlPattern:new URLPattern({pathname:`${i}${n.path}`,search:"*",hash:"*"})}))}_getPlugins(t){return[...this.plugins??[],...t?.plugins??[]]}async handleRequest(t){let a=new URL(t.url),r;for(let n of this.routes){let o=n.urlPattern.exec(a);if(o){r={options:n.options,render:n.render,params:o?.pathname?.groups??{},plugins:n.plugins};break}}let i=r?.render??this?.fallback?.render;if(i){let n=new URL(t.url),o=Object.fromEntries(new URLSearchParams(n.search)),s=r?.params,f=this._getPlugins(r);for(let l of f)try{let c=await l?.beforeResponse({url:n,query:o,params:s,request:t});if(c)return c}catch(c){throw console.log(`Plugin "${l.name}" error on beforeResponse hook`,c),c}return new L(await i({url:n,query:o,params:s,request:t}),r?.options??{})}}},L=class{constructor(t,a={}){let r=R(t),i=new TextEncoder,n=new ReadableStream({async pull(o){try{let{value:s,done:f}=await r.next();f?o.close():o.enqueue(i.encode(s))}catch(s){throw console.error(s.stack),s}}});return new Response(n,{status:200,headers:{"Content-Type":"text/html","Transfer-Encoding":"chunked",...a?.headers??{}},...a})}};function S(){}S.kind=T;var q=globalThis?.Netlify?"server":"worker";var D;function u({title:e,children:t,slots:a}){return p(D||(D=O([`
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
            overflow: scroll;
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

          .selected {
            text-decoration: underline;
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
  `])),e??"",a?.head??"",t,q==="server"?"on the server":"in a service worker",q==="worker")}function C(e){let t=e.toLowerCase().split("-").join(" ");return t.charAt(0).toUpperCase()+t.slice(1)}var j=new $({routes:[{path:"/",render:({url:e,params:t,query:a,request:r})=>{let i=fetch(e.origin+"/output/overview.html");return p`
          <${u} title="Passle">
            <h2>Overview</h2>
            ${i}
          <//>
        `}},{path:"/blog",render:({url:e,params:t,query:a,request:r})=>{let i=fetch(e.origin+"/output/blog/overview.html");return p`
          <${u} title="Blog">
            <h2>Blogs</h2>
            ${i}
          <//>
        `}},{path:"/blog/:title",render:({url:e,params:t,query:a,request:r})=>{let i=fetch(e.origin+"/output/blog/"+t.title+"/index.html"),n=C(t.title),o=`${e.origin}/blog/${t.title}`;return p`
          <${u} title="${"Passle blog - "+n}"> 

            <${S} name="head">
              <meta property="og:site_name" content="Passle blog">
              <meta property="og:url" content="${o}"/>
              <meta property="og:type" content="website"/>
              <meta property="og:title" content="${n}"/>
              <meta property="og:description" content="Passle blog"/>
              <meta property="og:image" content="${e.origin}/output/og/${t.title}.png"/>
              <meta property="og:image:alt" content="${n}"/>

              <meta content="@passle_" name="twitter:site"/>
              <meta content="@passle_" name="twitter:creator"/>
              <meta name="twitter:card" content="summary_large_image"/>
              <meta name="twitter:url" content="${o}"/>
              <meta name="twitter:title" content="${n}"/>
              <meta name="twitter:image:alt" content="${n}">
              <meta name="twitter:description" content="Passle blog"/>
              <meta name="twitter:image" content="${e.origin}/output/og/${t.title}.png"/>
              <meta name="twitter:image:src" content="${e.origin}/output/og/${t.title}.png" />

            <//>

            <article class="post">
              ${i}
            </article>
          <//>
        `}},{path:"/thoughts",render:({url:e,params:t,query:a,request:r})=>{let i=fetch(e.origin+"/output/thoughts/overview.html");return p`
          <${u} title="Thoughts">
            <h2>Thoughts</h2>
            <p class="larger-text">
              Not quite blogs, not quite tweets. Something in between. Likely opinionated, potentially wrong. Subject to change over time.
            </p>
            ${i}
          <//>
        `}},{path:"/definitions",render:({url:e,params:t,query:a,request:r})=>p`
          <${u} title="Definitions">
            <h2>Definitions</h2>
            <article class="post">
              <dl>
                <dt id="buildless-development"><a href="#buildless-development">Buildless development</a></dt>
                <dd class="${e.hash==="#buildless-development"?"selected":""}">Local development using native ESM and web standards; code that you write runs in the browser without any transformation. Note that this does not include Vite; Vite does a bunch of non-standard transformations and (pre-)bundling out of the box.</dd>
              </dl>
              <dl>
                <dt id="swsr"><a href="#swsr">SWSR</a></dt>
                <dd class="${e.hash==="#swsr"?"selected":""}">Service Worker Side Rendering. SSR, but in a Service Worker.</dd>
              </dl>
              <dl>
                <dt id="swtl"><a href="#swtl">SWTL</a></dt>
                <dd class="${e.hash==="#swtl"?"selected":""}">Service Worker Templating Language.</dd>
              </dl>
            </article>
          <//>
        `},{path:"/thoughts/:title",render:({url:e,params:t,query:a,request:r})=>{let i=fetch(e.origin+"/output/thoughts/"+t.title+"/index.html"),n=C(t.title),o=`${e.origin}/thoughts/${t.title}`;return p`
          <${u} title="${"Passle blog - "+n}">
            <${S} name="head">
              <meta property="og:site_name" content="Passle blog">
              <meta property="og:url" content="${o}"/>
              <meta property="og:type" content="website"/>
              <meta property="og:title" content="${n}"/>
              <meta property="og:description" content="Passle blog"/>
              <meta property="og:image" content="${e.origin}/output/og/${t.title}.png"/>
              <meta property="og:image:alt" content="${n}"/>

              <meta content="@passle_" name="twitter:site"/>
              <meta content="@passle_" name="twitter:creator"/>
              <meta name="twitter:card" content="summary_large_image"/>
              <meta name="twitter:url" content="${o}"/>
              <meta name="twitter:title" content="${n}"/>
              <meta name="twitter:image:alt" content="${n}">
              <meta name="twitter:description" content="Passle blog"/>
              <meta name="twitter:image" content="${e.origin}/output/og/${t.title}.png"/>
              <meta name="twitter:image:src" content="${e.origin}/output/og/${t.title}.png" />

            <//>

            <article class="post">
              ${i}
            </article>
          <//>
        `}},{path:"/foo",render:({url:e,params:t,query:a,request:r})=>p`
          <${u} title="Foo">
            <h2>Foo</h2>
          <//>
        `}]});self.addEventListener("install",()=>{self.skipWaiting()});self.addEventListener("activate",e=>{e.waitUntil(clients.claim().then(()=>{self.clients.matchAll().then(t=>{t.forEach(a=>a.postMessage({type:"SW_ACTIVATED"}))})}))});self.addEventListener("fetch",e=>{e.request.mode==="navigate"&&e.respondWith(j.handleRequest(e.request))});})();
//# sourceMappingURL=sw.js.map
