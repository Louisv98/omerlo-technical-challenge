import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SECRET_API_KEY, NYT_BASE_URL } from '$env/static/private';
import type { Article } from '../interfaces/article';

/**
 * Fetch the latests news articles from NYT.
 * @returns A list of the latest news articles from NYT.
 */
async function fetchLatestNews(fetch: any): Promise<Response> {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const dateString = `${year}-${month}-${day}`;
    return fetch(`${NYT_BASE_URL}/search/v2/articlesearch.json?fq=pub_date:(${dateString})&api-key=${SECRET_API_KEY}`);
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

export const load = (async ({ fetch }) => {
    try {
        const latestNewsResponse = await fetchLatestNews(fetch);
        if (latestNewsResponse.status === 200) {
            const articles: Article[] = [];
            const latestNewsJson = await latestNewsResponse.json()
            for (const responseArticle of latestNewsJson.response.docs) {
                articles.push(createArticleFromResponse(responseArticle));
            }
            return {
                articles: articles
            };
        }
    } catch (error) {
        console.error(`Error in load function for /: ${error}`);
        return {
            articles: []
        };
    }
    //throw error(500, 'Error while loading news');
}) satisfies PageServerLoad;