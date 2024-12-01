<script lang="ts" setup>
import {
    // @ts-ignore
    VcConfigProvider,
    // @ts-ignore
    VcViewer,
    // @ts-ignore
    VcLayerImagery,
    // @ts-ignore
    VcImageryProviderArcgis,
    // @ts-ignore
    VcGraphicsPolylineVolume,
    // @ts-ignore
    VcEntity,
    // @ts-ignore
    VcPrimitiveTileset,
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
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4MGU0NThjNS01ZWU0LTQ0YTctYmU0NC04ZjlmNWQyNDg1NWYiLCJpZCI6MjU4Njg5LCJpYXQiOjE3MzMwNTUyMjF9.mACSh2TXh3gkzbVqsXXid3z4_5jNAvKrgO_rvLBgDt4",
    },
    viewer: {
        showCredit: false,
    },
});

const computeCache = ref<Record<number, { x: number; y: number }[]>>({});

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
};

const onReady = (data: any) => {
    const { cesiumObject: tileset, viewer } = data;
    const cartographic = Cesium.Cartographic.fromCartesian(
        tileset.boundingSphere.center
    );
    const surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        cartographic.height
    );
    const offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        0
    );
    const translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
    );
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    viewer.zoomTo(tileset);
};
</script>

<template>
    <div class="__cesium fixed inset-0">
        <VcConfigProvider v-bind="config.global">
            <VcViewer v-bind="config.viewer">
                <VcLayerImagery>
                    <!-- <VcImageryProviderArcgis /> -->
                </VcLayerImagery>
                <VcPrimitiveTileset assetId="1415196" @ready="onReady" />
                <VcEntity v-for="(feature, index) in geojson.features">
                    <VcGraphicsPolylineVolume
                        :positions="
                            feature.geometry.coordinates.map(([lng, lat]) => {
                                return {
                                    lng,
                                    lat,
                                    height: feature.properties.depth * -2,
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
