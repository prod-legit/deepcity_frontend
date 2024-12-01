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
                icon="i-mdi-search"
                placeholder="Поиск..."
                size="lg"
                autofocus
            />
            <UButton
                v-else
                icon="i-mdi-search"
                size="xl"
                variant="link"
                @click="handleSearchClick"
            />
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
            <UButton size="xl" variant="link" @click="handleColorModeToggle">
                <UIcon
                    class="hidden dark:block text-xl"
                    name="i-material-symbols-dark-mode"
                />
                <UIcon
                    class="dark:hidden text-xl"
                    name="i-material-symbols-light-mode"
                />
            </UButton>
            <p>Тема</p>
        </div>
        <hr class="border-t-zinc-500 dark:border-t-zinc-700" />
        <p v-if="state.open">Фильтры</p>
        <div
            class="flex gap-2"
            :style="{ 'flex-direction': state.open ? 'row' : 'column' }"
        ></div>
    </div>
</template>

<style lang="scss" scoped></style>
