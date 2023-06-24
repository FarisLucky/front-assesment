<template>
  <div>
    <CAlert
      color="danger"
    >
		<slot></slot>
	</CAlert>
  </div>
</template>
<script>
export default {
	props: {
		errors: String
	}
}
</script>
