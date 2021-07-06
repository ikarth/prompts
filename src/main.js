class Spin extends Phaser.Scene {
    constructor() {
        super("spinScene");
        this.spin = 0.00001;
        this.max_spin = 0.1;
        this.min_spin = 0.001;
        this.spin_position = 0.3;
        this.pointerStart = 0.5;
        this.pointerEnd = 0.5;
        this.spin_cutoff = 0.000021;
        
    }

    preload() {
        this.load.json('themesData', 'assets/themes.json');
    }

    create() {
        this.themes = this.cache.json.get('themesData');
        console.log(this);
        debugger;

        this.themes = Phaser.Math.RND.shuffle(this.themes);
        this.textWheel = [];
        let prompt_step = 1.0 / this.themes.length;
        let current_step = 0.0;
        this.textConfig = {
            fontFamily: 'Courier',
            fontWeight: 'bold',
            fontSize: '16px',
            //backgroundColor: '#221104',
            color: '#FFB0FF',
            align: 'center',
            padding: {
                top: 5, bottom: 5
            }
        }
        this.textConfigBig = {
            fontFamily: 'Courier',
            fontStyle: 'bold',
            fontSize: '32px',
            backgroundColor: '#330000',
            color: '#FFA0FF',
            align: 'center',
            blendMode: Phaser.BlendModes.ADD,
            shadowBlur: 5,
            shadowFill: true,
            strokeThickness: 10,
            stroke: "#300",
            padding: {
                top: 5, bottom: 5,
                left: 15, right: 15
            }
        }
        
        for(let tval of this.themes) {
            let promptText = this.add.text(game.config.width / 2.0, game.config.height / 2.0, tval, this.textConfig).setOrigin(0.5, 0.5);
            promptText._interpolation = current_step;
            current_step += prompt_step;
            this.textWheel.push(promptText);
        }
        this.primeText = this.add.text(game.config.width / 2.0, game.config.height / 2.0, "Prompt", this.textConfigBig).setOrigin(0.5, 0.5);

        this.input.on('pointerdown', (pointer) => {
            this.cameras.main.setBackgroundColor("#770000");
            this.pointerStart = pointer.y / game.config.height;
        });
        this.input.on('pointerup', (pointer) => {
            this.cameras.main.setBackgroundColor("#000000");
            this.pointerEnd = pointer.y / game.config.height;
            this.spin += this.min_spin + (Math.abs(this.pointerStart - this.pointerEnd) * 0.005);
            this.pointerStart = 0.5;
            this.pointerEnd = 0.5;
        });


    }

    update(time, delta) {

        if (Math.abs(this.pointerStart - this.pointerEnd) > 0.1) {
            this.spin = 1.0 * (this.pointerStart - this.pointerEnd) * 0.003;
        }

        this.spin_position += delta * this.spin;

        if (this.spin_position < 0.0) {
            this.spin_position += 10.0;
        }
        this.spin_position %= 1.0;

        this.spin *= 0.99; // friction, decay over time
        if (Math.abs(this.spin) < this.spin_cutoff) {
            this.spin = 0; // stop if we get too low
            this.primeText.setAlpha(1.0);
            this.cameras.main.setBackgroundColor("#000000");
        } else {
            this.primeText.setAlpha(0.8 - (Math.abs(this.spin) * 0.8));
            this.cameras.main.setBackgroundColor("#770000");
        }
        let center_count = 0;
        if(this.spin > 0.0) {
            for(let txt of this.textWheel) {
                let offset = (txt._interpolation + this.spin_position) % 1.0;
                offset = Phaser.Math.Interpolation.SmoothStep(offset, -0.1, 1.1);
                let brightness = 1.0 - Math.abs(offset - 0.5);
                txt.y = game.config.height * offset;
                txt.setAlpha(brightness);
                
                
                if(brightness > 0.99) {
                    this.primeText.text = txt.text;
                    center_count += 1;
                }
            }
        }
    }
}

let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 680,
    scene: [Spin],
    numberOfPrompts: 5
}

let game = new Phaser.Game(config);