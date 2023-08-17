<script lang="js" setup>
import AuthGuard from '../components/AuthGuard.vue'
import { ROLES } from '../../../server/main'

const requiredRole = ROLES.KEELA_ADMIN
</script>

<template>
    <AuthGuard :requiredRole="requiredRole">
        <h1>hello keela admin.</h1>
    </AuthGuard>
</template>