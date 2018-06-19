<template>
  <div class='hello'>
    <button @click="publishEvent">Publish Event</button>
    <input type="text" class="form-control" v-model="apiId"/>
    <ul id="example-1">
      <li v-for="message in messages" :key="message">
        {{ message }}
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
      messages: [],
      apiId: ''
    }
  },
  mounted () {
    if (!this.$route.params.sessionId) {
      this.$router.push({name: 'Login'})
      return
    }

    console.log(this.$route.params.sessionId)
    this.client = new window.Paho.MQTT.Client('localhost', 15675, '/ws', 'myclientid_' + this.$route.params.sessionId)

    // set callback handlers
    this.client.onConnectionLost = this.onConnectionLost
    this.client.onMessageArrived = this.onMessageArrived

    // connect the client
    this.client.connect({onSuccess: () => { this.onConnect() }})
  },
  methods: {
    // called when the client connects
    onConnect () {
      // Once a connection has been made, make a subscription and send a message.
      console.log('onConnect')
      this.client.subscribe(this.$route.params.sessionId)
    },

    // called when the client loses its connection
    onConnectionLost (responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log('onConnectionLost:' + responseObject.errorMessage)
        this.$router.push({name: 'Login'})
      }
    },

    // called when a message arrives
    onMessageArrived (message) {
      this.messages.push(JSON.parse(message.payloadString).businessData)
      console.log('onMessageArrived:' + message.payloadString)
    },

    publishEvent () {
      const message = new window.Paho.MQTT.Message(JSON.stringify({apiId: this.apiId, socketTimeout: 200}))
      message.topic = this.$route.params.sessionId + '_clientEvents'
      this.client.publish(message)
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
