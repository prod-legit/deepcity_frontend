<script lang="ts" setup>
const jsonEditorOpen = useState("json_editor_open", () => false);

const pickedMapID = useState<string | undefined>(
    "picked_map_id",
    () => undefined
);

const workingCopy = useState("global_json", () => "");

const {
    public: { base_url },
} = useRuntimeConfig();

const editJSON = async () => {
    try {
        if (JSON.parse(workingCopy.value)) {
            await $fetch(`/api/geo/${pickedMapID.value}`, {
                baseURL: base_url as string,
                method: "PATCH",
                body: {
                    geojson: JSON.parse(workingCopy.value),
                },
            });
        }
    } catch {}
};
</script>

<template>
    <div class="__contextual">
        <USlideover v-model="jsonEditorOpen">
            <MonacoEditor
                class="h-screen"
                lang="json"
                :options="{ theme: 'vs-dark' }"
                v-model="workingCopy"
            />
            <UButton
                class="absolute bottom-4 left-1/2 -translate-x-1/2"
                label="Загрузить"
                @click="editJSON"
            />
        </USlideover>
    </div>
</template>

<style lang="scss" scoped></style>
