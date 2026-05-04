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
function PassiveToStarted(min:number,max:number):number{
    NakresliVzor(hodiny);
    music.play(music.tonePlayable(Note.C, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    basic.pause(randint(min,max));
    return stavy.Started;
}
function WasPressedBefore():void{
    if(input.buttonIsPressed(Button.A) && input.buttonIsPressed(Button.B)){
        basic.showIcon(IconNames.Sad)
    }
}
input.onButtonPressed(Button.A, function() {
    switch(AktualniStav){
        case stavy.Passive:
            AktualniStav = PassiveToStarted(3,6);
    }
})