import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import axios from 'axios'
import { SECRET_API_KEY, NYT_BASE_URL } from '$env/static/private';

interface Article {
    headline: string;
    summary: string;
    pubDate: string;
    image?: string;
}

/**
 * Fetch the latests news articles from NYT.
 * @returns A list of the latest news articles from NYT.
 */
async function fetchLatestNews() {
    console.log('BASE URL:', NYT_BASE_URL)
    const today = new Date();
    const curDate = today.getDate();
    const curMonth = today.getUTCMonth();
    const curYear = today.getFullYear();
    const dateString = `${curYear}-${curMonth}-${curDate}`;
    return await axios.get(`${NYT_BASE_URL}/search/v2/articlesearch.json?fq=pub_date:(${dateString})&api-key=${SECRET_API_KEY}`);
}

export const load = (async () => {
    const latestNewsResponse = await fetchLatestNews();
    if (latestNewsResponse.data.response) {
        const articles: Article[] = [];
        for (const responseArticle of latestNewsResponse.data.response.docs) {
            const article: Article = {
                headline: responseArticle.abstract,
                summary: responseArticle.lead_paragraph,
                pubDate: responseArticle.pub_date
            };

            if (responseArticle.multimedia.length > 0) {
                article.image = responseArticle.multimedia[0].url;
            }

            articles.push(article);
        }
        return {
            articles: articles
        };
    }
    throw error(404, 'Not found');
}) satisfies PageServerLoad;