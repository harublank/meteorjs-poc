<script setup>
import { onMounted, reactive, watchEffect, ref } from 'vue';
import { organizationCollection } from '../../api/organization';

const emit = defineEmits(["update:selectedOrg"])
const options = reactive({
    data: [],
})

const selectedValue = ref("default")
onMounted(() => {
    const organizations = organizationCollection.find({}, {
        transform: function (doc) {
            const { _id, name } = doc

            return {
                _id, name
            }
        }
    }).fetch()
    options.data = organizations
})

watchEffect(() => {
    const value = selectedValue.value
    console.log("vaue of org", value)
    emit("update:selectedOrg", value)

})
</script>

<template>
    <p>Select the organization you want user to be part of :)</p>
    <select v-model="selectedValue">
        <option v-for="option in options.data" :key="option._id" :value="option._id">
            {{ option.name }}
        </option>
    </select>
</template>