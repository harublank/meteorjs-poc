<script setup>
import { useRoute } from 'vue-router';
import { organizationCollection } from '../../api/organization'
import { contactsCollection } from '../../api/contacts'
import { onMounted, ref } from 'vue';
import { Tracker } from 'meteor/tracker';

const route = useRoute()
const { id } = route.params

const organizationRef = ref({
    name: '',
    address: "",
    contact: '',
    contacts: []
})

onMounted(() => {
    const organizationsSubscription = Meteor.subscribe("organizationData")
    Meteor.subscribe("contactsCollection")

    Tracker.autorun(() => {
        const isNotReady = organizationsSubscription.ready() === false

        if (isNotReady) {
            //
        }

        const foundOrg = organizationCollection.findOne({
            _id: id
        }, {
            transform: function (org) {
                const { contacts, ...rest } = org

                const mappedContacts = contacts?.map(contact => {
                    const foundContact = contactsCollection.findOne(contact)
                    console.log(foundContact)

                    const foundUser = Meteor.users.findOne({
                        _id: foundContact.userId
                    })
                    console.log({ foundUser })
                    return { ...foundContact, ...foundUser }
                })

                return {
                    contacts: mappedContacts,
                    ...rest
                }
            }
        })


        if (foundOrg) {
            const { name, address, contact, contacts } = foundOrg

            organizationRef.value = {
                name, address, contact, contacts
            }
        }

    })
})
</script>

<template>
    <h2>Organization: {{ organizationRef.name }}</h2>

    <p>list of user in this org :)</p>

    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <th scope="col" class="px-6 py-3">Name</th>
            <th scope="col" class="px-6 py-3">Role</th>
            <th scope="col" class="px-6 py-3">email</th>
        </thead>

        <tbody>
            <tr v-for="contact in organizationRef.contacts" :key="contact._id">
                <td>
                    {{ contact.name }}
                </td>

                <td>
                    {{ contact.role }}
                </td>

                <td>
                    {{ contact.email }}
                </td>
            </tr>
        </tbody>
    </table>
</template>