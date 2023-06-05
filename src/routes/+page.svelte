<script lang="ts">
	import type { Writable } from 'svelte/store';
    import type { PageData } from './$types';
    import { getContext } from 'svelte';
	import type { Article } from '../interfaces/article';

    export let data: PageData;

    const articles: Writable<Article[]> = getContext('articles');
    $articles = [...data.articles];

</script>

<div class="page-container flex flex-col items-center">
    {#if $articles.length > 0}    
        {#each $articles as article}
            <a href="article/{article.id}">
                <div id="{article.id}" class="article-container flex shadow-xl m-4 rounded-md">
                    <div class="basis-1/3">
                        {#if article.image}
                            <img class="article-image rounded m-4" src="{article.image}" alt="Article"/>
                        {:else}
                            <img class="article-image rounded m-4" src="image-not-found.png" alt="Article"/>
                        {/if}
                    </div>
                    <div class="flex flex-col p-4 ml-4 basis-2/3">
                        <p class="text-xs mb-4">{article.pubDate}</p>
                        <p class="font-bold">{article.headline}</p>
                        <p>{article.summary}</p>
                    </div>
                </div>
            </a>
        {/each}
    {:else}
        <p>No articles to show at the moment...</p>
    {/if}
</div>
