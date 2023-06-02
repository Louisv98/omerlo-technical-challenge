import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import axios, { type AxiosResponse } from 'axios'
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
async function fetchLatestNews(): Promise<AxiosResponse> {
    console.log('BASE URL:', NYT_BASE_URL)
    const today = new Date();
    const curDate = today.getDate();
    const curMonth = today.getUTCMonth();
    const curYear = today.getFullYear();
    const dateString = `${curYear}-${curMonth}-${curDate}`;
    return await axios.get(`${NYT_BASE_URL}/search/v2/articlesearch.json?fq=pub_date:(${dateString})&api-key=${SECRET_API_KEY}`);
}

/**
 * Creates an instance of Article object from a JSON response from the NYT API.
 * @param nytResponse The JSON response from NYT API.
 * @returns An article object.
 */
function createArticleFromResponse(nytResponse: any): Article {
    const article: Article = {
        headline: nytResponse.headline.main,
        summary: nytResponse.lead_paragraph,
        pubDate: nytResponse.pub_date.split('T')[0]
    }

    if (nytResponse.multimedia.length > 0) {
        article.image = `https://www.nytimes.com/${nytResponse.multimedia[0].url}`;
    }

    return article;
}

export const load = (async () => {
    const latestNewsResponse = await fetchLatestNews();
    if (latestNewsResponse.data.response) {
        const articles: Article[] = [];
        for (const responseArticle of latestNewsResponse.data.response.docs) {
            articles.push(createArticleFromResponse(responseArticle));
        }
        return {
            articles: articles
        };
    }
    throw error(404, 'Not found');
}) satisfies PageServerLoad;