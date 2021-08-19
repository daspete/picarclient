<template>
    <div class="page w-screen h-screen flex bg-gray-700">
        <div v-if="!gamepad" class="relative m-auto bg-black text-gray-500 uppercase font-bold px-8 py-4 rounded-lg shadow-lg">
            Press a button on your gamepad
        </div>
        <div v-if="gamepad && !CarIsRunning" class="relative m-auto bg-green-500 text-black uppercase font-bold px-8 py-4 rounded-lg shadow-lg cursor-pointer" @click="ToggleCarIsRunning">
            Start Car
        </div>
        <div v-if="gamepad && CarIsRunning" class="relative w-screen h-screen">
            <div class="bg-gray-600 w-screen h-3/6 flex justify-center items-center text-white text-6xl">
                <div class="text-center">
                    <div class="text-9xl">SPEED</div>
                    {{ speed }}
                </div>
            </div>

            <div class="bg-gray-600 w-screen h-3/6 flex justify-center items-center text-white text-6xl">
                <div class="text-center">
                    <div class="text-9xl">STEER</div>
                    {{ steer }}
                </div>
            </div>
        </div>
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
            steer: 0,

            steerTimeout: null,
            speedTimeout: null
        }
    },

    watch: {
        async speed(value){
            if(this.speedTimeout) clearTimeout(this.speedTimeout)
            this.speedTimeout = setTimeout(async () => {
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
            }, 50)
            
        },
        async steer(value){
            if(this.steerTimeout) clearTimeout(this.steerTimeout)
            this.steerTimeout = setTimeout(async () => {
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
            }, 50)
            
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
                let speed = 0

                if(this.gamepad.buttons[6].value && this.gamepad.buttons[6].pressed){
                    speed = -this.gamepad.buttons[6].value
                }

                if(this.gamepad.buttons[7].value && this.gamepad.buttons[7].pressed){
                    speed = this.gamepad.buttons[7].value
                }
                this.speed = Math.floor(speed * 100)
                // this.speed = Math.floor(-this.gamepad.axes[1] * 100)
                // this.steer = Math.floor(-this.gamepad.axes[2] * 70)
                this.steer = Math.floor(-this.gamepad.axes[0] * 70)
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
            console.log('STR')
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
        CarIsRunning: { prefetch: false, query: gql`query { CarIsRunning }` },
        CarSpeed: { prefetch: false, query: gql`query { CarSpeed }` },
        CarSteer: { prefetch: false, query: gql`query { CarSteer }` },
    }
}
</script>

<style lang="scss">

</style>