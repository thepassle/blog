(()=>{var _=Object.freeze,B=Object.defineProperty;var O=(e,t)=>_(B(e,"raw",{value:_(t||e.slice())}));var k=Symbol("component"),T=Symbol("await");var y="TEXT",$="COMPONENT",f="NONE",b="PROP",v="CHILDREN",w="SET_PROP",A="PROP_VAL";function*p(e,...t){if(!t.length)yield*e;else if(!t.some(i=>typeof i=="function"))yield*e.reduce((i,r,l)=>[...i,r,...t.length>l?[t[l]]:[]],[]);else{let i=y,r=f,l=f,a=[];for(let o=0;o<e.length;o++){let s="",u={kind:k,properties:[],children:[],fn:void 0};for(let n=0;n<e[o].length;n++){let c=e[o][n];if(i===y)c==="<"&&!e[o][n+1]&&typeof t[o]=="function"?(i=$,u.fn=t[o],a.push(u)):s+=c;else if(i===$)if(r===b){let h=a[a.length-1],x=h?.properties[h.properties.length-1];if(l===w){let d="";for(;e[o][n]!=="="&&e[o][n]!=="/"&&e[o][n]!==">"&&e[o][n]!=='"'&&e[o][n]!=="'"&&e[o][n]!==" "&&d!=="...";)d+=e[o][n],n++;if(e[o][n]==="=")l=A;else if(e[o][n]==="/"&&r===b){r=f,l=f;let g=a.pop();a.length||(s="",yield g)}else e[o][n]===">"&&r===b&&(r=v,l=f);d==="..."?h.properties.push(...Object.entries(t[o]).map(([g,j])=>({name:g,value:j}))):d&&h.properties.push({name:d,value:!0})}else if(l===A){if(e[o][n]==='"'||e[o][n]==="'"){let d=e[o][n];if(!e[o][n+1])x.value=t[o],l=w;else{let g="";for(n++;e[o][n]!==d;)g+=e[o][n],n++;x.value=g||"",l=w}}else if(e[o][n-1]){let d="";for(;e[o][n]!==" "&&e[o][n]!=="/"&&e[o][n]!==">";)d+=e[o][n],n++;if(x.value=d||"",l=w,e[o][n]==="/"){let g=a.pop();a.length||(yield g)}}else if(x.value=t[o-1],l=w,e[o][n]===">")l=f,r=v;else if(e[o][n]==="/"){let d=a.pop();a.length||(l=f,r=f,i=y,n++,yield d)}}}else if(r===v){let h=a[a.length-1];if(e[o][n]==="<"&&e[o][n+1]==="/"&&e[o][n+2]==="/"){s&&(h.children.push(s),s=""),n+=3;let x=a.pop();a.length||(i=y,r=f,yield x)}else e[o][n]==="<"&&!e[o][n+1]&&typeof t[o]=="function"?(s&&(h.children.push(s),s=""),r=b,l=w,u.fn=t[o],a.push(u)):e[o][n+1]?s+=e[o][n]:s&&h&&(s+=e[o][n],h.children.push(s))}else if(c===">")r=v;else if(c===" ")r=b,l=w;else if(c==="/"&&e[o][n+1]===">"){i=y,r=f;let h=a.pop();a.length||(s="",yield h),n++}else s+=c;else s+=c}r===v&&t.length>o&&a[a.length-1].children.push(t[o]),s&&r!==v&&(yield s),a.length>1&&u.fn&&a[a.length-2].children.push(u),t.length>o&&i!==$&&(yield t[o])}}}function C({promise:e,children:t}){return{promise:e,template:t.find(i=>typeof i=="function")}}C.kind=T;function I(e){return typeof e.getReader=="function"}async function*V(e){let t=e.getReader(),i=new TextDecoder("utf-8");try{for(;;){let{done:r,value:l}=await t.read();if(r)return;yield i.decode(l)}}finally{t.releaseLock()}}async function*U(e){if(I(e))for await(let t of V(e))yield t;else for await(let t of e)yield t}async function*E(e,t){if(typeof e=="string")yield e;else if(typeof e=="function")yield*E(e(),t);else if(Array.isArray(e))yield*P(e,t);else if(typeof e?.then=="function"){let i=await e;yield*E(i,t)}else if(e instanceof Response&&e.body)yield*U(e.body);else if(e?.[Symbol.asyncIterator]||e?.[Symbol.iterator])yield*P(e,t);else if(e?.fn?.kind===T){let{promise:i,template:r}=e.fn({...e.properties.reduce((a,o)=>({...a,[o.name]:o.value}),{}),children:e.children}),l=t.length;t.push(i().then(a=>({id:l,template:r({pending:!1,error:!1,success:!0},a,null)})).catch(a=>(console.error(a.stack),{id:l,template:r({pending:!1,error:!0,success:!1},null,a)}))),yield*P(p`<awaiting-promise style="display: contents;" data-id="${l.toString()}">${r({pending:!0,error:!1,success:!1},null,null)}</awaiting-promise>`,t)}else if(e?.kind===k)yield*E(await e.fn({...e.properties.reduce((i,r)=>({...i,[r.name]:r.value}),{}),children:e.children}),t);else{let i=e?.toString();i==="[object Object]"?yield JSON.stringify(e):yield i}}async function*P(e,t){for await(let i of e)yield*E(i,t)}var W;async function*R(e){let t=[];for(yield*P(e,t),t=t.map(i=>{let r=i.then(l=>(t.splice(t.indexOf(r),1),l));return r});t.length>0;){let i=await Promise.race(t),{id:r,template:l}=i;yield*R(p(W||(W=O([`
      <template data-id="`,'">',`</template>
      <script>
        {
          let toReplace = document.querySelector('awaiting-promise[data-id="`,`"]');
          const template = document.querySelector('template[data-id="`,`"]').content.cloneNode(true);
          toReplace.replaceWith(template);
        }
      <\/script>
    `])),r.toString(),l,r.toString(),r.toString()))}}var S=class{constructor({routes:t,fallback:i,plugins:r=[],baseHref:l=""}){this.plugins=r,this.fallback={render:i,params:{}},this.routes=t.map(a=>({...a,urlPattern:new URLPattern({pathname:`${l}${a.path}`,search:"*",hash:"*"})}))}_getPlugins(t){return[...this.plugins??[],...t?.plugins??[]]}async handleRequest(t){let i=new URL(t.url),r;for(let a of this.routes){let o=a.urlPattern.exec(i);if(o){r={render:a.render,params:o?.pathname?.groups??{},plugins:a.plugins};break}}let l=r?.render??this?.fallback?.render;if(l){let a=new URL(t.url),o=Object.fromEntries(new URLSearchParams(a.search)),s=r?.params,u=this._getPlugins(r);for(let n of u)try{let c=await n?.beforeResponse({url:a,query:o,params:s,request:t});if(c)return c}catch(c){throw console.log(`Plugin "${n.name}" error on beforeResponse hook`,c),c}return new N(await l({url:a,query:o,params:s,request:t}))}}},N=class{constructor(t){let i=R(t),r=new TextEncoder,l=new ReadableStream({async pull(a){try{let{value:o,done:s}=await i.next();s?a.close():a.enqueue(r.encode(o))}catch(o){throw console.error(o.stack),o}}});return new Response(l,{status:200,headers:{"Content-Type":"text/html","Transfer-Encoding":"chunked"}})}};var L=globalThis?.Netlify?"server":"worker";var M;function m({title:e,children:t}){return p(M||(M=O([`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
        <meta name="Description" content="Passle blog">
        <title>`,`</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
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
  `])),e??"",t,L==="server"?"on the server":"in a service worker",L==="worker")}function q(e){let t=e.toLowerCase().split("-").join(" ");return"Passle blog - "+t.charAt(0).toUpperCase()+t.slice(1)}var D=new S({routes:[{path:"/",render:({url:e,params:t,query:i,request:r})=>{let l=fetch(e.origin+"/output/overview.html");return p`
          <${m} title="Passle">
            <h2>Overview</h2>
            ${l}
          <//>
        `}},{path:"/blog",render:({url:e,params:t,query:i,request:r})=>{let l=fetch(e.origin+"/output/blog/overview.html");return p`
          <${m} title="Blog">
            <h2>Blogs</h2>
            ${l}
          <//>
        `}},{path:"/blog/:title",render:({url:e,params:t,query:i,request:r})=>{let l=fetch(e.origin+"/output/blog/"+t.title+"/index.html");return p`
          <${m} title="${q(t.title)}">
            <article class="post">
              ${l}
            </article>
          <//>
        `}},{path:"/thoughts",render:({url:e,params:t,query:i,request:r})=>{let l=fetch(e.origin+"/output/thoughts/overview.html");return p`
          <${m} title="Thoughts">
            <h2>Thoughts</h2>
            <p class="larger-text">
              Not quite blogs, not quite tweets. Something in between. Likely opinionated, potentially wrong. Subject to change over time.
            </p>
            ${l}
          <//>
        `}},{path:"/definitions",render:({url:e,params:t,query:i,request:r})=>p`
          <${m} title="Definitions">
            <h2>Definitions</h2>
            <article class="post">
              <dl>
                <dt id="buildless-development"><a href="#buildless-development">Buildless development</a></dt>
                <dd class="${e.hash==="#buildless-development"?"selected":""}">Local development using native ESM and web standards; code that you write runs in the browser without any transformation. Note that does not include Vite; Vite does a bunch of non-standard transformations and (pre-)bundling out of the box.</dd>
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
        `},{path:"/thoughts/:title",render:({url:e,params:t,query:i,request:r})=>{let l=fetch(e.origin+"/output/thoughts/"+t.title+"/index.html");return p`
          <${m} title="${q(t.title)}">
            <article class="post">
              ${l}
            </article>
          <//>
        `}},{path:"/foo",render:({url:e,params:t,query:i,request:r})=>p`
          <${m} title="Foo">
            <h2>Foo</h2>
          <//>
        `}]});self.addEventListener("install",()=>{self.skipWaiting()});self.addEventListener("activate",e=>{e.waitUntil(clients.claim().then(()=>{self.clients.matchAll().then(t=>{t.forEach(i=>i.postMessage({type:"SW_ACTIVATED"}))})}))});self.addEventListener("fetch",e=>{e.request.mode==="navigate"&&e.respondWith(D.handleRequest(e.request))});})();
//# sourceMappingURL=sw.js.map
