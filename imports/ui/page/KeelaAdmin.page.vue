<script lang="js" setup>
import { onMounted, reactive, ref } from 'vue'
import { Tracker } from 'meteor/tracker'
import AuthGuard from '../components/AuthGuard.vue'
import ButtonGroup from '../components/ButtonGroup.vue'
import Button from '../components/ButtonVue.vue'
import Input from '../components/InputVue.vue'
import OrgList from '../components/OrgList.vue'

import { organizationCollection } from '../../api/organization'
import { contactsCollection } from '../../api/contacts'
import { useRouter } from 'vue-router'
import { Meteor } from 'meteor/meteor'
const requiredRole = "KEELA_ADMIN"

const router = useRouter()
const modal = ref(false)
const userModal = ref(false)

const userFormData = ref({
    name: "",
    email: "",
    role: "",
    organizationId: ""
})

const organizationFormData = ref({
    name: "",
    address: "",
    contact: ""
})

const mode = ref("CREATE")
const editId = ref("")
const organizationList = reactive({
    data: []
})

const toggleModel = () => {
    modal.value = !modal.value
}

const formSubmitHandler = () => {
    // edit mode or insert mode?

    if (mode.value === "CREATE") {
        organizationCollection.insert({
            ...organizationFormData.value,
            userId: Meteor.userId(),
            createdDate: new Date()
        }, (error, _id) => {
            console.log({ error, _id })
        })
    }

    if (mode.value === "EDIT") {
        const { } = organizationFormData.value
        organizationCollection.update({
            _id: editId.value
        }, {
            $set: {
                ...organizationFormData.value
            }
        }, (error, doc) => {
            console.log({ error, doc })
        })
    }


}

const inputChangeHandler = ({ name, value }) => {
    organizationFormData.value[name] = value
}

const userFormChangeHandler = ({ name, value }) => {
    userFormData.value[name] = value
}

onMounted(() => {
    const organizationsSubscription = Meteor.subscribe("organizationData")
    Meteor.subscribe("contactsCollection")

    Tracker.autorun(() => {
        const isNotReady = organizationsSubscription.ready() === false

        if (isNotReady) {
            //
        }

        const organizations = organizationCollection.find({}).fetch()

        organizationList.data = organizations
    })

})

const createOrgHandler = () => {
    mode.value = "CREATE"
    toggleModel()
    organizationFormData.value = {
        name: "",
        address: "",
        contact: ""
    }
}
const deleteHandler = (_id) => {
    organizationCollection.remove(_id)
}
const editHandler = (_id) => {
    const dataToEdit = organizationList.data.find(org => org._id === _id)
    mode.value = "EDIT"
    editId.value = _id

    const { name, address, contact } = dataToEdit;
    organizationFormData.value = {
        name, address, contact
    }

    toggleModel()
}
const viewOrgHandler = (_id) => {
    const url = "/keela-admin/org/" + _id
    router.push(url)

}

const toggleUserModel = () => {
    userModal.value = !userModal.value

}
const createUser = () => {
    toggleUserModel()
}

const updateOrgHandler = (orgId) => {
    userFormData.value.organizationId = orgId
}

const createUserHandler = () => {
    const { name, email, organizationId, role } = userFormData.value
    console.log({ name, email, organizationId, role })

    /* 
    - create user 
    - and contacts??
    - how will user login if there's no email in `user` schema
    - but having redundant data for user in two schema?

    user 
    |email| password | profile.role

    contact 
    |_id|user_id| org_id|...others

    */


    // const createdUser = Meteor.createUser({
    //     email: email,
    //     password: "keelapw",
    //     profile: {
    //         role: role
    //     }
    // })

    // console.log({ createdUser })

    Meteor.call("createContact", {
        email, role
    }, (err, userId) => {
        if (err) {
            console.log({ err })
        } else {
            const createdContact = contactsCollection.insert({
                name, organizationId, userId
            }, (error, doc) => {
                console.log({ error, doc })
            },)

            organizationCollection.update({
                _id: organizationId
            }, {
                $push: {
                    contacts: createdContact
                }
            })
        }
    })
}


</script>

<template class="h-screen">
    <AuthGuard :requiredRole="requiredRole">
        <div class="h-screen w-screen">
            <h1>hello keela admin.</h1>

            <ButtonGroup>
                <Button @click="createOrgHandler">
                    Create Organization
                </Button>

                <Button @click="createUser">
                    Create Contact
                </Button>
            </ButtonGroup>

            <div v-if="modal" class="h-full w-full flex justify-center items-start pt-4 backdrop-brightness-95">
                <div class="p-4 border-2 opacity-95 w-96">
                    <h2>Create a new organization</h2>
                    <form @submit.prevent="formSubmitHandler">
                        <Input label="Name" name="name" type="text" placeholder="keela ground"
                            :value="organizationFormData.name" @onChange="inputChangeHandler" />
                        <Input label="Adderss" name="address" type="text" placeholder="srilanka?"
                            :value="organizationFormData.address" @onChange="inputChangeHandler" />
                        <Input label="contact" name="contact" type="number" placeholder="999888"
                            :value="organizationFormData.contact" @onChange="inputChangeHandler" />

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

            <div v-if="userModal" class="h-full w-full flex justify-center items-start pt-4 backdrop-brightness-95">
                <div class="p-4 border-2 opacity-95 w-96">
                    <h2>Create a new user</h2>
                    <form @submit.prevent="createUserHandler">
                        <Input label="Name" name="name" type="text" placeholder="keela ground" :value="userFormData.name"
                            @onChange="userFormChangeHandler" />
                        <Input label="Email" name="email" type="email" placeholder="johndoe@gmail.com"
                            :value="userFormData.email" @onChange="userFormChangeHandler" />

                        <div>
                            <p>Select user role</p>
                            <select v-model="userFormData.role">
                                <option value="default">--- Select User Role ---</option>
                                <option value="ORGANIZATION_ADMIN">Admin</option>
                                <option value="COORDINATOR">Coordinator</option>
                            </select>
                        </div>

                        <OrgList @update:selected-org="updateOrgHandler" />

                        <ButtonGroup class="mt-4">
                            <Button type="submit">
                                Create a new user
                            </Button>

                            <Button @click="toggleModel" type="button">
                                Cancel
                            </Button>
                        </ButtonGroup>

                    </form>
                </div>
            </div>
            <div class="flex gap-4">
                <div class="relative overflow-x-auto">
                    <h1>Organization List</h1>
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
                            <tr v-for="org in organizationList.data"
                                class="bg-white border-b dark:bg-gray-900 dark:border-gray-700" :key="org._id">
                                <td class="px-6 py-4">
                                    {{ org.name }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ org.address }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ org.contact }}
                                </td>


                                <td class="px-6 py-4">
                                    <ButtonGroup>
                                        <Button @click="editHandler(org._id)">Edit</Button>
                                        <Button @click="deleteHandler(org._id)">Delete</Button>
                                        <Button @click="viewOrgHandler(org._id)">View</Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AuthGuard>
</template>