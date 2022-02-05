var nave, jogo, space

// posições
var px, py, piniy, pinix

// direções
var dx, dy

// tela
var tamTelaH, tamTelaW

// velocidade
var vel

//Disparo
var  tiro

//bomba
var bomba, bombachao, criarbomba = true, aleatorio, contbomba, b

//Explosão
var isom, ie

//Planeta
var vidaPlaneta, barraPlaneta

//Menu
var telaMsg

// frame
var framegame, framebomba, frametiro

function game(){
    if(jogo){
        movenave()
        movetiro()
        movendoBomba()
    }
    gerenciaGame()
    framegame = requestAnimationFrame(game)
}

// Movendo a nave
function movenave(){
    px += dx*vel
    py += dy*vel

    if(px > window.innerWidth-40){
        px = window.innerWidth-40
    }else if(px < 0){
        px = 0
    }

    if(py > window.innerHeight - (tamTelaH/4)){
        py = window.innerHeight - (tamTelaH/4)
    }else if(py < 0){
        py = 0
    }

    nave.style.left = px + "px"
    nave.style.top = py + "px"

}

//Disparando o tiro
function fogo(){
    tiro = document.createElement("div")
    tiro.setAttribute("class", "tiro")
    tiro.style.left = px+15 + "px"
    tiro.style.top = py + "px"
    document.body.appendChild(tiro)

    movetiro()
}

//Movendo o tiro
function movetiro(){

    var t = document.getElementsByClassName("tiro")
    let tam = t.length

    for(var i = 0; i < tam; i++){
        if(t[i]){
            var pt = t[i].offsetTop
            pt -= vel
            t[i].style.top = pt + "px"
            colisaoTiroBomba(t[i])
            if(pt < 0){
                t[i].remove()
            }
        }
    }

}

// Colisão tiro-bomba
function colisaoTiroBomba(tiro){
    tam = b.length

    for(var i = 0; i < tam; i++){
        if(b[i]){
            if((tiro.offsetTop < b[i].offsetTop+40) && (tiro.offsetLeft > b[i].offsetLeft) && (tiro.offsetLeft < b[i].offsetLeft+24)){
                criaExplosao(1, b[i].offsetLeft-25, b[i].offsetTop)
                tiro.remove()
                b[i].remove()
            }
        }
    }
}

// Lançamento das bombas
function soltabomba(){
    if(jogo){
        framebomba = setInterval(giva, 3000)
    }
}

function giva(){
    if(criarbomba){
        aleatorio =  Math.round(Math.random()*(window.innerWidth-20))
        bomba = document.createElement("img")
        bomba.src = "bomba.gif"
        bomba.setAttribute("class", "bomba")
        bomba.style.left = aleatorio + "px"
        bomba.style.top = 0 + "px"
        document.body.appendChild(bomba)
        contbomba--
        document.getElementById("contagem").innerHTML = "Bombas Restantes: " + contbomba
    }
}

// Movendo as bombas
function movendoBomba(){
    b = document.getElementsByClassName("bomba")
    let tam = b.length

    for(var x = 0; x < tam; x++){
        if(b[x]){
            pb = b[x].offsetTop
            pb += 2
            b[x].style.top = pb + "px"
            if(pb > tamTelaH - (tamTelaH/4)){
                vidaPlaneta -= 10
                criaExplosao(2, b[x].offsetLeft, null)
                b[x].remove()
            }
        }
    }
}

function criaExplosao(tipo, x, y){

    if(document.getElementById("explosao" + (ie-5))){  
        document.getElementById("explosao" + (ie-5)).remove()
    }

    var explosao = document.createElement('div')
    var img = document.createElement('img')
    var audio = document.createElement('audio')
    // atributos da div
    att1 = document.createAttribute('id')
    att2 = document.createAttribute('class')
    att3 = document.createAttribute('style')
    // atributos da img
    att4 = document.createAttribute('src')
    // atributos do audio
    att5 = document.createAttribute('src')
    att6 = document.createAttribute('id')

    att1.value = "explosao" + ie
    if(tipo == 1){
        att2.value = 'explosaoAr' 
        att3.value = "left:" + x + "px; top:" + y + 'px;'
        att4.value = "explosao_ar.gif?"+ new Date() 
    }else{
        att2.value = 'explosaoChao'
        att3.value = "left:" + (x-17) + "px; top:" + (tamTelaH - (tamTelaH/4)) + 'px;'
        att4.value = "explosao_chao.gif?"+ new Date()
    }

    att5.value = "exp1.mp3?" + new Date()
    att6.value = "som" + isom
    explosao.setAttributeNode(att1)
    explosao.setAttributeNode(att2)
    explosao.setAttributeNode(att3)
    img.setAttributeNode(att4)
    audio.setAttributeNode(att5)
    audio.setAttributeNode(att6)
    explosao.appendChild(img)
    explosao.appendChild(audio)
    document.body.appendChild(explosao)
    document.getElementById("som"+isom).play()
    ie++
    isom++

}

function gerenciaGame(){
    barraPlaneta.style.width = vidaPlaneta + "px"

    if(contbomba <= 0){
        jogo = false
        clearInterval(framebomba)
        telaMsg.style.backgroundImage = "url('vitoria.jpg')"
        document.getElementById("res").innerHTML = "VITÓRIA, O PLANETA FOI SALVO"
        telaMsg.style.display = "block"
    }

    if(vidaPlaneta <= 0){
        jogo = false
        clearInterval(framebomba)
        telaMsg.style.backgroundImage = "url('derrota.jpg')"
        document.getElementById("res").innerHTML = "DERROTA, O PLANETA FOI DESTRUÍDO"
        telaMsg.style.display = "block"
    }
}

function reinicia(){
    b = document.getElementsByClassName("bomba")
    var tam = b.length
    for(var i = 0; i < tam; i++){
        if(b[i]){
            b[i].remove()
        }
    }

    telaMsg.style.display = "none"
    clearInterval(framebomba)
    cancelAnimationFrame(framegame)
    contbomba = 150
    vidaPlaneta = 300
    px = pinix = tamTelaW/2
    py = piniy = tamTelaH - (tamTelaH/4)
    jogo = true
    soltabomba()
    game()
}

function inicia(){
    jogo = false
    // Space
    space = document.getElementById("space")
    // Ini Tela
    tamTelaH = window.innerHeight
    tamTelaW = window.innerWidth

    //Ini Jogador
    nave = document.getElementById("nave")
    px = pinix = tamTelaW/2
    py = piniy = (tamTelaH - 100)
    vel = 6
    dx = dy = 0
    
    disparo = 0

    // Controles das bombas
    contbomba = 150
    ie=isom = 0

    //Controles do planeta
    vidaPlaneta = 300
    barraPlaneta = document.getElementById("load")
    barraPlaneta.style.width = vidaPlaneta+"px"

    // Menu
    telaMsg = document.getElementById("msg")
    document.getElementById('msgbtn').addEventListener('click', reinicia)

    //Manipulando as direções
    document.getElementById("esquerda").addEventListener("touchstart", function(){  
        dx = -1
    })
    document.getElementById("esquerda").addEventListener("touchend", function(){  
        dx = 0
    })

    document.getElementById("cima").addEventListener("touchstart", function(){  
        dy = -1
    })
    document.getElementById("cima").addEventListener("touchend", function(){  
        dy = 0
    })

    document.getElementById("direita").addEventListener("touchstart", function(){  
        dx = 1
    })
    document.getElementById("direita").addEventListener("touchend", function(){  
        dx = 0
    })

    document.getElementById("baixo").addEventListener("touchstart", function(){  
        dy = 1
    })
    document.getElementById("baixo").addEventListener("touchend", function(){  
        dy = 0
    })

     //tiro
     document.getElementById("btnfire").addEventListener('click', function(){
        cancelAnimationFrame(frametiro)
        var x = document.getElementById("myAudio")
        x.play()

        fogo()
     })
}

window.addEventListener("load", inicia)