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

const pendingUpload = ref(false);
const editJSON = async () => {
    try {
        if (JSON.parse(workingCopy.value)) {
            pendingUpload.value = true;
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
    pendingUpload.value = false;
};

const creationQuery = ref("");

const options = computed(() => {
    return props.geojson.map((map) => ({
        label: map.name,
        value: map.id,
    }));
});

const pendingCreate = ref(false);

const createNewMap = async () => {
    if (creationQuery.value !== "") {
        try {
            pendingCreate.value = true;
            const { id } = await $fetch(`/api/geo`, {
                baseURL: base_url as string,
                method: "POST",
                body: {
                    geojson: JSON.parse(workingCopy.value),
                    name: creationQuery.value,
                    type: "user_upload",
                },
            });
            pickedMapID.value = id;
            emit("updatejson");
        } catch {}
        pendingCreate.value = false;
    }
};

defineShortcuts({
    enter: {
        handler: createNewMap,
    },
});

//

const pendingDelete = ref(false);

const deleteJSON = async () => {
    try {
        pendingDelete.value = true;
        await $fetch(`/api/geo/${pickedMapID.value}`, {
            baseURL: base_url as string,
            method: "DELETE",
        });
        window.location.reload();
    } catch {}
    pendingDelete.value = false;
};

const colorMode = useColorMode();
</script>

<template>
    <div class="__contextual">
        <USlideover v-model="jsonEditorOpen">
            <MonacoEditor
                :style="{
                    opacity: creationQuery === '' ? 1 : 0.5,
                }"
                class="h-screen"
                lang="json"
                :options="{
                    theme: colorMode.value === 'dark' ? 'vs-dark' : 'vs-light',
                }"
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
                <UButton
                    v-if="creationQuery !== ''"
                    @click="createNewMap"
                    :disabled="pendingCreate"
                    color="green"
                >
                    <Icon name="mdi:plus" />
                </UButton>
                <UButton v-else @click="editJSON" :disabled="pendingUpload">
                    <Icon name="mi:save" />
                </UButton>
                <UButton
                    v-if="creationQuery === '' && options.length > 1"
                    @click="deleteJSON"
                    :disabled="pendingDelete"
                    color="red"
                >
                    <Icon name="mi:delete" />
                </UButton>
            </UButtonGroup>
        </USlideover>
    </div>
</template>

<style lang="scss" scoped></style>
