import type { Article } from '../interfaces/article';
import type { LayoutLoad } from './$types';

export const load = (async () => {
    const response: { articles: Article[] } = {
        articles: []
    };

    return response;
}) satisfies LayoutLoad;