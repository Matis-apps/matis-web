<template>
  <div></div>
</template>

<script>
export default {
  name: 'Logout',
  created() {
    this.$store.dispatch('auth/logout')
      .then(() => {
        console.log('Logout')
        this.showLogout()
        this.$router.push({ path: '/' });
      })
      .catch(error => {
        console.log(error)
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
