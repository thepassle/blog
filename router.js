import { html, Router } from 'swtl';
import { Html } from './src/Html.js';
import { title } from './src/utils.js';
import { ENV } from './env.js';

export const router = new Router({
  routes: [
    {
      path: '/',
      render: ({url, params, query, request}) => { 
        const overview = fetch(url.origin + '/output/overview.html');

        return html`
          <${Html} title="Home">
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
          <${Html} title="Home">
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

        return html`
          <${Html} title="${title(params.title)}">
            <article class="post">
              ${blog}
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
          <${Html} title="Home">
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
          <${Html} title="Home">
            <h2>Definitions</h2>
            <article class="post">
              <dl>
                <dt id="buildless-development"><a href="#buildless-development">Buildless development</a></dt>
                <dd class="${url.hash === '#buildless-development' ? 'selected' : ''}">Local development using native ESM and web standards; code that you write runs in the browser without any transformation. Note that does not include Vite; Vite does a bunch of non-standard transformations and (pre-)bundling out of the box.</dd>
              </dl>
              <dl>
                <dt id="swsr"><a href="#swsr">SWSR</a></dt>
                <dd class="${url.hash === '#swsr' ? 'selected' : ''}">Service Worker Side Rendering. SSR, but in a Service Worker.</dd>
              </dl>
              <dl>
                <dt id="swtl"><a href="#swtl">SWTL</a></dt>
                <dd class="${url.hash === '#swtl' ? 'selected' : ''}">Service Worker Templating Language.</dd>
              </dl>
            </article>
          <//>
        `
      }
    },
    {
      path: '/thoughts/:title',
      render: ({url, params, query, request}) => {
        const blog = fetch(url.origin + '/output/thoughts/' + params.title + '/index.html');

        return html`
          <${Html} title="${title(params.title)}">
            <article class="post">
              ${blog}
            </article>
          <//>
        `
      }
    },
    {
      path: '/foo',
      render: ({url, params, query, request}) => {
        console.log(url);
        return html`
          <${Html} title="Foo">
            <h2>Foo</h2>
          <//>
        `
      }
    },
  ],
});