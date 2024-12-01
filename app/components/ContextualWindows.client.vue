<script lang="ts" setup>
import type { Map } from "~/types/gjson";

const props = defineProps<{
    geojson: Map[];
}>();

const emit = defineEmits(["updatejson"]);

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
            jsonEditorOpen.value = false;
            emit("updatejson");
        }
    } catch {}
};

const creationQuery = ref("");

const options = computed(() => {
    return props.geojson.map((map) => ({
        label: map.name,
        value: map.id,
    }));
});
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
            <UButtonGroup class="absolute bottom-4 left-1/2 -translate-x-1/2">
                <UInputMenu
                    v-model="pickedMapID"
                    :options="options"
                    class="min-w-48"
                    v-model:query="creationQuery"
                    value-attribute="value"
                >
                    <template #option-empty="{ query }">
                        Создать карту <q>{{ query }}</q>
                    </template>
                </UInputMenu>
                <UButton label="Сохранить изменения" @click="editJSON" />
            </UButtonGroup>
        </USlideover>
    </div>
</template>

<style lang="scss" scoped></style>
