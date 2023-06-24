<template>
    <div class="row position-relative">
        <div class="col-12">
            <Form></Form>
        </div>
        <div class="col-12">
            <List />
        </div>
    </div>
    <Modal></Modal>
</template>
<script>
import List from './List.vue'
import Toast from '../../components/Toast.vue'
import Form from './Form.vue'
import Modal from './Modal.vue'
export default {
    components: { Form, Toast, Modal, List },
}
</script>
