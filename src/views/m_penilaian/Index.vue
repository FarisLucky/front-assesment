<template>
    <div class="row position-relative">
        <div class="col-12">
            <List />
        </div>
    </div>
</template>
<script>
import List from './List.vue'
import Toast from '../../components/Toast.vue'
import Form from './Form.vue'
export default {
    components: { Form, Toast, List },
}
</script>
