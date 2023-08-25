<script setup>
import { Meteor } from 'meteor/meteor'
import { organizationCollection } from '../../api/organization';
import { onMounted, ref, watchEffect } from 'vue';
import { contactsCollection } from '../../api/contacts';
import { Tracker } from 'meteor/tracker';
import Input from '../components/InputVue.vue'

import Table from '../components/TableVue.vue'
import Button from '../components/ButtonVue.vue';
import ButtonGroup from '../components/ButtonGroup.vue'

const userFormData = ref({
    name: "",
    email: "",
    role: "",
})


const userId = Meteor.userId()

const myOrgRef = ref({
    name: "",
    address: "",
    contacts: [],
    orgId: ""
})

const contactList = ref([])

const createUserHandler = () => {
    const { name, email, role } = userFormData.value
    const organizationId = myOrgRef.value.orgId

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

const userFormChangeHandler = ({ name, value }) => {
    userFormData.value[name] = value
}


const onDeleteHandler = (row) => {
    const lastIndex = row.length - 1
    const userId = row[lastIndex]
    const orgId = myOrgRef.value.orgId

    const org = organizationCollection.findOne({ _id: orgId })
    const orgContacts = org.contacts

    const contactToDelete = contactsCollection.findOne({ userId })
    const contactId = contactToDelete._id

    const newOrgContacts = orgContacts.filter(contact => contact !== contactId)

    organizationCollection.update({ _id: orgId }, {
        $set: {
            contacts: newOrgContacts
        }
    })

}

const onEditHandler = (row) => {
    const userId = row[row.length - 1]
    console.log({ userId })
}

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
                        role,
                        userId
                    }
                }
            }).fetch()

            console.log({ org })
            const { name, address, _id: orgId } = org

            const normalizedContacts = contacts.map(contact => {
                const { email, name, role, userId, orgId } = contact;
                return [name, email, role, userId]
            })

            myOrgRef.value = {
                name, address, contacts: normalizedContacts, orgId
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

    <form @submit.prevent="createUserHandler">
        <Input label="Name" name="name" type="text" placeholder="keela ground" :value="userFormData.name"
            @onChange="userFormChangeHandler" />
        <Input label="Email" name="email" type="email" placeholder="johndoe@gmail.com" :value="userFormData.email"
            @onChange="userFormChangeHandler" />

        <div>
            <p>Select user role</p>
            <select v-model="userFormData.role">
                <option value="default">--- Select User Role ---</option>
                <option value="ORGANIZATION_ADMIN">Admin</option>
                <option value="COORDINATOR">Coordinator</option>
            </select>
        </div>

        <ButtonGroup class="mt-4">
            <Button type="submit">
                Create a new user
            </Button>


        </ButtonGroup>

    </form>

    <Table @onDelete="onDeleteHandler" @onEdit="onEditHandler" :headers="['Contact Name', 'email', 'Role', 'userId']"
        title="My org contacts" :body="myOrgRef.contacts">

    </Table>
</template>