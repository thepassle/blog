(()=>{var M=Object.freeze,U=Object.defineProperty;var O=(e,t)=>M(U(e,"raw",{value:M(t||e.slice())}));var k=Symbol("component"),T=Symbol("await"),P=Symbol("slot");var y="TEXT",_="COMPONENT",g="NONE",b="PROP",v="CHILDREN",w="SET_PROP",A="PROP_VAL";function*p(e,...t){if(!t.length)yield*e;else if(!t.some(l=>typeof l=="function"))yield*e.reduce((l,n,i)=>[...l,n,...t.length>i?[t[i]]:[]],[]);else{let l=y,n=g,i=g,r=[];for(let o=0;o<e.length;o++){let s="",f={kind:k,slots:{},properties:[],children:[],fn:void 0};for(let a=0;a<e[o].length;a++){let c=e[o][a];if(l===y)c==="<"&&!e[o][a+1]&&typeof t[o]=="function"?(l=_,f.fn=t[o],r.push(f)):s+=c;else if(l===_)if(n===b){let h=r[r.length-1],x=h?.properties[h.properties.length-1];if(i===w){let d="";for(;e[o][a]!=="="&&e[o][a]!=="/"&&e[o][a]!==">"&&e[o][a]!=='"'&&e[o][a]!=="'"&&e[o][a]!==" "&&d!=="...";)d+=e[o][a],a++;if(e[o][a]==="=")i=A;else if(e[o][a]==="/"&&n===b){n=g,i=g;let u=r.pop();r.length||(s="",yield u)}else e[o][a]===">"&&n===b&&(n=v,i=g);d==="..."?h.properties.push(...Object.entries(t[o]).map(([u,I])=>({name:u,value:I}))):d&&h.properties.push({name:d,value:!0})}else if(i===A){if(e[o][a]==='"'||e[o][a]==="'"){let d=e[o][a];if(!e[o][a+1])x.value=t[o],i=w;else{let u="";for(a++;e[o][a]!==d;)u+=e[o][a],a++;x.value=u||"",i=w}}else if(e[o][a-1]){let d="";for(;e[o][a]!==" "&&e[o][a]!=="/"&&e[o][a]!==">";)d+=e[o][a],a++;if(x.value=d||"",i=w,e[o][a]==="/"){let u=r.pop();r.length||(yield u)}}else if(x.value=t[o-1],i=w,e[o][a]===">")i=g,n=v;else if(e[o][a]==="/"){let d=r.pop();r.length||(i=g,n=g,l=y,a++,yield d)}}}else if(n===v){let h=r[r.length-1];if(e[o][a]==="<"&&e[o][a+1]==="/"&&e[o][a+2]==="/"){s&&(h.children.push(s),s=""),a+=3;let x=r.pop();r.length||(l=y,n=g,yield x)}else e[o][a]==="<"&&!e[o][a+1]&&typeof t[o]=="function"?(s&&(h.children.push(s),s=""),n=b,i=w,f.fn=t[o],r.push(f)):e[o][a+1]?s+=e[o][a]:s&&h&&(s+=e[o][a],h.children.push(s))}else if(c===">")n=v;else if(c===" ")n=b,i=w;else if(c==="/"&&e[o][a+1]===">"){l=y,n=g;let h=r.pop();r.length||(s="",yield h),a++}else s+=c;else s+=c}n===v&&t.length>o&&r[r.length-1].children.push(t[o]),s&&n!==v&&(yield s),r.length>1&&f.fn&&r[r.length-2].children.push(f),t.length>o&&l!==_&&(yield t[o])}}}function W({promise:e,children:t}){return{promise:e,template:t.find(l=>typeof l=="function")}}W.kind=T;function Y(e){return typeof e.getReader=="function"}async function*V(e){let t=e.getReader(),l=new TextDecoder("utf-8");try{for(;;){let{done:n,value:i}=await t.read();if(n)return;yield l.decode(i)}}finally{t.releaseLock()}}async function*F(e){if(Y(e))for await(let t of V(e))yield t;else for await(let t of e)yield t}async function*E(e,t){if(typeof e=="string")yield e;else if(typeof e=="function")yield*E(e(),t);else if(Array.isArray(e))yield*R(e,t);else if(typeof e?.then=="function"){let l=await e;yield*E(l,t)}else if(e instanceof Response&&e.body)yield*F(e.body);else if(e?.[Symbol.asyncIterator]||e?.[Symbol.iterator])yield*R(e,t);else if(e?.fn?.kind===T){let{promise:l,template:n}=e.fn({...e.properties.reduce((r,o)=>({...r,[o.name]:o.value}),{}),children:e.children}),i=t.length;t.push(l().then(r=>({id:i,template:n({pending:!1,error:!1,success:!0},r,null)})).catch(r=>(console.error(r.stack),{id:i,template:n({pending:!1,error:!0,success:!1},null,r)}))),yield*R(p`<awaiting-promise style="display: contents;" data-id="${i.toString()}">${n({pending:!0,error:!1,success:!1},null,null)}</awaiting-promise>`,t)}else if(e?.kind===k){let l=[],n={};for(let i of e.children)if(i?.fn?.kind===P){let r=i.properties.find(o=>o.name==="name")?.value||"default";n[r]=i.children}else l.push(i);yield*E(await e.fn({...e.properties.reduce((i,r)=>({...i,[r.name]:r.value}),{}),children:l,slots:n}),t)}else{let l=e?.toString();l==="[object Object]"?yield JSON.stringify(e):yield l}}async function*R(e,t){for await(let l of e)yield*E(l,t)}var B;async function*L(e){let t=[];for(yield*R(e,t),t=t.map(l=>{let n=l.then(i=>(t.splice(t.indexOf(n),1),i));return n});t.length>0;){let l=await Promise.race(t),{id:n,template:i}=l;yield*L(p(B||(B=O([`
      <template data-id="`,'">',`</template>
      <script>
        {
          let toReplace = document.querySelector('awaiting-promise[data-id="`,`"]');
          const template = document.querySelector('template[data-id="`,`"]').content.cloneNode(true);
          toReplace.replaceWith(template);
        }
      <\/script>
    `])),n.toString(),i,n.toString(),n.toString()))}}var S=class{constructor({routes:t,fallback:l,plugins:n=[],baseHref:i=""}){this.plugins=n,this.fallback={render:l,params:{}},this.routes=t.map(r=>({...r,urlPattern:new URLPattern({pathname:`${i}${r.path}`,search:"*",hash:"*"})}))}_getPlugins(t){return[...this.plugins??[],...t?.plugins??[]]}async handleRequest(t){let l=new URL(t.url),n;for(let r of this.routes){let o=r.urlPattern.exec(l);if(o){n={options:r.options,render:r.render,params:o?.pathname?.groups??{},plugins:r.plugins};break}}let i=n?.render??this?.fallback?.render;if(i){let r=new URL(t.url),o=Object.fromEntries(new URLSearchParams(r.search)),s=n?.params,f=this._getPlugins(n);for(let a of f)try{let c=await a?.beforeResponse({url:r,query:o,params:s,request:t});if(c)return c}catch(c){throw console.log(`Plugin "${a.name}" error on beforeResponse hook`,c),c}return new N(await i({url:r,query:o,params:s,request:t}),n?.options??{})}}},N=class{constructor(t,l={}){let n=L(t),i=new TextEncoder,r=new ReadableStream({async pull(o){try{let{value:s,done:f}=await n.next();f?o.close():o.enqueue(i.encode(s))}catch(s){throw console.error(s.stack),s}}});return new Response(r,{status:200,headers:{"Content-Type":"text/html","Transfer-Encoding":"chunked",...l?.headers??{}},...l})}};function $(){}$.kind=P;var q=globalThis?.Netlify?"server":"worker";var D;function m({title:e,children:t,slots:l}){return p(D||(D=O([`
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
  `])),e??"",l?.head??"",t,q==="server"?"on the server":"in a service worker",q==="worker")}function C(e){let t=e.toLowerCase().split("-").join(" ");return t.charAt(0).toUpperCase()+t.slice(1)}var j=new S({routes:[{path:"/",render:({url:e,params:t,query:l,request:n})=>{let i=fetch(e.origin+"/output/overview.html");return p`
          <${m} title="Passle">
            <h2>Overview</h2>
            ${i}
          <//>
        `}},{path:"/blog",render:({url:e,params:t,query:l,request:n})=>{let i=fetch(e.origin+"/output/blog/overview.html");return p`
          <${m} title="Blog">
            <h2>Blogs</h2>
            ${i}
          <//>
        `}},{path:"/blog/:title",render:({url:e,params:t,query:l,request:n})=>{let i=fetch(e.origin+"/output/blog/"+t.title+"/index.html"),r=C(t.title),o=`${e.origin}/blog/${t.title}`;return p`
          <${m} title="${"Passle blog - "+r}"> 

            <${$} name="head">
              <meta property="og:url" content="${o}"/>
              <meta property="og:type" content="website"/>
              <meta property="og:title" content="${r}"/>
              <meta property="og:description" content="Passle blog"/>
              <meta property="og:image" content="${e.origin}/output/og/${t.title}.png"/>

              <meta name="twitter:card" content="summary_large_image"/>
              <meta property="twitter:url" content="${o}"/>
              <meta name="twitter:title" content="${r}"/>
              <meta name="twitter:description" content="Passle blog"/>
              <meta name="twitter:image" content="${e.origin}/output/og/${t.title}.png"/>
            <//>

            <article class="post">
              ${i}
            </article>
          <//>
        `}},{path:"/thoughts",render:({url:e,params:t,query:l,request:n})=>{let i=fetch(e.origin+"/output/thoughts/overview.html");return p`
          <${m} title="Thoughts">
            <h2>Thoughts</h2>
            <p class="larger-text">
              Not quite blogs, not quite tweets. Something in between. Likely opinionated, potentially wrong. Subject to change over time.
            </p>
            ${i}
          <//>
        `}},{path:"/definitions",render:({url:e,params:t,query:l,request:n})=>p`
          <${m} title="Definitions">
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
        `},{path:"/thoughts/:title",render:({url:e,params:t,query:l,request:n})=>{let i=fetch(e.origin+"/output/thoughts/"+t.title+"/index.html"),r=C(t.title),o=`${e.origin}/thought/${t.title}`;return p`
          <${m} title="${"Passle blog - "+r}">
            <${$} name="head">
              <meta property="og:url" content="${o}"/>
              <meta property="og:type" content="website"/>
              <meta property="og:title" content="${r}"/>
              <meta property="og:description" content="Passle blog"/>
              <meta property="og:image" content="${e.origin}/output/og/${t.title}.png"/>

              <meta name="twitter:card" content="summary_large_image"/>
              <meta property="twitter:url" content="${o}"/>
              <meta name="twitter:title" content="${r}"/>
              <meta name="twitter:description" content="Passle blog"/>
              <meta name="twitter:image" content="${e.origin}/output/og/${t.title}.png"/>
            <//>

            <article class="post">
              ${i}
            </article>
          <//>
        `}},{path:"/foo",render:({url:e,params:t,query:l,request:n})=>p`
          <${m} title="Foo">
            <h2>Foo</h2>
          <//>
        `}]});self.addEventListener("install",()=>{self.skipWaiting()});self.addEventListener("activate",e=>{e.waitUntil(clients.claim().then(()=>{self.clients.matchAll().then(t=>{t.forEach(l=>l.postMessage({type:"SW_ACTIVATED"}))})}))});self.addEventListener("fetch",e=>{e.request.mode==="navigate"&&e.respondWith(j.handleRequest(e.request))});})();
//# sourceMappingURL=sw.js.map
