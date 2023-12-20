//queremos criar desenhos no nosso canvas
const canvas = document.querySelector("canvas"); //aqui estamos pegando a tag canvas e passando ela para a variavel canvas
const ctx = canvas.getContext("2d") //aqui pegamos o contexto do canvas e definimos como 2d, e entao passamos isso para a variavel ctx

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play")

const audio = new Audio('../assets/audio.mp3'); //define um objeto audio
//ctx.fillStyle = "red";//estilo de preenchimento da figura que a gente vai criar vai ser vermelho
//ctx.fillRect(200, 200, 50, 100)
//retangulo preenchido
//primeiras duas: coordenadas x e y
//segundas duas: tamanho largura e altura

//proporções 
const size = 30; //definindo uma variavel de size igual a 30

const inicialPosition = {x : 240, y: 240}; //criação de um objeto chamado inicialPosition
//definindo a posicao inicial da cobrinha para no eixo x ficar em 240 e no eixo y em 240

let snake = 
    [inicialPosition]; //inicializacao de uma variavel que recebe um array, esse array contem um elemento que é a inicialPosition
                        //conforme a cobrinha vai ir crescendo esse array vai ir se expandindo

const incrementScore = () => {
    score.innerText = parseInt(score.innerText) + 10; //transformar esse texto em inteiro
    //metodo para incrementar o score do jogo, ele pega o texto do score e define o que vai ser adicionado 
    //o que vai ser adicionado é o seguinte, o valor do score transformado para inteiro + 10 que é quanto vale cada comidinha
}

const randoNumber = (min, max) => { //a funcao recebe dois parametros, min e max, representando os valores minimo e maximo que se desejava gerar no numero aleatorio
    return Math.round(Math.random() * (max - min) + min); 
    //o Math.random gera numeros aleatorios entre 0 (inclusive) e 1 (exclusive)
    //depois de gerado o numero, ele é multiplicado pela diferença do maximo e do minimo e somado ao minimo
    //exemplo, numero maximo = 10 ; numero minimo = 5 ; valor gerado = 0.6 ; nesse caso aqui o numero aleatorio nunca vai passar de 10 e nunca vai ser menor do que 5
    //e entao o Math.round arredonda o numero para o inteiro mais próximo
}

const randomPosition = () => { //funcao para gerar a comidinha em uma posicao aleatoria dentro do canvas
    const number = randoNumber(0, canvas.width - size); //0 é o valor minimo e canvas.width - size é o valor maximo
    //canvas-width - size é o valor maximo para garantir que a comidinha fique dentro da largura do canvas sem ficar com uma parte dela cortada para fora do canvas
    return Math.round(number /30) * 30; //pega o numero gerado e divide por 30, arrendodando para o inteiro mais proximo e depois multiplica por 30 novamente
    //isso esta sendo utilizado para alinhar as posições em multiplos de 30
}

const randomColor = () => { //esta sendo usado para definir de maneira aleatoria a cor das comidinhas
    const red = randoNumber(0, 255); //gera um numero aleatorio dentro dos valores minimos e maximos, no caso 0 e 255
    const green = randoNumber(0, 255); //gera um numero aleatorio dentro dos valores minimos e maximos, no caso 0 e 255
    const blue = randoNumber(0, 255); //gera um numero aleatorio dentro dos valores minimos e maximos, no caso 0 e 255

    return `rgb(${red}, ${green}, ${blue})` //retorna o numero no formato rgb de acordo com o valor gerado nas variaveis acima

}

const food = { //criação de um objeto food
    x: randomPosition(), //no eixo x vai ser posicionado de acordo com um numero aleatorio gerado entre 0 e canvas-width - size, multiplo de 30
    y: randomPosition(), //no eixo y vai ser posicionado de acordo com um numero aleatorio gerado entre 0 e canvas-width - size, multiplo de 30
    color: randomColor() //essa propriedade color vai ser definida pela funcao randomColor que no caso gera uma cor aleatorio no formato rgb
};

let direction;
let loopId;

const drawFood = () => { //vai desenhar a comidinha no canvas

    const {x, y, color} = food; //aqui ta pegando os valores das propriedades do objeto food, que é randoPosition para o x, randoPosition para o y e randoColor para color
    
    ctx.shadowColor = color; //define a cor da sombra do contexto 2d para a mesma cor da da cor
    ctx.shadowBlur = 6; //define o desfoque da sombra para 6, destacando mais no canvas
    ctx.fillStyle = food.color; //define a cor do preenchimento do contexto 2d para a mesma cor da food
    ctx.fillRect(x, y, size, size) //desenha um retanngulo, a comidinha, nas coordenada x e y da comida, com a largura e altura da variavel size
    //a função fillRect preenche a cor do retangulo com a cor definida anteriormente
    ctx.shadowBlur = 0; //remover o efeito de desfoque da sombra

}

const drawSnake = () => { //função para desenhar a cobrinha
    ctx.fillStyle = "white"; //define a cor do preenchimento da cobrinha para branco

    snake.forEach((position, index) => {  //utiliza o metodo forEach para percorrer cada elemento do array snake
        //cada elemento corresponde a uma parte da cobrinha, sendo position as coordenadas x e y e o index a posicao do elemento no array
        if (index == snake.length - 1) { //se o index (indice) da parte da cobrinha for igual ao tamanho da snake - 1 quer dizer que é o ultimo elemento do array, a cabeça da cobrinha
            //a cabeça da cobrinha vai ser pintada de uma outra cor para ser diferenciada, nesse caso azul
            ctx.fillStyle = "blue";
        }

        ctx.fillRect(position.x, position.y, size, size); 
        //desenha um retangulo para representar cada parte da cobrinha, usa as coordenadas postion.x e position.y , como posicao inicial do retangulo
        //e o size para definir a largura e a altura do retangulo
        
    });
}

const moveSnake = () =>{
if (!direction) return; //se a direção nao esta definida, ele vai retornar interrompendo o movimento da cobrinha

    const head = snake[snake.length - 1]; //vai pegar o ultimo elemento do array, ou seja, a cabeça da cobrinha e vai guardar na variavl head


    if (direction == "right") { //se a direção for right
        snake.push({x : head.x + size, y: head.y}) //o metodo push adiciona um elemento no final do array
        //esse elemento vai ser adicionado conforme as coordenadas passadas ali, ou seja
        //a coordenada x vai ser o head.x + size
        //somando o size ao head.x ele vai dar impressão que esta se movendo para a direita
    }

    if (direction == "left") {
        snake.push({x : head.x - size, y: head.y}) //usar o metodo push e entao subtrair o size do head.x para que de a impressao que esta se movendo para a esquerda
    }

    if (direction == "down") {
        snake.push({x : head.x, y: head.y + size}) //usar o metodo push que vai adicionar um elemento no final do array snake
        //aqui mantemos a coordenada x e adicionamos a coordenada head.y o size para que de a impressao que ele esta indo para baixo
    }

    if (direction == "up") {
        snake.push({x : head.x, y: head.y - size}) //usar o metodo push que adicionar um elemento no final do array snake
        //esse elemento vai ter as coordenadas no x iguais da head.x e no eixo vai ser subtraido o size para que de a impressao de movimento para cima
    }

    snake.shift(); //remover o primeiro elemento do array para que a cobrinha nao cresca pq ja estaremos adicionando um novo elemento no array

}



const drawGrid = () => { //para desenhar um grid no canvas usando um contexto 2d (ctx) definido la em cima
    //o contexto 2d do canvas é a variavel ctx
    ctx.lineWidth = 0.5; //definie as larguras do grid como 0.5 unidades
    ctx.strokeStyle = "white"; //define a cor das linhas como white, MAS PORQUE STROKE? strokeStyle é uma propriedade do contexto 2d que define a cor do traço a ser desenhado

    for (let i = 30; i < canvas.width; i = i + 30) { //usado para desenhar as linhas horizontais e verticais do grid
        //ele começa na posicao 30, vai até a largura do canvas e vai tendo acrescimo de 30 em 30

        ctx.beginPath(); //inicia um novo caminho para desenho, ou seja, cada linha vai ser desenhada sem ligação com a anterior
        ctx.lineTo(i, 0); //move a caneta para a posicao i no eixo x e para 0 no eixo y
        ctx.lineTo(i, 540); //move a caneta para a posicao i no eixo x e para 540 no eixo y MAS PORQUE ASSIM?


        //desenha as linhas verticais
        //esses lineTo é tipo, o primeiro é onde a linha começa e o segundo é onde a linha termina, ou seja
        //ela vai começar sempre no i, que vai ser acrescentando 30 a cada vez que for desenhado e ela sempre vai começar no 0 do eixo y e vai terminar no 540 do eixo y
        //para que assim seja tipo, a primeira vai ser (30, 0) e (30, 540) - a segunda vai ser (60, 0) e (60, 540), ou seja
        //vai pulado de 30 em 30 no eixo x e no eixo y vai atravessar o canvas

        ctx.stroke(); //desenha a linha definida pelas coordenadas anteriormente especificadas


        ctx.beginPath(); //inicia um novo caminho para desenho, ou seja, cada linha var ser desenhada sem ligação com a anterior
        ctx.lineTo(0, i); //aqui a linha sempre vai começar no 0 no eixo x e no eixo y é o i
        ctx.lineTo(540, i); //aqui a linha sempre vai terminar no 540 no eixo x e no eixo y é o i

        //explicando os lineTo, primeiro lineTo, define que sai do 0 no eixo x e vai até o i no eixo y
        //vai desenhar as linhas horizontais
        //ou seja, primeira linha sai do 0 e vai até o 540 no eixo x, e sai do 30 no eixo y cruza até o outro lado no 30
        //segunda linha, sai do 0 e vai até o 540 no eixo x, e sai do 60 no eixo y, cruzando o canvas até o outro lado no 60 do eixo y

        ctx.stroke(); //desenha a linha definida pelas coordenadas anteriormente especificadas


    }
}

const checkColision = () => {
    //colisao da borda do canvas
    const head = snake[snake.length - 1]; //aqui declaramos a variavel head e definimos o valor dela para o tamanho do vetor snake - 1 que entao seria o ultimo elemento
    const canvasLimit = canvas.width - size; //aqui declaramos a variavel canvasLimit e passamos o valor da largura do canvas menos o size, subtraimos o size para evitar que a cabeça ultrapasse as bordas do canvas
    const neckIndex = snake.length - 2; //aqui delclaramos a variavel necKIndex que seria o penultimo elemento, entao é o tamanho da snake - 2

    const wallColision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit; //aqui declaramos a variavel wallCOlision
    //passamos o valor dela da seguinte forma
    //cabeça no eixo x menor que 0 ou cabeça no eixo x maior que o canvas.width - size ou cabeça no eixo y menor que 0 ou cabeça no eixo y maior que o canvas-width - size
    //se uma dessas condições forem verdadeiras signifca que o ultimo elemento do array da snake chegou no limite e entao bateu na parede do canvas, ou seja, perdeu


    //verificar se a cabeça da snake encontrou com alguma posição do corpo da snake
    const selfColision = snake.find((position, index) => { //find percorre o array snake
        return index < neckIndex && position.x == head.x  && position.y == head.y;
        //index < neckIndex é pra o find percorrer apenas até o penultimo elemento, ou seja, nao percorrer a cabeça porque dai daria como colisão toda 
        //se as coordenadas de uma posicao no eixo x e no eixo y forem iguais as coordenadas da cabeça da snake nas posições do eixo x e y obvimente quer dizer que teve colisao

    })

    if (wallColision || selfColision) { //se um dos dois forem verdadeiros é chamada a função gameOver, ou seja perdeu o jogo
        gameOver();
    }
}

const gameOver = () => {
    direction = undefined; //aqui passamos a direção undefined para que a cobrinha nao ande mais

    menu.style.display = "flex"; //torna visivel a classe menu, que antes era display none
    finalScore.innerText = score.innerText; //transfere o valor da final score para o score e assim é exibido
    canvas.style.filter = "blur(2px)" //aplica um efeito de desfoque no canvas, para que o menu de game over se destaque
} 




const checkEat = () => {
    const head = snake[snake.length - 1]; //aqui denovo vai ser pego o ultimo elemento do array, fazendo o tamanho do array - 1
    
    if(head.x == food.x && head.y == food.y) { //se coordenada da cabeça no eixo x for igual a da comida no eixo x E se a coordenada da cabeça no eixo y for igual a da comida no eixo y

        incrementScore(); //chamamos o metodo para incrementar o score

        snake.push(head); //adiciona um elemento ao final do array nas mesmas coordenadas da head da cobrinha

        audio.play(); //toca o audio de comer
        
        //encontrar uma nova posicao para a comida
            let x = randomPosition(); //nova coordenada do eixo x aleatoria
            let y = randomPosition(); //nova coordenada do eixo y aleatoria

            while (snake.find((position) => position.x == x && position.y == y)) { //enquando o find percorrer o array snake e tiver uma posicao da cobrinha coordenada eixo x igual a nova coordenada e uma posicao da cobrinha coordenada eixo y igual a nova coordenada
                x = randomPosition(); //vai gerar outro x aleatorio
                y = randomPosition(); //vai gerar outro y aleatorio
    
            }

            food.x = x; //vai ser atribuido a propriedade x da food a variavel x
            food.y = y; //vai ser atribuido a propriedade y da food a variavel y
            food.color = randomColor();//vai ser atribuido a propriedade color da food uma cor aleatoria
        
    }
}


const gameLoop = () => {
    clearInterval(loopId); //limpa o intervalo de tempo anterior garantindo que apenas um gameLoop esteja em execução por vez

    ctx.clearRect(0, 0, 540, 540); //aqui é usado clearRect limpar a area do canvas para ser redesenhado
    drawGrid(); //aqui desenhamos o grid novamente
    drawFood(); //aqui desenhamos a comida
    moveSnake(); //atualiza a posição da cobrinha
    drawSnake(); //desenha a cobrinha na posicao nova
    checkEat(); //verifica se a cobrinha comeu a comida
    checkColision(); //verifica se houve colisao

    loopId = setTimeout(() => { 
        gameLoop(); //todas as ações acima vao ser executados uma vez sempre que passar 100 milisegundos
    }, 100)
}


gameLoop(); //chama a função do que carrega o jogo, que tem todas as outras funções para que o jogo funcione

document.addEventListener("keydown", ({key}) => { //adiciona um EventListener para keydown, ou seja, tecla pressinonada e tem uma função com parametro key
    if (key == "ArrowRight" && direction != "left") { //se o parametro key for igual a ArrowRight e a direção for diferente de lef para que a cobrinha nao se trombe
        direction = "right"; //a direção da cobrinha vai passar a ser right
    } 
    if (key == "ArrowLeft" && direction != "right") {
        direction = "left";
    }

    if (key == "ArrowDown" && direction != "up") {
        direction = "down";
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = "up";
    }
})



buttonPlay.addEventListener("click", () => { //ouvinte de eventos (EventListener) para quando ocorrer um click no buttonPlay
    score.innerText = "00"; //reinicia a pontuação do jogo
    menu.style.display = "none"; //faz com que o menu desapareça
    canvas.style.filter = "none"; //faz com que o desfoque do canvas desapareça

    snake = [inicialPosition]; //define a posição da variavel snake para a posição inicial
    
})












































