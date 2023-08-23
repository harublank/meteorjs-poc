<script setup>
import { Meteor } from 'meteor/meteor'
import { organizationCollection } from '../../api/organization';
import { onMounted, ref, watchEffect } from 'vue';
import { contactsCollection } from '../../api/contacts';
import { Tracker } from 'meteor/tracker';
import Table from '../components/TableVue.vue'
const userId = Meteor.userId()

const myOrgRef = ref({
    name: "",
    address: "",
    contacts: []
})

const contactList = ref([])


onMounted(() => {
    // Meteor.subscribe("contactsCollection")
    // Meteor.subscribe("organizationData")
    const myOrgSub = Meteor.subscribe('myOrg', userId)

    Tracker.autorun(() => {
        if (myOrgSub.ready()) {

            const org = organizationCollection.findOne()
            const contacts = contactsCollection.find({}, {
                transform: function (contact) {
                    const { name, _id, userId } = contact
                    const user = Meteor.users.findOne(userId)
                    console.log({ user })
                    const { emails, profile: { role } } = user
                    return {
                        _id,
                        name,
                        email: emails[0].address,
                        role
                    }
                }
            }).fetch()
            console.log({ org, contacts })

            const { name, address } = org

            const normalizedContacts = contacts.map(contact => {
                const { email, name, role } = contact;
                return [name, email, role]
            })

            myOrgRef.value = {
                name, address, contacts: normalizedContacts
            }

        }
    })


})
</script>

<template>
    <h1>Organization Admin Page :)</h1>
    <p>My Organization: {{ myOrgRef.name }}</p>
    <p>Address: {{ myOrgRef.address }}</p>
    <p>Number of Contacts: {{ myOrgRef?.contacts?.length || 0 }}</p>

    <Table :headers="['Contact Name', 'email', 'Role']" title="My org contacts" :body="myOrgRef.contacts">

    </Table>
</template>