<script setup lang="js">
const props = defineProps(["label", "name", "placeholder", "type", "value"])
defineEmits(['onChange'])

console.log({ value: props.value }, 'form props')
</script>


<template>
    <div>
        <label :for="name" class="block mb-2 text-sm font-medium text-gray-900 ">{{ label }}</label>

        <input :type="type" :id="name" :placeholder="placeholder" required :value="value"
            @input="$emit('onChange', { name, value: $event.target.value })" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
        block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
        dark:focus:ring-blue-500 dark:focus:border-blue-500">

    </div>
</template>