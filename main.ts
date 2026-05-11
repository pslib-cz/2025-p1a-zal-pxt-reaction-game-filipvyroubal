// ReactionGame – instrukce v README.md
enum stavy {
    Passive = 0,
    Started = 1,
    Running = 2
}
const  hodiny: Array<Array<boolean>> = [
    [false, true, true, true, false],
    [false, true, false, true, false],
    [false, false, true, false, false],
    [false, true, false, true, false],
    [false, true, true, true, false],
]
let AktualniStav : stavy = stavy.Passive
function NakresliVzor(vzor : Array<Array<boolean>>):void{
    for (let y = 0; y < hodiny.length;++y){ 
        for (let x = 0; x < vzor[y].length; ++x){
            vzor[y][x] && led.plot(x,y)
        }
    }
}
function Win(player : string){
    basic.showString(player)
    control.inBackground(() => {
        music.play(music.stringPlayable("F# G# A# R", 360), music.PlaybackMode.UntilDone)
        music.play(music.stringPlayable("F# G# A# R", 360), music.PlaybackMode.UntilDone)
    })
}
function Tie(ic : IconNames){
    basic.showIcon(ic)
    control.inBackground(() => {
        music.play(music.stringPlayable("E E R G G R D D R A A R", 360), music.PlaybackMode.UntilDone)
        music.play(music.stringPlayable("E E R G G R D D R A A R", 360), music.PlaybackMode.UntilDone)
    })
}
function WasPressedBefore(): boolean {
    if (input.buttonIsPressed(Button.A) && input.buttonIsPressed(Button.B)) {
        Tie(IconNames.Sad)
        return true;
    } else if (input.buttonIsPressed(Button.A) && !input.buttonIsPressed(Button.B)) {
        Win("B")
        return true
    } else if (!input.buttonIsPressed(Button.A) && input.buttonIsPressed(Button.B)) {
        Win("A")
        return true
    }
    else{
        return false
    }
}
function PassiveToStarted(min:number,max:number):number{
    NakresliVzor(hodiny);
    control.inBackground(() => music.play(music.tonePlayable(Note.C, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone))
    let wait:number = randint(min, max) * 1000
    let start :number = control.millis()
    while (control.millis() - start < wait) {
        if (WasPressedBefore()) {
            return stavy.Passive; // someone pressed early → exit immediately
        }
        basic.pause(20);
    }
    return stavy.Started;
}
function StartedToRunning(): number{
    basic.showIcon(IconNames.Pitchfork);
    control.inBackground(() => music.playTone(Note.FSharp5,200));
    return stavy.Running;
}

input.onButtonPressed(Button.A, function() {
    switch(AktualniStav){
        case stavy.Passive:
            basic.clearScreen();
            AktualniStav = PassiveToStarted(3,6);
            basic.clearScreen();
            if(AktualniStav == stavy.Started){
                AktualniStav = StartedToRunning();
            }
    }
})
basic.forever(function() {
    switch(AktualniStav){
        case stavy.Running:
            let pressedA = input.buttonIsPressed(Button.A)
            let pressedB = input.buttonIsPressed(Button.B)
            if(pressedA && pressedB){
                Tie(IconNames.Square)
                AktualniStav = stavy.Passive
            }else if(pressedA){
                Win("A")
                AktualniStav = stavy.Passive
            } else if (pressedB) {
                Win("B")
                AktualniStav = stavy.Passive
            }else{
                basic.pause(100)
            }
    }
})