<script lang="ts">
    import "../app.css";
    import type { LayoutData } from './$types';
    import { PUBLIC_API_KEY, PUBLIC_NYT_BASE_URL } from "$env/static/public";
	import type { Article } from "../interfaces/article";
    import { page } from '$app/stores';
	import { writable, type Writable } from "svelte/store";
	import { setContext } from "svelte";

    export let searchInputValue: string = '';
    export let data: LayoutData;
    
    const articles: Writable<Article[]> = writable();
    $: articles.set(data.articles);

    setContext('articles', articles);

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

    function updateArticles(articleSearchJson: any): void {
        $articles = [];
        const tempArticles: Article[] = [];
        if (articleSearchJson.response && articleSearchJson.response.docs.length > 0) {
            for (const articleSearchItem of articleSearchJson.response.docs) {
                tempArticles.push(createArticleFromResponse(articleSearchItem));
            }
            $articles = [...tempArticles];
        }
    }

    async function resetArticles(): Promise<void> {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const dateString = `${year}-${month}-${day}`;
        const articleSearchResult = await fetch(`${PUBLIC_NYT_BASE_URL}/search/v2/articlesearch.json?fq=pub_date:(${dateString})&api-key=${PUBLIC_API_KEY}`);
        const articleSearchJson = await articleSearchResult.json();
        updateArticles(articleSearchJson);
    }

    async function searchArticles(): Promise<void> {
        const articleSearchResult = await fetch(`${PUBLIC_NYT_BASE_URL}/search/v2/articlesearch.json?f=${searchInputValue}&api-key=${PUBLIC_API_KEY}`);
        const articleSearchJson = await articleSearchResult.json();
        updateArticles(articleSearchJson);
    }
</script>

<header class="app-header p-4 rounded flex" class:default-header-height="{$page.url.pathname.includes('article')}">
    {#if $page.url.pathname.includes('article')}
        <a class="mr-4" href="/">Back</a>
    {:else}
        <div>
            <input class="rounded mr-4 border-solid border-2 border-black" placeholder="Search article..." bind:value={searchInputValue} />
        </div>
        <div id="search-buttons-container" class="row">
            <button type="button" class="app-button rounded mr-1" on:click={searchArticles}>Search</button>
            <button type="button" class="app-button rounded" on:click={resetArticles}>Reset</button>
        </div>
    {/if}
</header>

<slot />

<footer class="app-footer relative block rounded">
    <p class="p-2">Louis Villeneuve, 2023</p>
</footer>

