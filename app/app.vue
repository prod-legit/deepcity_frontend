<script lang="ts" setup>
const data = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: [
                    [-75.0, 40.0, -5],
                    [-75.0, 40.1, -5],
                    [-75.1, 40.1, -5],
                ],
            },
            properties: {
                typeofpipe: "hot",
                radius: 7,
                depth: 5,
                date_last_fix: "2024-01-02",
                date_need_fix: "2025-10-17",
                material: "Стальная",
                status: "Используется",
                comment: "я короч изолентой замотал, надеюсь не прорвет",
            },
        },
    ],
} as const;
</script>

<template>
    <div>
        <NuxtRouteAnnouncer />
        <Cesium :geojson="data" />
    </div>
</template>
