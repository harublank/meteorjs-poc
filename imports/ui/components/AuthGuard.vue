<script lang="js" setup>
import { Meteor } from 'meteor/meteor';
import { useRouter } from 'vue-router'

const props = defineProps(['requiredRole'])

const router = useRouter()

const user = Meteor.user()
const isNotLoggedIn = Boolean(user) === false

const loggedInUserRole = (user && user.profile.role) || ""
const dontHavePermission = props.requiredRole !== loggedInUserRole

if (isNotLoggedIn || dontHavePermission) {
    router.push("/")
}


</script>

<template>
    <slot></slot>
</template>