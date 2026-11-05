class InputHandler {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            shoot: {
                pressed: false,
                released: true,
            },
        };

        this.bindEvents();
    }

    bindEvents() {
        addEventListener("keydown", (event) => {
            const key = event.key.toLowerCase();

            if (key === "a") this.keys.left = true;
            if (key === "d") this.keys.right = true;
            if (key === "enter") this.keys.shoot.pressed = true;
        });

        addEventListener("keyup", (event) => {
            const key = event.key.toLowerCase();

            if (key === "a") this.keys.left = false;
            if (key === "d") this.keys.right = false;
            if (key === "enter") {
                this.keys.shoot.pressed = false;
                this.keys.shoot.released = true;
            }
        });
    }
}

export default InputHandler;
