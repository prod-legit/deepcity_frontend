<script lang="ts" setup>
const state = reactive({
    open: false,
    query: "",
});
const jsonEditorOpen = useState("json_editor_open", () => false);

const handleSearchClick = (event: MouseEvent) => {
    event.stopPropagation();
    state.open = true;
};

const handleJsonEditorClick = () => {
    jsonEditorOpen.value = true;
};

const colorMode = useColorMode();
const handleColorModeToggle = () => {
    if (colorMode.preference === "dark") {
        colorMode.preference = "light";
    } else {
        colorMode.preference = "dark";
    }
};

const handleClickOutside = (event: MouseEvent) => {
    const sidebar = document.querySelector(".__sidebar");
    if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        state.query === ""
    ) {
        state.open = false;
    }
};

const filters = [];

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});

const rendererMode = useCookie<number>("renderer_mode");

const modes = ["heroicons:square-3-stack-3d", "heroicons:photo-16-solid"];
const handleChangeRendererMode = () => {
    rendererMode.value = (rendererMode.value + 1) % modes.length;
    window.location.reload();
};
</script>

<template>
    <div
        class="__sidebar absolute left-8 top-8 bottom-8 z-10 flex flex-col gap-2 py-[20px] px-[13px] bg-zinc-100 dark:bg-zinc-900 ring-zinc-300 dark:ring-zinc-700 ring-1 rounded-3xl transition-all"
        :style="{
            width: state.open ? 'auto' : '72px',
            'interpolate-size': 'allow-keywords',
        }"
    >
        <div class="flex items-center gap-2">
            <UInput
                v-if="state.open"
                color="blue"
                v-model="state.query"
                placeholder="Поиск..."
                size="lg"
                autofocus
            >
                <template #leading>
                    <Icon name="mdi:search" class="text-xl text-primary-400" />
                </template>
            </UInput>
            <UButton v-else size="xl" variant="link" @click="handleSearchClick">
                <Icon name="mdi:search" class="text-xl" />
            </UButton>
        </div>
        <div class="flex items-center gap-2 overflow-hidden">
            <UButton
                icon="i-si-json-fill"
                size="xl"
                variant="link"
                @click="handleJsonEditorClick"
            />
            <p>GeoJSON</p>
        </div>
        <div class="flex items-center gap-2 overflow-hidden">
            <UButton size="xl" variant="link" @click="handleChangeRendererMode">
                <Icon :name="modes[rendererMode] as string" class="text-xl" />
            </UButton>
            <p>Режим</p>
        </div>
        <div class="flex items-center gap-2 overflow-hidden">
            <UButton size="xl" variant="link" @click="handleColorModeToggle">
                <Icon
                    class="hidden dark:block text-xl"
                    name="i-material-symbols-dark-mode-rounded"
                />
                <Icon
                    class="dark:hidden text-xl"
                    name="i-material-symbols-clear-day-rounded"
                />
            </UButton>
            <p>Тема</p>
        </div>
        <hr class="border-t-zinc-200 dark:border-t-zinc-700" />
        <p v-if="state.open">Фильтры</p>
        <div
            class="flex gap-2"
            :style="{ 'flex-direction': state.open ? 'row' : 'column' }"
        ></div>
    </div>
</template>

<style lang="scss" scoped></style>
