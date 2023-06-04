import { error } from '@sveltejs/kit';
import axios, { type AxiosResponse } from 'axios';
import type { PageServerLoad } from './$types';
import { NYT_BASE_URL, SECRET_API_KEY } from '$env/static/private';
import type { ArticleDetails } from '../../../interfaces/article-details';

async function fetchArticleDetails(articleUri: string): Promise<AxiosResponse> {
    return await axios.get(`${NYT_BASE_URL}/search/v2/articlesearch.json?fq=uri:("nyt://article/${articleUri}")&api-key=${SECRET_API_KEY}`);
}

function createArticleDetailsFromResponse(nytResponse: any): ArticleDetails {
    const article: ArticleDetails = {
        title: nytResponse.headline.main,
        content: nytResponse.lead_paragraph,
        author: nytResponse.byline.original,
        pubDate: nytResponse.pub_date.split('T')[0],
        images: []
    }

    if (nytResponse.multimedia.length > 0) {
        for (const multimediaElement of nytResponse.multimedia) {
            article.images.push(`https://www.nytimes.com/${multimediaElement.url}`)
        }
    }

    return article;
}

export const load = (async ({ params }) => {
    const articleUri = params.slug;
    if (articleUri) {
        const articleSearchResult = await fetchArticleDetails(articleUri);
        if (articleSearchResult.data.status == 'OK') {
            return {
                articleDetails: createArticleDetailsFromResponse(articleSearchResult.data.response.docs[0])
            };
        }
    }

    throw error(404, 'Not found');
}) satisfies PageServerLoad;