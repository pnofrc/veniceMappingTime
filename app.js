// se gli utenti 



$( document ).ready(function() {


var keys = []
var dramaSequence = []
var pic = document.querySelector('#pic')
var vid = document.querySelector('#vid')
var timing = 800
let dur = 600

// function to read a json
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function dramaturgy(keys){
    let len = keys.length
    let curr = getRandomInt(len)
    
    return keys[curr]
}

function timeout(min,max){
    dur = Math.floor(Math.random() * (max - min) + min);
}

    
// Read the "database" from the json (list of paths of the pics)
readTextFile("./db.json", function(text){
    var data = JSON.parse(text);
    let k = Object.keys(data)
    // and compile the array keys with json' keys 
    // they are the dramaturgy choices
    k.forEach(key => {
        keys.push(key)
    });
    

    for (let index = 0; index < 800; index++) { //TODO: invece che 48 mettere var

        dramaSequence.push(dramaturgy(keys))
    }

    Pd.startOnClick(document.body, function() {
        let n = 0;

        document.querySelector('#pic').addEventListener('change', function (e) {
            timing = getRandomInt(2000)
        });

        function background(){
            if (dur <= 700 || dur >= 1600){
                document.body.style.background = 'black'
            } else {
                document.body.style.background = 'white'
            }
        }


            vid.ondurationchange = function() {
              if (this.duration == 0){
                dur = 900
              } else if (Number.isInteger(this.duration)){
                dur = this.duration + '000'
              } else{
                dur = String(this.duration).replace('.','') + '0'
              }
                console.log(this.duration)
                
              setTimeout(() => {
                vid.style.display = 'none'
            }, dur);

            };

        function loop() {
           

            if (n == 800){
                window.location.reload()
            }

           
            let nowRand = getRandomInt(data[dramaSequence[n]].length)
            currentPic = data[dramaSequence[n]][nowRand]

            if(dramaSequence[n] == 'clips'){
                vid.style.display = 'block'
                // TODO randomizzare via /3 e /2 e else
                vid.src = './assets/'+currentPic
                vid.autoplay
                
                background()
                Pd.send('fastdue', [6]);
                Pd.send('durdue', 2000)

        
            } else {
                Pd.send(dramaSequence[n], [1]);
                timeout(500,2000)
               
                
           
            pic.src='./assets/'+currentPic
            setTimeout(() => {
                background()
            }, 35);
           
                                        

            }

            if (n % 15 == 0 && dramaSequence[n] != 'clips'){
                Pd.send('startvelox', [4]);
                let x = 0
                let tempFold = dramaSequence[n]
                function fastLoop(){
                    setTimeout(() => {
                        x++
                        temp = nowRand+x
                        currentPic = data[tempFold][temp]
                        console.log(currentPic)
                        pic.src='./assets/'+currentPic
                        if (x <= 5){
                            fastLoop()
                        } else {
                            Pd.send('stopvelox',[4]);
                            console.log('')
                        }
                        console.log('fast')
                    }, 400);
                }
                    fastLoop()
                    console.log('stop')
                window.setTimeout(loop, 5100);
                n++
            } else {
                n++
                window.setTimeout(loop, dur);
            }
            }

         loop()



        });
                        
    })

});