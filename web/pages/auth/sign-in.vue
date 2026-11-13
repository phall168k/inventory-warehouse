<script setup lang="ts">
import type { FormInstance } from 'element-plus';

    definePageMeta({
        layout: 'blank',
    });

    const {
        signIn,  
    } = useAuth();

    const formData = ref<ISignIn>({
        username: '',
        password: '',
    });

    const isFormInvalid = computed(() => {
        return (
            !formData.value.username.trim() ||
            !formData.value.password.trim() 
        );
    })

    const formRef = ref<FormInstance>();

    const loading = ref<boolean>(false);

    const handleSignIn = async() => {
        loading.value = true;
        try {
           await signIn(formData.value);
            useNotification('Sign in to system successfully');
           await navigateTo('/', {
            replace: true,
           });
        } catch (error: any) {
            useNotification(error?.message, 'error');
        } finally {
            loading.value = false;
        }
    }

    const handleSubmit = async () => {
        if (!formRef) return;

        const valid = await formRef.value?.validate();

        if (valid) {
            await handleSignIn();
        }
    }

</script>

<template>
    <div class="h-screen w-full flex items-center justify-center">
        <el-form
            label-position="top"
            class="w-[95%] md:w-[25%] border shadow-sm p-4 rounded-md flex items-center justify-center flex-col"
            ref="formRef"
            :model="formData"
            @submit.prevent="handleSubmit"
        >
            <el-form-item>
                <el-image 
                    src="/logo/inventory.png"
                    class="h-[100px]" 
                />
            </el-form-item>
            <el-form-item>
                <el-text>Sign In To System</el-text>
            </el-form-item>
            <el-form-item
                label="Username"
                class="w-full"
                prop="username"
                :rules="[
                    {
                        required: true,
                        message: 'Username is required',
                    }
                ]"
            >
                <el-input
                    v-model="formData.username"
                    placeholder="Username"
                    clearable
                >
                    <template #prefix>
                        <Icon name="boxicons:user-id-card"/>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item
                label="Password"
                class="w-full"
                prop="password"
                :rules="[{ required: true }]"
            >
                <el-input
                    v-model="formData.password"
                    placeholder="*****"
                    show-password
                    clearable
                >
                    <template #prefix>
                        <Icon name="bi:lock"/>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item
                class="w-full"
            >
                <el-button 
                    type="success" 
                    native-type="submit"
                    class="w-full"
                    :disabled="isFormInvalid || loading"
                >
                    <Icon 
                        v-if="loading"
                        name="eos-icons:bubble-loading"
                    />
                    <span v-else>Sign In</span>
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>