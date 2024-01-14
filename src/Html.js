import { html } from 'swtl';
import { ENV } from '../env.js';

export function Html({title, children}) {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
        <meta name="Description" content="Passle blog">
        <title>${title ?? ''}</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
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
            justify-content: space-between;
            margin: 0;
            padding: 0;
            list-style: none;
          }

          h1 {
            color: white;

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
            line-height: 1.4em;
            font-size: 22px;
          }

          .post ul {
            list-style: initial;
            padding-left: 20px;
          }

          .post p {
            line-height: 1.4em;
          }

          .post p code {
            font-weight: 700;
          }

          .post dt {
            font-weight: 700;
          }

          @media (max-width: 600px) {

            nav {
              margin-left: auto;
              margin-right: auto;
              max-width: 200px;
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
          ${children}
        </main>
        <footer>
          <ul class="social-links">
            <li><a target="_blank" href="https://github.com/thepassle">Github</a></li>
            <li><a target="_blank" href="https://mastodon.social/@passle">Mastodon</a></li>
            <li><a target="_blank" href="https://twitter.com/passle_">Twitter</a></li>
            <li><a target="_blank" href="/rss">RSS</a></li>
          </ul>
          <div>
            <p>This blog was rendered ${ENV === 'server' ? 'on the server' : 'in a service worker'}</p>
            <p>The source for this blog can be found <a target="_blank" href="https://github.com/thepassle/blog">here</a>, please feel free to steal it and use it for your own projects</p>
          </div>
        </footer>
      </body>
      <script>
        navigator.serviceWorker.register('/sw.js').then((registration) => {
          console.log('Service worker registered successfully', registration);

          if (!navigator.serviceWorker.controller && ${ENV === 'worker'}) {
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

      </script>
    </html>
  `
}