<script setup>
import Button from '../components/ButtonVue.vue'
import ButtonGroup from '../components/ButtonGroup.vue'

defineEmits(["onDelete", "onEdit"])

const props = defineProps({
    title: {
        type: String,
        default: "Table for fodder ^_^",
    },
    headers: {
        type: Array,
        default: []
    },
    body: {
        type: Array,
        default: []
    },
})
</script>

<template>
    <div class="mt-4 overflow-x-auto">
        <h1>{{ title }}</h1>

        <table class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <th scope="col" class="px-6 py-3" v-for="tableHead in headers">
                    {{ tableHead }}
                </th>
            </thead>

            <tbody>
                <tr v-for="row in body" class="bg-white border-b dark:bg-gray-900 dark:border-gray-700" :key="row._id">
                    <td v-for="cell in row" class="px-6 py-4">
                        {{ cell }}
                    </td>

                    <td class="px-6 py-4">
                        <ButtonGroup>
                            <Button @click="$emit('onEdit', row)">Edit</Button>
                            <Button @click="$emit('onDelete', row)">Delete</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>