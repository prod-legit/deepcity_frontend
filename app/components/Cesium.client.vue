<script lang="ts" setup>
defineProps<{
    geojson: {
        type: "FeatureCollection";
        readonly features: ReadonlyArray<{
            type: "Feature";
            geometry: {
                type:
                    | "LineString"
                    | "Point"
                    | "Polygon"
                    | "MultiLineString"
                    | "MultiPoint"
                    | "MultiPolygon";
                coordinates: ReadonlyArray<
                    | number
                    | readonly [number, number]
                    | readonly [number, number, number]
                >;
            };
            properties: Record<string, any>;
        }>;
    };
}>();

import {
    // @ts-ignore
    VcConfigProvider,
    // @ts-ignore
    VcViewer,
    // @ts-ignore
    VcLayerImagery,
    // @ts-ignore
    VcImageryProviderBing,
    // @ts-ignore
    VcGraphicsPolylineVolume,
    // @ts-ignore
    VcEntity,
} from "vue-cesium";
import * as Cesium from "cesium";

const config = reactive({
    global: {
        cesiumPath: "https://unpkg.com/cesium@latest/Build/Cesium/Cesium.js",
    },
    viewer: {
        showCredit: false,
    },
});

// Function to compute a circular shape
const computeCircle = (radius: number) => {
    const positions = [];
    for (let i = 0; i < 360; i += 10) {
        const radians = Cesium.Math.toRadians(i);
        positions.push({
            x: radius * Math.cos(radians),
            y: radius * Math.sin(radians),
        });
    }
    return positions;
};

// Compute the shape with a specified radius
const shape = computeCircle(60000); // 60 km radius
</script>

<template>
    <div class="__cesium fixed inset-0">
        <VcConfigProvider :global="config.global">
            <VcViewer v-bind="config.viewer">
                <VcLayerImagery>
                    <VcImageryProviderBing url="https://dev.virtualearth.net" />
                </VcLayerImagery>
                <VcEntity>
                    <VcGraphicsPolylineVolume
                        :positions="[
                            { lng: -95.0, lat: 32.0, height: 0.0 },
                            { lng: -95.0, lat: 36.0, height: 100000.0 },
                            { lng: -99.0, lat: 36.0, height: 200000.0 },
                        ]"
                        :shape="shape"
                        material="blue"
                        :cornerType="Cesium.CornerType.ROUNDED"
                    />
                </VcEntity>
            </VcViewer>
        </VcConfigProvider>
    </div>
</template>

<style lang="scss" scoped></style>
