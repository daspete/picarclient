<template>
    <div class="page">
        <div v-if="!gamepad">Press a button on your gamepad</div>
        <div v-if="gamepad">{{ speed }} {{ steer }}</div>
        <!-- <div v-if="gamepad && gamepad.axes">
            <div 
                v-for="(button, buttonIndex) in gamepad.axes"
                :key="`button-${ buttonIndex }`"
            >
                {{ buttonIndex }} - {{ button }}
            </div>
        </div> -->
        <div><button @click="ToggleCarIsRunning">{{ CarIsRunning ? 'STOP' : 'START' }} car</button></div>
        <div>Speed: {{ CarSpeed }}<button @click="IncreaseSpeed">INC</button><button @click="DecreaseSpeed">DEC</button></div>
        <div>Steer: {{ CarSteer }}<button @click="IncreaseSteer">INC</button><button @click="DecreaseSteer">DEC</button></div>
    </div>
</template>

<script>
import gql from 'graphql-tag'

const Sleep = async (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

export default {

    asyncData(){
        return {
            gamepad: null,
            speed: 0,
            steer: 0
        }
    },

    watch: {
        async speed(value){
            await this.$apollo.mutate({ 
                mutation: gql`
                    mutation($speed: Int){ 
                        SetCarSpeed(speed: $speed) 
                    }
                `,
                variables: {
                    speed: value
                }
            })

            this.$apollo.queries.CarSpeed.refetch()
        },
        async steer(value){
            await this.$apollo.mutate({ 
                mutation: gql`
                    mutation($steer: Int){ 
                        SetCarSteer(steer: $steer) 
                    }
                `,
                variables: {
                    steer: value
                }
            })

            this.$apollo.queries.CarSteer.refetch()
        },
    },

    async mounted(){
        window.addEventListener('gamepadconnected', (e) => {
            this.gamepad = e.gamepad
        })

        this.UpdateGamepad()
    },

    methods: {
        UpdateGamepad(){
            requestAnimationFrame(() => {
                this.UpdateGamepad()
            })

            this.ScanForGamepads()
            if(this.gamepad){

                // if(this.gamepad.buttons[6].value){
                //     this.speed = -100 * this.gamepad.buttons[6].value
                // }

                // if(this.gamepad.buttons[7].value){
                //     this.speed = 100 * this.gamepad.buttons[7].value
                // }
                this.speed = Math.floor(-this.gamepad.axes[1] * 100)
                this.steer = Math.floor(this.gamepad.axes[2] * 70)
                // this.steer = this.gamepad.axes[0] * 70
            }
        },

        ScanForGamepads(){
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
            for (var i = 0; i < gamepads.length; i++) {
                if(gamepads[i]) this.gamepad = gamepads[i]
            }
        },

        async ToggleCarIsRunning(){
            if(this.CarIsRunning){
                await this.$apollo.mutate({ mutation: gql`mutation { StopCar }` })
            }else{
                await this.$apollo.mutate({ mutation: gql`mutation { StartCar }` })
            }

            this.$apollo.queries.CarIsRunning.refetch()
            this.$apollo.queries.CarSpeed.refetch()
            this.$apollo.queries.CarSteer.refetch()
        },

        async IncreaseSpeed(){
            await this.$apollo.mutate({ 
                mutation: gql`
                    mutation($speed: Int){ 
                        SetCarSpeed(speed: $speed) 
                    }
                `,
                variables: {
                    speed: this.CarSpeed + 1
                }
            })

            this.$apollo.queries.CarSpeed.refetch()
        },
        async DecreaseSpeed(){
            await this.$apollo.mutate({ 
                mutation: gql`
                    mutation($speed: Int){ 
                        SetCarSpeed(speed: $speed) 
                    }
                `,
                variables: {
                    speed: this.CarSpeed - 1
                }
            })

            this.$apollo.queries.CarSpeed.refetch()
        },

        async IncreaseSteer(){
            await this.$apollo.mutate({ 
                mutation: gql`
                    mutation($steer: Int){ 
                        SetCarSteer(steer: $steer) 
                    }
                `,
                variables: {
                    steer: this.CarSteer + 1
                }
            })

            this.$apollo.queries.CarSteer.refetch()
        },
        async DecreaseSteer(){
            await this.$apollo.mutate({ 
                mutation: gql`
                    mutation($steer: Int){ 
                        SetCarSteer(steer: $steer) 
                    }
                `,
                variables: {
                    steer: this.CarSteer - 1
                }
            })

            this.$apollo.queries.CarSteer.refetch()
        }
    },

    apollo: {
        CarIsRunning: { query: gql`query { CarIsRunning }` },
        CarSpeed: { query: gql`query { CarSpeed }` },
        CarSteer: { query: gql`query { CarSteer }` },
    }
}
</script>

<style>

</style>