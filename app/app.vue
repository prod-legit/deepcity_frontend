<script lang="ts" setup>
const jsonEditorState = useState("json_editor_state", () => {
    return JSON.stringify(useDefaultGJ(), null, 2);
});
</script>

<template>
    <div>
        <NuxtRouteAnnouncer />
        <Cesium :geojson="JSON.parse(jsonEditorState)" />
        <Sidebar />
        <ContextualWindows />
    </div>
</template>
