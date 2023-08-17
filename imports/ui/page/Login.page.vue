<script lang="ts" setup>
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { reactive, ref } from 'vue';
import Button from '../components/ButtonVue.vue';
import SpinnerVue from '../components/SpinnerVue.vue';

const userCredendials = reactive({
    email: "",
    password: ""
})

const availableUsers = reactive({
    users: []
})
const errorMessage = ref("")

const isLogginIn = Meteor.loggingIn()
const loggedInUser = Meteor.user()

const handleSubmit = () => {
    const { email, password } = userCredendials

    const loginResponse = Meteor.loginWithPassword({ email }, password, (e) => {
        if (e) {
            const { error, reason } = e
            errorMessage.value = reason
        }
    })
    const loggedInUser = Meteor.user()
    console.log({ loggedInUser, loginResponse })
}

const onShowAllAvailableUsers = () => {
    // const availableUsers = 

    const availableUsersSubscription = Meteor.subscribe("availableUsers")
    Tracker.autorun(() => {
        const isNotReady = availableUsersSubscription.ready() === false

        if (isNotReady) {
            //
        }

        const users = Meteor.users.find({}, {
            transform: function (doc) {
                const { emails, profile: { role }, _id } = doc
                return {
                    _id,
                    email: emails[0].address,
                    role

                }
            }
        }).fetch()

        availableUsers.users = users

    })
}
</script> 
z
<template>
    <div class="flex gap-8">
        <div>
            <h1>{{ loggedInUser && `${loggedInUser?.emails?.[0].address} is logged in. ` || ` noone is
                logged in` }}
            </h1>
            <SpinnerVue v-if="isLogginIn"></SpinnerVue>

            <h1>Logging request Status: {{ isLogginIn ? "Logging User" : "Not Logging User" }}
            </h1>
            <form class="max-w-xs" @submit.prevent="handleSubmit">
                <div>
                    <input class="w-full border mb-2 p-1" type="email" placeholder="johndoe@keela.com" required
                        v-model="userCredendials.email">
                </div>

                <div>
                    <input class="w-full border mb-2 p-1 " type="text" placeholder="fdfUIUI3#$#$#5" required
                        v-model="userCredendials.password" />
                </div>

                <p class="text-red-700">
                    {{ errorMessage }}
                </p>
                <Button class="w-full" type="submit">
                    login
                </Button>
            </form>
        </div>

        <div>
            <h3>Helpers</h3>
            <Button class="mr-4" @click="Meteor.logout()">
                Logout
            </Button>
            <Button @click="onShowAllAvailableUsers">
                SHow all available users
            </Button>

            <ul v-if="availableUsers.users.length > 0">
                <li>password is "keelapw"</li>

                <li v-for="user in  availableUsers.users" v-key="user._id">
                    {{ user.email }} - {{ user.role }}
                </li>
            </ul>

        </div>
    </div>
</template>