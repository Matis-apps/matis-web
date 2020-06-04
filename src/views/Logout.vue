<template>
  <div></div>
</template>

<script>
export default {
  name: 'Logout',
  created() {
    this.$store.dispatch('auth/logout')
      .then(() => {
        this.showLogout()
      })
      .catch(error => {
        this.$emit('error', error)
      })
      .finally(() => {
        this.$router.push({ path: '/' });
      })
  },
  methods: {
    showLogout() {
      let payload = {
        type: 'success',
        message: 'See you soon !',
        keepIt: true,
      }
      this.$store.dispatch('toast/show', payload);
    },
  }
}
</script>
