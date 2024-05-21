import { Marked } from 'marked';
import puppeteer from 'puppeteer';
import { markedHighlight } from 'marked-highlight';
import { getHighlighter } from 'shikiji'
import fm from 'front-matter';
import { html, renderToString } from 'swtl';
import { 
  readFileSync, 
  writeFileSync, 
  readdirSync, 
  lstatSync,
  mkdirSync, 
  existsSync 
} from 'fs';

/**
 * @TODO
 * - OG image: https://og-playground.vercel.app/
 */

const highlighter = await getHighlighter({
  themes: ['nord'],
  langs: ['javascript', 'html', 'rust', 'ts'],
});

const allPosts = [];

function createParser(overview, kind) {
  const marked = new Marked(
    /** 
     * Code snippet syntax highlighting 
     */
    markedHighlight({
      async: true,
      highlight(code, lang) {
        const language = lang === 'js' ? 'javascript' : lang;
  
        return highlighter.codeToHtml(code, {
          lang: language,
          theme: 'nord',
        });
      }
    })
  );


  marked.use({ 
    renderer: {
      /**
       * Turn headings into anchor links
       */
      heading(text, level) {
        const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

        return `
          <h${level + 1}>
            <a name="${escapedText}" href="#${escapedText}">${text}</a>
          </h${level + 1}>
        `;
      }
    },
    hooks: {
      /**
       * Handle frontmatter
       */
      preprocess: (markdown) => {
        const { attributes: { title, description, updated }, body } = fm(markdown);
  
        allPosts.push({title, description, updated, kind});
        overview.push({title, description, updated, kind});

        return body;
      }
    }
  });


  return marked;
}

for (const dir of [
  './public/output', 
  './public/output/og', 
  './public/output/blog', 
  './public/output/thoughts'
]) {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
}

const posts = {
  thoughts: [],
  blog: [],
}

for (const kind of ['blog', 'thoughts']) {
  const parser = createParser(posts[kind], kind);
  const dirs = readdirSync(kind);
  
  for (const dir of dirs) {
    const path = `./${kind}/${dir}`;
  
    if (lstatSync(path).isDirectory()) {
      const path = `./${kind}/${dir}/index.md`;
      const blog = readFileSync(path, 'utf8');
      const blogAsHtml = await parser.parse(blog);
  
      const blogOutputDir = `./public/output/${kind}/${dir}`;
      if (!existsSync(blogOutputDir)) {
        mkdirSync(blogOutputDir);
      }
  
      writeFileSync(`./public/output/${kind}/${dir}/index.html`, blogAsHtml);
    }
  }
}

/**
 * Build overview list
 */

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

function createHtml({title, description, updated, kind}) {
  const date = new Date(updated);
  return html`
    <li class="overview-li">
      <a href="/${kind}/${title.toLowerCase().split(' ').join('-')}">
        <article class="overview-item">
          <h3>${title}</h3>
          <p class="date">${date.toISOString().split('T')[0]}, ${capitalize(kind === 'thoughts' ? 'thought' : 'blog')}</p>
          <p class="description">${description}</p>
        </article>
      </a>
    </li>
  `;
}

const sort = (a, b) => new Date(b.updated) - new Date(a.updated);

const overview = [...posts.thoughts, ...posts.blog]
  .sort(sort)
  .map(createHtml);
const blogsOverview = posts.blog
  .sort(sort)
  .map(createHtml);
const thoughtsOverview = posts.thoughts
  .sort(sort)
  .map(createHtml);

writeFileSync('./public/output/overview.html', await renderToString(html`<ul>${overview}</ul>`));
writeFileSync('./public/output/blog/overview.html', await renderToString(html`<ul>${blogsOverview}</ul>`));
writeFileSync('./public/output/thoughts/overview.html', await renderToString(html`<ul>${thoughtsOverview}</ul>`));

/**
 * Create OG images
 */

const browser = await puppeteer.launch({
  headless: true,
});

for (const post of [...posts.thoughts, ...posts.blog]) {
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 630,
  });

  await page.setContent(await renderToString(html`
      <html>
        <head>
          <style>
            * {
              font-family: system-ui;
              font-size: 1.15em;
            }

            body {
              margin: 20px;
            }

            h1 {
              font-size: 80px;
              color: white;
              margin-top: 30px;

              text-shadow:
              4px 4px 0 #000,
              -2px -2px 0 #000,  
              2px -2px 0 #000,
              -2px 2px 0 #000,
              2px 2px 0 #000;
              text-align: center;
            }

            h2 {
              font-size: 75px;
              margin-top: 45px;
              margin-bottom: 35px;
            }

            p {
              font-size: 43px;
            }

            .card {
              height: calc(100% - 2.3em);
              width: calc(100% - 2.3em);
              margin: auto;
              border: solid 4px black;
              padding: 20px;
              box-shadow: 6px 6px 6px black;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>PASSLE</h1>
            <h2>${post.title}</h2>
            <p>${post.description}</p>
          </div>
        </body>
      </html>
    `), {
    waitUntil: 'networkidle0',
  });

  const screenshotBuffer = await page.screenshot({
    fullPage: false,
    type: 'png',
    path: `./public/output/og/${post.title.toLowerCase().split(' ').join('-')}.png`
  });

  await page.close();
}
await browser.close();

/**
 * @TODO
 * - Create rss feed
 */