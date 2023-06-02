<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<!-- Articles section -->
<!-- <ul>
    {#each data.articles as article}
        <li>{article.headline}</li>
    {/each}
</ul> -->

{#each data.articles as article}
    <div class="flex shadow-xl m-4 rounded-md">
        <div class="basis-1/3">
            {#if article.image}
                <img class="article-image rounded" src="{article.image}" alt="Article"/>
            {:else}
                <img class="article-image rounded" src="image-not-found.png" alt="Article"/>
            {/if}
        </div>
        <div class="bg-[url('{article.image}')]"></div>
        <div class="flex flex-col p-4 basis-2/3">
            <p class="text-xs mb-4">{article.pubDate}</p>
            <p class="font-bold">{article.headline}</p>
            <p>{article.summary}</p>
        </div>
    </div>
{/each}
