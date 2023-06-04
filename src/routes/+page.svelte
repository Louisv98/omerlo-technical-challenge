<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

</script>

{#each data.articles as article}
    <a href="article/{article.id}">
        <div id="{article.id}" class="article-container flex shadow-xl m-4 rounded-md">
            <div class="basis-1/3">
                {#if article.image}
                    <img class="article-image rounded" src="{article.image}" alt="Article"/>
                {:else}
                    <img class="article-image rounded" src="image-not-found.png" alt="Article"/>
                {/if}
            </div>
            <div class="flex flex-col p-4 basis-2/3">
                <p class="text-xs mb-4">{article.pubDate}</p>
                <p class="font-bold">{article.headline}</p>
                <p>{article.summary}</p>
            </div>
        </div>
    </a>
{/each}
