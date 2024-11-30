<script lang="ts" setup>
const props = defineProps<{
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
    VcImageryProviderArcgis,
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

const pipeShapes = ref<Record<string, { x: number; y: number }[]>>({});

watchEffect(() => {
    for (const index in props.geojson.features) {
        const feature = props.geojson.features[index];
        if (feature) {
            pipeShapes.value[index] = computeCircle(
                feature.properties.meter_radius
            );
        }
    }
});
</script>

<template>
    <div class="__cesium fixed inset-0">
        <VcConfigProvider :global="config.global">
            <VcViewer v-bind="config.viewer">
                <VcLayerImagery>
                    <VcImageryProviderArcgis />
                </VcLayerImagery>
                <VcEntity v-for="(feature, index) in geojson.features">
                    <VcGraphicsPolylineVolume
                        :positions="
                            feature.geometry.coordinates.map(
                                ([lng, lat, height]) => {
                                    return { lng, lat, height };
                                }
                            )
                        "
                        :shape="pipeShapes[index]"
                        :material="feature.properties.color"
                        :cornerType="Cesium.CornerType.ROUNDED"
                    />
                </VcEntity>
            </VcViewer>
        </VcConfigProvider>
    </div>
</template>

<style lang="scss" scoped></style>
