import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { PUBLIC_NYT_BASE_URL, PUBLIC_API_KEY } from '$env/static/public';
import type { ArticleDetails } from '../../../interfaces/article-details';

async function fetchArticleDetails(fetch: any, articleUri: string): Promise<Response> {
    return fetch(`${PUBLIC_NYT_BASE_URL}/search/v2/articlesearch.json?fq=uri:("nyt://article/${articleUri}")&api-key=${PUBLIC_API_KEY}`);
}

function createArticleDetailsFromResponse(nytResponse: any): ArticleDetails {
    const article: ArticleDetails = {
        title: nytResponse.headline.main,
        content: nytResponse.lead_paragraph,
        author: nytResponse.byline.original,
        pubDate: nytResponse.pub_date.split('T')[0],
    }

    if (nytResponse.multimedia.length > 0) {
        article.image = `https://www.nytimes.com/${nytResponse.multimedia[0].url}`   
    }

    return article;
}

export const load = (async ({ fetch, params }) => {
    const articleUri = params.slug;
    if (articleUri.length > 0) {
        const articleSearchResult = await fetchArticleDetails(fetch, articleUri);
        const articleSearchJson = await articleSearchResult.json();
        if (articleSearchResult.status === 200) {
            return {
                articleDetails: createArticleDetailsFromResponse(articleSearchJson.response.docs[0])
            };
        }
    }

    throw error(404, 'Not found');
}) satisfies PageLoad;