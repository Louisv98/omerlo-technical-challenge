import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    const articleUri = params.slug;
    if (articleUri.length > 0) {
        return {
            articleUri: articleUri
        };
    }

    throw error(404, 'Not found');
}) satisfies PageLoad;