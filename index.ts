import express from 'express';
import {Readability} from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import { parse } from 'node-html-parser';
import createDOMPurify from 'dompurify';

const app = express();
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/*splat', async (req, res) => {
    let url = req.path.substring(1); // remove the leading 
    console.log(url);
    const siteResponse = await fetch(url);
    const siteHTML = await siteResponse.text();
    const siteDOM = new JSDOM(siteHTML, {url: url});
    const article = new Readability(siteDOM.window.document).parse()
    const articleHTML = santize_html(article?.content as string);
    const title = article?.title;
    const publishedTime = new Date(article?.publishedTime as string).toLocaleString();
    const readTime = `${Math.round(article?.length as number / (5 * 238))} min`; // 5 characters per word, 238 words per minute
    const root = parse(articleHTML as string);
    const mainContent = root.querySelector('#readability-page-1')?.lastChild;
    console.log(title);

    res.render('index', {title: title, published_time: publishedTime, read_time: readTime, htmlContent: mainContent?.toString()});
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});

function santize_html(html: string) {
    const window = new JSDOM('').window;
    const DOMPurify = createDOMPurify(window);
    const sanitizedHTML = DOMPurify.sanitize(html);
    return sanitizedHTML;
}