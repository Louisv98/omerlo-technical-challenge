<script lang="ts">
	import type { Writable } from 'svelte/store';
    import type { PageData } from './$types';
	import type { Article } from '../../../interfaces/article';
	import { getContext } from 'svelte';

    export let data: PageData;

    const articles: Writable<Article[]> = getContext('articles');
    $: articles;

    const article = $articles.find(a => a.id === data.articleUri);
</script>

<div class="flex justify-center m-4 page-container">
    {#if article}
        <div class="shadow-xl rounded-md m-4 p-4 article-container">
            <p class="text-xs">{article.pubDate}</p>
            <p class="text-xs mb-4">{article.author}</p>
            <p class="font-bold">{article.headline}</p>
            <p class="">{article.content}</p>

            <div class="flex justify-center mt-8 mb-4">
                <img id="article-details-image" class="rounded" src="{article.image}" alt="Article"/>
            </div>
        </div>
    {:else}
        <p>The article you try to see does not exist!</p>
    {/if}
</div>

<style>
    #article-details-image {
        width: 50%;
    }
</style>
