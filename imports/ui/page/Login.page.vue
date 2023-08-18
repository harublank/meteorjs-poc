<script lang="ts" setup>
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { reactive, ref, } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../components/ButtonVue.vue';
import SpinnerVue from '../components/SpinnerVue.vue';
import { ROLE_BASED_PAGE } from "../data"

const userCredendials = reactive({
    email: "",
    password: ""
})

const availableUsers = reactive({
    users: []
})
const errorMessage = ref("")

const router = useRouter()

const isLogginIn = Meteor.loggingIn()
const loggedInUser = Meteor.user()



const handleSubmit = () => {
    const { email, password } = userCredendials

    const loginResponse = Meteor.loginWithPassword({ email }, password, (e) => {
        if (e) {
            const { reason } = e
            errorMessage.value = reason
        } else {
            const loggedInUser = Meteor.user()
            if (loggedInUser === null) {
                alert("login first")
                return
            }
            const { profile: { role } } = loggedInUser
            const pageUrl = ROLE_BASED_PAGE[role]
            router.push(pageUrl)
        }


    })

}

const onShowAllAvailableUsers = () => {
    console.log("show available users")
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

        console.log({ users })
        availableUsers.users = users

    })
}
</script> 

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

                <li v-for="user in  availableUsers.users" :key="user.email">
                    {{ user.email }} - {{ user.role }}
                </li>
            </ul>

        </div>
    </div>
</template>