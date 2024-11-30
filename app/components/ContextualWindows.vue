<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";
const jsonEditorOpen = useState("json_editor_open", () => false);

const jsonEditorState = useState("json_editor_state", () => {
    return JSON.stringify(useDefaultGJ(), null, 2);
});

const savedState = useLocalStorage<string | undefined>(
    "saved_gj",
    () => undefined
);

watchEffect(() => {
    try {
        JSON.parse(jsonEditorState.value);
        savedState.value = jsonEditorState.value;
    } catch {}
});
</script>

<template>
    <div class="__contextual">
        <USlideover v-model="jsonEditorOpen">
            <MonacoEditor
                class="h-screen"
                lang="json"
                :options="{ theme: 'vs-dark' }"
                v-model="jsonEditorState"
            />
        </USlideover>
    </div>
</template>

<style lang="scss" scoped></style>
