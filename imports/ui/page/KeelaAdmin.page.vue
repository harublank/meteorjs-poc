<script lang="js" setup>
import AuthGuard from '../components/AuthGuard.vue'
import Button from '../components/ButtonVue.vue'
import { reactive, ref } from 'vue'
import Input from '../components/InputVue.vue'
import ButtonGroup from '../components/ButtonGroup.vue'
const requiredRole = "KEELA_ADMIN"

const modal = ref(false)

const organizationFormData = ref({
    name: "",
    address: "",
    contact: ""
})


const toggleModel = () => {
    modal.value = !modal.value
}

const formSubmitHandler = () => {
    console.log("create or edit org")
}

const inputChangeHandler = ({ name, value }) => {
    console.log({ name, value })

    organizationFormData.value[name] = value
}
</script>

<template class="h-screen">
    <AuthGuard :requiredRole="requiredRole">
        <div class="h-screen w-screen">
            <h1>hello keela admin.</h1>

            <Button @click="toggleModel">
                Create Organization
            </Button>

            <div v-if="modal" class="h-full w-full flex justify-center items-start pt-4 backdrop-brightness-95">
                <div class="p-4 border-2 opacity-95 w-96">
                    <h2>Create a new organization</h2>
                    <form @submit.prevent="formSubmitHandler">
                        <Input label="Name" name="name" type="text" placeholder="keela ground"
                            :value="organizationFormData.name" @onChange="inputChangeHandler" />
                        <Input label="Adderss" name="address" type="text" placeholder="srilanka?"
                            :value="organizationFormData.address" @onChange="inputChangeHandler" />
                        <Input label="contact" name="contact" type="number" placeholder="999888"
                            :value="organizationFormData.number" @onChange="inputChangeHandler" />

                        <ButtonGroup class="mt-4">
                            <Button type="submit">
                                Create a new Organization
                            </Button>

                            <Button @click="toggleModel" type="button">
                                Cancel
                            </Button>
                        </ButtonGroup>

                    </form>
                </div>
            </div>

            <div class="relative overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <th scope="col" class="px-6 py-3">
                            Name
                        </th>

                        <th scope="col" class="px-6 py-3">
                            Address
                        </th>

                        <th scope="col" class="px-6 py-3">
                            Contact Number
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Actions
                        </th>
                    </thead>

                    <tbody>
                        <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                            <td class="px-6 py-4">
                                Azure Phoenix
                            </td>
                            <td class="px-6 py-4">
                                Neverland
                            </td>
                            <td class="px-6 py-4">
                                8888-9999
                            </td>
                            <td class="px-6 py-4">
                                <ButtonGroup>
                                    <Button>Edit</Button>
                                    <Button>Delete</Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </AuthGuard>
</template>