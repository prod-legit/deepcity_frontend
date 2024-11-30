<script lang="ts" setup>
import {
    VcConfigProvider,
    VcViewer,
    VcEntity,
    VcGraphicsPoint,
    VcLayerImagery,
    VcImageryProviderArcgis,
} from "vue-cesium";

const config = reactive({
    global: {
        cesiumPath: "https://unpkg.com/cesium@latest/Build/Cesium/Cesium.js",
        ruRU: useRUCesiumLocale(),
    },
});
</script>

<template>
    <div class="__cesium fixed inset-0">
        <VcConfigProvider v-bind="config.global">
            <VcViewer>
                <VcLayerImagery>
                    <VcImageryProviderArcgis />
                </VcLayerImagery>

                <VcEntity
                    :position="[139.762222, 35.713333]"
                    description="The University of Tokyo"
                >
                    <VcGraphicsPoint
                        ref="point1"
                        color="red"
                        :pixelSize="100"
                    ></VcGraphicsPoint>
                </VcEntity>
            </VcViewer>
        </VcConfigProvider>
    </div>
</template>

<style lang="scss" scoped></style>
