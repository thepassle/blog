import { html, Router, Slot, Await, when } from 'swtl';
import { Html } from './src/Html.js';
import { title } from './src/utils.js';
import { ENV } from './env.js';

function RenderPost({promise}) {
  return html`
    <${Await} promise=${() => promise.then(b => b.text())}>
      ${(status, data, error) => html`
        ${when(status.pending, () => html`
          <div class="post-loading-title"></div>
          <div class="loading-content">
            ${Array.from({ length: Math.floor(Math.random() * 11) + 5 }, () => Math.random()).map(i => html`
              <div style="width: ${Math.floor(Math.random() * 11) + 90}%" class="post-loading-bar"></div>
            `)}
          </div>
        `)}
        ${when(status.error, () => html`<p>Failed to fetch blog.</p>`)}
        ${when(status.success, () => data)}
      `}
    <//>
  `
}

export const router = new Router({
  routes: [
    {
      path: '/',
      render: ({url, params, query, request}) => { 
        const overview = fetch(url.origin + '/output/overview.html');

        return html`
          <${Html} title="Passle">
            <h2>Overview</h2>
            ${overview}
          <//>
        `
      }
    },
    {
      path: '/blog',
      render: ({url, params, query, request}) => { 
        const overview = fetch(url.origin + '/output/blog/overview.html');

        return html`
          <${Html} title="Blog">
            <h2>Blogs</h2>
            ${overview}
          <//>
        `
      }
    },
    {
      path: '/blog/:title',
      render: ({url, params, query, request}) => {
        const blog = fetch(url.origin + '/output/blog/' + params.title + '/index.html');

        const blogTitle = title(params.title);
        const blogUrl = `${url.origin}/blog/${params.title}`;

        return html`
          <${Html} title="${"Passle blog - " + blogTitle}"> 

            <${Slot} name="head">
              <meta property="og:site_name" content="Passle blog">
              <meta property="og:url" content="${blogUrl}"/>
              <meta property="og:type" content="website"/>
              <meta property="og:title" content="${blogTitle}"/>
              <meta property="og:description" content="Passle blog"/>
              <meta property="og:image" content="${url.origin}/output/og/${params.title}.png"/>
              <meta property="og:image:alt" content="${blogTitle}"/>

              <meta content="@passle_" name="twitter:site"/>
              <meta content="@passle_" name="twitter:creator"/>
              <meta name="twitter:card" content="summary_large_image"/>
              <meta name="twitter:url" content="${blogUrl}"/>
              <meta name="twitter:title" content="${blogTitle}"/>
              <meta name="twitter:image:alt" content="${blogTitle}">
              <meta name="twitter:description" content="Passle blog"/>
              <meta name="twitter:image" content="${url.origin}/output/og/${params.title}.png"/>
              <meta name="twitter:image:src" content="${url.origin}/output/og/${params.title}.png" />

            <//>

            <article class="post">
              <${RenderPost} promise=${blog}/>
            </article>
          <//>
        `
      }
    },
    {
      path: '/thoughts',
      render: ({url, params, query, request}) => { 
        const overview = fetch(url.origin + '/output/thoughts/overview.html');

        return html`
          <${Html} title="Thoughts">
            <h2>Thoughts</h2>
            <p class="larger-text">
              Not quite blogs, not quite tweets. Something in between. Likely opinionated, potentially wrong. Subject to change over time.
            </p>
            ${overview}
          <//>
        `
      }
    },
    {
      path: '/definitions',
      render: ({url, params, query, request}) => { 

        return html`
          <${Html} title="Definitions">
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
        `
      }
    },
    {
      path: '/thoughts/:title',
      render: ({url, params, query, request}) => {
        const thought = fetch(url.origin + '/output/thoughts/' + params.title + '/index.html');

        const thoughtTitle = title(params.title);
        const thoughtUrl = `${url.origin}/thoughts/${params.title}`;

        return html`
          <${Html} title="${"Passle blog - " + thoughtTitle}">
            <${Slot} name="head">
              <meta property="og:site_name" content="Passle blog">
              <meta property="og:url" content="${thoughtUrl}"/>
              <meta property="og:type" content="website"/>
              <meta property="og:title" content="${thoughtTitle}"/>
              <meta property="og:description" content="Passle blog"/>
              <meta property="og:image" content="${url.origin}/output/og/${params.title}.png"/>
              <meta property="og:image:alt" content="${thoughtTitle}"/>

              <meta content="@passle_" name="twitter:site"/>
              <meta content="@passle_" name="twitter:creator"/>
              <meta name="twitter:card" content="summary_large_image"/>
              <meta name="twitter:url" content="${thoughtUrl}"/>
              <meta name="twitter:title" content="${thoughtTitle}"/>
              <meta name="twitter:image:alt" content="${thoughtTitle}">
              <meta name="twitter:description" content="Passle blog"/>
              <meta name="twitter:image" content="${url.origin}/output/og/${params.title}.png"/>
              <meta name="twitter:image:src" content="${url.origin}/output/og/${params.title}.png" />
            <//>

            <article class="post">
              <${RenderPost} promise=${thought}/>
            </article>
          <//>
        `
      }
    },
    {
      path: '/foo',
      render: ({url, params, query, request}) => {
        return html`
          <${Html} title="Foo">
            <h2>Foo</h2>
          <//>
        `
      }
    },
  ],
});