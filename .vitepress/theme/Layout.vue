<script setup>
import DefaultTheme from "vitepress/theme";
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-image>
      <div class='videoWrapper'>
        <iframe width="1280" height="720" src="https://www.youtube.com/embed/OYTWZ39Iwm0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>

<style scoped>
.videoWrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
.videoWrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
/*
.video {
  position: absolute;
  top: 50%;
  left: 50%;
  max-height: 192px;
  transform: translate(-50%, -50%);
}
@media (min-width: 640px) {
  .videoWrapper {
    max-height: unset;
  }
}
*/
</style>
