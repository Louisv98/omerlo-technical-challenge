<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<div class="flex justify-center m-4 page-container">
    <div class="shadow-xl rounded-md m-4 p-4 article-container">
        <p class="text-xs">{data.articleDetails.pubDate}</p>
        <p class="text-xs mb-4">{data.articleDetails.author}</p>
        <p class="font-bold">{data.articleDetails.title}</p>
        <p class="">{data.articleDetails.content}</p>

        <div class="flex justify-center mt-8 mb-4">
            <img id="article-details-image" class="rounded" src="{data.articleDetails.image}" alt="Article"/>
        </div>
    </div>
</div>

<style>
    #article-details-image {
        width: 50%;
    }
</style>
