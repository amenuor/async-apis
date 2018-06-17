<template>
  <div>
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet">

    <div class="container" id='app'>
      <div class="note note--down"><p>{{ note }}</p></div>
      <div class="login">
        <header class="login--header">
          <span>Log In</span>
        </header>
        <section class="login--section">
          <form class='login--form' @submit.prevent='makeAuth'>
            <fieldset>
              <input type="text" placeholder='account ID' required @focus='inputFocus' v-model="userId" />
              <svg viewbox='0 0 100 1' class='line'>
                <path class='line--default' d='M0 0 L100 0'></path>
              </svg>
            </fieldset>
            <fieldset>
              <input type="password" placeholder='password' @focus='inputFocus' v-model="password" required />
              <svg viewbox='0 0 100 1' class='line'>
                <path class='line--default' d='M0 0 L100 0'></path>
              </svg>
            </fieldset>
            <fieldset>
              <button type='submit' class='btn'>Login</button>
            </fieldset>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import request from 'request'

export default {
  name: 'login',
  data () {
    return {
      note: '',
      userId: '',
      password: ''
    }
  },
  watch: {
    note () {
      const note = document.querySelector('.note')
      if (this.note.length) {
        note.classList.add('note--up')
      } else {
        note.classList.remove('note--up')
        note.classList.add('note--down')
      }
    }
  },
  methods: {
    makeAuth (e) {
      request.post({
        url: 'http://localhost:8080/logon',
        json: {userId: this.userId, password: this.password}
      }, (error, response, body) => {
        if (error) {
          console.error(error)
          this.note = 'Login failed'
        } else {
          this.$router.push({name: 'HelloWorld', params: {sessionId: body.sessionId}})
        }
      })
    },
    inputFocus () {
      this.note = ''
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  font-family: 'Source Sans Pro', sans-serif;
  line-height: 1.5;
}

body {
  background: #607D8B;
}

body, input, button {
  font-size: 1.2rem;
}

fieldset {
  border: none;
}

.container {
  background: none;
  width: 400px;
  margin: 8rem auto 0;
  text-align: center;
  box-shadow: 0 1rem 1rem 0 rgba(0, 0, 0, .15);
  position: relative;
}

.note {
  background: #FF9E80;
  padding: .75rem 1.5rem;
  box-sizing: border-box;
  position: absolute;
  bottom: 100%;
  width: 100%;
  z-index: 0;
  transition: all .2s ease-out;
}

.note--down {
  transform: translateY(100%);
}

.note--up {
  transform: translateY(0);
}

.login {
  z-index: 1;
  position: relative;
  background: white;
  padding: .75rem 1.5rem 1.5rem;
  box-sizing: border-box;
}

.login--header {
  margin-bottom: 1rem;
}

.login--header span {
  font-size: 2rem;
}

.btn {
  background: white;
  box-shadow: inset 0 0 2px 0 #EEEEEE;
  outline: none;
  border: 1px solid #3F51B5;
  padding: .3rem 1rem .4rem;
  cursor: pointer;
  border-radius: .25rem;
  margin-top: 1rem;
  color: #3F51B5;
}

.btn:active {
  box-shadow: inset 2px 2px 2px 0 #E0E0E0;
}

input {
  width: 100%;
  border: none;
  text-align: center;
  outline: none;
  padding: .5rem 1rem;
  box-sizing: border-box;
  background: none;
}

.line {
  transform: translate(0, -1rem);
  stroke-width: 1;
}

.line--default {
  stroke: #ccc;
  transition: all .2s ease-out;
}

input:focus + svg > .line--default {
  stroke: #3F51B5;
}

input:focus:invalid + svg > .line--default {
  stroke: #FF5722;
}

</style>
