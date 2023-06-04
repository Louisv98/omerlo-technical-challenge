<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<div class="flex justify-center m-4">
    <div class="shadow-xl rounded-md m-4">
        <p class="text-xs">{data.articleDetails.pubDate}</p>
        <p class="text-xs mb-4">{data.articleDetails.author}</p>
        <p class="font-bold">{data.articleDetails.title}</p>
        <p class="">{data.articleDetails.content}</p>
    </div>
</div>
