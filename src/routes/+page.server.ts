import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import axios, { type AxiosResponse } from 'axios'
import { SECRET_API_KEY, NYT_BASE_URL } from '$env/static/private';
import type { Article } from '../interfaces/article';

/**
 * Fetch the latests news articles from NYT.
 * @returns A list of the latest news articles from NYT.
 */
async function fetchLatestNews(): Promise<AxiosResponse> {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    return await axios.get(`${NYT_BASE_URL}/search/v2/articlesearch.json?fq=pub_date:(${dateString})&api-key=${SECRET_API_KEY}`);
}

/**
 * Creates an instance of Article object from a JSON response from the NYT API.
 * @param nytResponse The JSON response from NYT API.
 * @returns An article object.
 */
function createArticleFromResponse(nytResponse: any): Article {
    const article: Article = {
        id: nytResponse.uri.split('/')[3],
        headline: nytResponse.headline.main,
        summary: nytResponse.snippet,
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