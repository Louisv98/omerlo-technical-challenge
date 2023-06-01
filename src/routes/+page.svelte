<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

{#each data.articles as article }
    <div>{article.headline}</div>
{/each}
