<script lang="ts" setup>
import { reactive } from 'vue';

const userCredendials = reactive({
    email: "",
    password: ""
})


const handleSubmit = () => {
    const { email, password } = userCredendials
    console.log({ email, password })
}

</script> 

<template>
    <form class="max-w-xs" @submit.prevent="handleSubmit">
        <div>
            <input class="w-full border mb-2 p-1" type="email" placeholder="johndoe@keela.com" required
                v-model="userCredendials.email">
        </div>

        <div>
            <input class="w-full border mb-2 p-1 " type="password" placeholder="fdfUIUI3#$#$#5" required
                v-model="userCredendials.password" />
        </div>

        <button class="bg-blue-700 text-white px-2 py-1 w-full" type="submit">
            login
        </button>
    </form>
</template>