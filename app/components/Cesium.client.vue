<script lang="ts" setup>
import {
    // @ts-ignore
    VcConfigProvider,
    // @ts-ignore
    VcViewer,
    // @ts-ignore
    VcLayerImagery,
    // @ts-ignore
    VcImageryProviderOsm,
    // @ts-ignore
    VcGraphicsPolylineVolume,
    // @ts-ignore
    VcEntity,
    // @ts-ignore
    VcPrimitiveTileset,
    // @ts-ignore
    VcTerrainProviderCesium,
} from "vue-cesium";
import * as Cesium from "cesium";
import type { GJSON } from "~/types/gjson";

const props = defineProps<{
    geojson: GJSON;
}>();

const {
    public: { cesium_token },
} = useRuntimeConfig();

const config = reactive({
    global: {
        cesiumPath: "https://unpkg.com/cesium@latest/Build/Cesium/Cesium.js",
        accessToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhOWVkYmNmMS02MmY2LTQyNGUtYThmZC01MTdmNzI3ZTE4ZWUiLCJpZCI6MjU4Njg5LCJpYXQiOjE3MzMwNTY0OTZ9.UZ4COEgsEbHtDs4OT3XiNb6Mtg1rZfLAbgNOjqpp1K8",
    },
    viewer: {
        showCredit: false,
    },
});

const computeCache = ref<Record<number, { x: number; y: number }[]>>({});

const rendererMode = useCookie<number>("renderer_mode");

if (!rendererMode.value) {
    rendererMode.value = 0;
}

// Function to compute a circular shape
const computeCircle = (radius: number) => {
    if (computeCache.value[radius]) {
        return computeCache.value[radius];
    }
    const positions = [];
    for (let i = 0; i < 360; i += 10) {
        const radians = Cesium.Math.toRadians(i);
        positions.push({
            x: radius * Math.cos(radians),
            y: radius * Math.sin(radians),
        });
    }
    computeCache.value[radius] = positions;
    return positions;
};

const pipeShapes = ref<Record<string, { x: number; y: number }[]>>({});

watchEffect(() => {
    for (const index in props.geojson.features) {
        const feature = props.geojson.features[index];
        if (feature) {
            pipeShapes.value[index] = computeCircle(
                feature.properties.radius / 10
            );
        }
    }
});

const typeToColor = {
    hot: "red",
    cold: "blue",
    electicity: "yellow",
    drain: "gray",
    metro: "orange",
    gas: "green",
};

const onReady = (data: any) => {
    const { viewer } = data;
    // viewer.zoomTo(tileset);
};
</script>

<template>
    <div class="__cesium fixed inset-0">
        <VcConfigProvider v-bind="config.global">
            <VcViewer v-bind="config.viewer" @ready="onReady">
                <VcLayerImagery>
                    <VcImageryProviderOsm />
                    <VcTerrainProviderCesium />
                </VcLayerImagery>
                <VcPrimitiveTileset
                    v-if="rendererMode === 0"
                    :assetId="96188"
                />
                <VcPrimitiveTileset
                    v-else-if="rendererMode === 1"
                    :assetId="1415196"
                />
                <VcEntity
                    v-for="(feature, index) in geojson.features"
                    :name="`${
                        useCommunicationTypes()[feature.properties.typeofpipe]
                            .russian
                    } - ${feature.properties.depth} м - ${
                        feature.properties.material
                    }`"
                    :description="`<span style='color: black'>Дата последнего ремонта: ${new Date(
                        feature.properties.date_last_fix
                    ).toLocaleDateString(
                        'ru-RU'
                    )}, Дата следующего ремонта: ${new Date(
                        feature.properties.date_need_fix
                    ).toLocaleDateString('ru-RU')}, Статус: ${
                        feature.properties.status
                    }, Комментарий: ${feature.properties.comment}</span>`"
                >
                    <VcGraphicsPolylineVolume
                        :positions="
                            feature.geometry.coordinates.map(([lng, lat]) => {
                                return {
                                    lng,
                                    lat,
                                    height: feature.properties.depth * -2 + 12,
                                };
                            })
                        "
                        :shape="pipeShapes[index]"
                        :material="typeToColor[feature.properties.typeofpipe as keyof typeof typeToColor] ?? 'green'"
                        :cornerType="Cesium.CornerType.ROUNDED"
                    />
                </VcEntity>
            </VcViewer>
        </VcConfigProvider>
    </div>
</template>

<style lang="scss" scoped></style>
