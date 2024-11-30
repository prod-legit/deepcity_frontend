<script lang="ts" setup>
const data = {};
</script>

<template>
    <div>
        <NuxtRouteAnnouncer />
        <Cesium :geojson="data" />
    </div>
</template>
