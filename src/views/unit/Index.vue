<template>
    <div class="row position-relative">
        <div class="col">
            <Form />
        </div>
        <div class="col-md-12">
            <List />
        </div>
    </div>
    <Modal></Modal>
</template>
<script>
import Modal from './Modal.vue'
import List from './List.vue'
import Form from './Form.vue'

export default {
    components: {
        Form,
        List,
        Modal,
    },
}
</script>
