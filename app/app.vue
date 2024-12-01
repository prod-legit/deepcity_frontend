<script lang="ts" setup>
import type { Map } from "./types/gjson";

const {
    public: { base_url },
} = useRuntimeConfig();

const workingCopy = useState("global_json", () => "");

const { data: geojson } = useFetch<Array<Map>>("/api/geo", {
    baseURL: base_url as string,
    server: false,
});

const pickedMapID = useState<string | undefined>(
    "picked_map_id",
    () => undefined
);

const pickedMap = computed(() =>
    geojson?.value?.find((map) => map.id === pickedMapID.value)
);

watch(geojson, () => {
    if (geojson.value && geojson.value[0] && !pickedMapID.value) {
        pickedMapID.value = geojson.value[0].id;
    }
});

watch(
    pickedMap,
    () => {
        workingCopy.value = JSON.stringify(pickedMap.value, null, 2);
    },
    { deep: true }
);
</script>

<template>
    <div>
        <NuxtRouteAnnouncer />
        <Cesium v-if="pickedMap" :geojson="pickedMap.geojson" />
        <Sidebar />
        <ContextualWindows />
    </div>
</template>
