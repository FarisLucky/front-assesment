<template>
    <div class="row position-relative">
        <div class="col-md-9">
            <List />
        </div>
        <div class="col-md-3">
            <Form></Form>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <TipePenilaian />
        </div>
    </div>
    <Modal></Modal>
</template>
<script>
import List from './List.vue'
import Toast from '../../components/Toast.vue'
import Form from './Form.vue'
import Modal from './Modal.vue'
import TipePenilaian from './TipePenilaian.vue'
export default {
    components: { Form, Toast, Modal, List, TipePenilaian },
}
</script>
