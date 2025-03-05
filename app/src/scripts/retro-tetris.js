


















/////   AUDIO AND SOUNDS   /////


let mySound = new Audio('audio/skyward-sword.mp3');

// let mySound = new Audio('audio/stranger-things.mp3');



// let mySound = new Audio('audio/botw.mp3');

let myfreeze = new Audio('audio/coin-win.wav');

let myclear = new Audio('audio/treasure.wav');










/////   GLOBAL VARIABLES   /////


const start = document.getElementById("start");

const button = document.getElementById("button");

const head = document.querySelectorAll("header");

const container = document.querySelectorAll("div.container");

const btns = document.querySelectorAll("div.controls");

const btnsR = document.querySelectorAll("div.rotation");

const WIDTH = 360;                                                                                  //    Improvements:   Height and Pixels assigned to global variables

const HEIGHT = 600;

const PIXELS = 30;


const COLORS = {

    0: "#FF971C",
    1: "#0341AE",
    2: "#72CB3B",
    3: "#FFD500",
    4: "#FF3213"    };








/////   FUNCTION CALLS   /////


document.addEventListener("DOMContentLoaded", (event) =>  {

  console.log("DOM fully loaded and parsed");

  for (const key of Object.keys(COLORS)) {

    console.log(key);

    console.log(COLORS[key]);     }

  console.log(COLORS);                                    });





  start.addEventListener('click', ( ) =>  {


    clear(button);


    clear(start);



    var gameBoard = document.createElement('canvas');

    gameBoard.id = "board";

    gameBoard.width  = WIDTH;

    gameBoard.height = HEIGHT;

    container[0].appendChild(gameBoard);



    var play = document.createElement('button');

    play.id = "play";

    play.innerHTML += "Play";

    container[0].appendChild(play);



    var LeftButton = document.createElement('button');

    LeftButton.id = "btnLeft";

    LeftButton.innerHTML += "< Left";

    btns[0].appendChild(LeftButton);


    var RightButton = document.createElement('button');

    RightButton.id = "btnRight";

    RightButton.innerHTML += "Right >";

    btns[0].appendChild(RightButton);



    var RotateButton = document.createElement('button');

    RotateButton.id = "btnRotate";

    RotateButton.innerHTML += "Rotate";

    btnsR[0].appendChild(RotateButton);


    mySound.play();


    event.preventDefault();



    play.addEventListener('click', ()   =>  {

      clear(play);

      var game = new gameboard (WIDTH , HEIGHT, PIXELS, COLORS);

        game.cells();

        game.grid(game.cellsdown , game.cellsacross);

        game.controls();

        game.touchcontrols();

        event.preventDefault();   })});









/////   HELPER FUNCTIONS   /////


function clear (NumForm)  {

  const remove = NumForm;

  remove.remove();  };










/////   MAIN   /////


class gameboard {                                                                                     //    Improvements:   Renamed attributes of the gameboard object

  tetris;                                                                                             //                    activeTetramino     ->    active
                                                                                                      //                    tetramino           ->    tetris
  startdown = 1;                                                                                      //                    start X / y         ->    startacross / startdown
                                                                                                      //                    cellQ / cellN       ->    cellsdown / cellsacross
  startacross = 6;

  active = false;

  disable = false;

  cellsdown;

  cellsacross;

  matrix = [];

  original = [];


  rows = 0;

  vertical = 0;


  score = 0;

  shade;


  update = setInterval(this.progress.bind(this) , 1 );                                                //    Important:      Bind the progress function to run the game    --    Update and store game state each interval
                                                                                                      //                                                                        and draw the graphics to the JavaScript canvas

  count = setInterval(this.down.bind(this) , 350);                                                    //    Important:      Goal is to move the game piece down one position    --      Recursively set drop to next iteration


  constructor (width , height , pixels, colors)   {

    this.width = width;                                                                               //    Improvements:   Constructor is reduced and stores global variables

    this.height = height;

    this.pixels = pixels;

    this.colors = colors;  }





  static cells(dimension , pixels) {                                                                  //    Improvements:   Improved Orthonologity    --    Design principle that aims to make self contained components; independent so that changes to one component do not affect others
                                                                                                      //                                                    Calculated dimensions are processed in seperate function and can accept parameters allowing for the components to be combined alongside other components
    return dimension / pixels;  }










  cells() {

    this.cellsdown = gameboard.cells(this.height, this.pixels);                                       //    Improvements:   Code the calculated dimensions formula only one time rather than two

    this.cellsacross = gameboard.cells(this.width, this.pixels);   }





  grid(down , across)  {

    for (let i = 0; i < down; i++)  {

      this.matrix[i] = [];

      this.original[i] = [];

      for (let j = 0; j < across; j++)  {

        this.matrix[i][j]   = false;

        this.original[i][j] = false;    }}}





  controls()  {                                                                                       //    Improvements:   Implement key controls for     inputs | outputs     through event listener

    window.addEventListener("keyup", (event)  =>  {

      if (event.defaultPrevented) {
        return  }

      if (this.disable === true)  {
        return  }

      switch (event.key)  {                                                                           //    Improvements:   The values of the switch are compared against the expression    --    Determines the code block to be executed

        case "w":
          this.pipe();                                                                                //    Improvements:   Improved Orthonologity    --    W button rotates    --    Reduce mutiple function calls into one route
          break;

        case "s":
          this.down();                                                                                //    Improvements:   Disabling the down controls allows the game to dictate the speed of the block drop    --    See line 190
          break;

        case "a":
          this.left();
          break;

        case "d":
          this.right(this.cellsacross);
          break;    }})}






    touchcontrols() {

        window.addEventListener("click" , (event) => {

        if (event.defaultPrevented) {
            return  }

        if (this.disable === true)  {
            return  }

        switch (event.target.id)  {

            case "btnRotate":
                this.pipe();
                break;

            case "btnLeft":
                this.left();
                break;

            case "btnRight":
                this.right(this.cellsacross);
                break;  }})}



        





  progress()  {

    if (this.active === false)  {
    // >

      this.state();
      // >

        this.spawn();
        // >

          this.active = true;
          // >

          this.mapping();
          // >

            this.draw(this.tetris.y , this.tetris.x , this.pixels, this.shade);
            // >

              this.drawc(this.pixels);   }

    else    {

      this.gameover();
      // >

      for (let i = this.rows; i > 0; i--)   {



        this.movedown(this.vertical , this.cellsacross);   }
        // >          ^
        // >          Drop all bricks from the last position when a full line was cleared

            this.vertical = 0;
            // >

              this.rows = 0;
              // > ^
              // > Missing from final design        --      Resets to ensure correct number of cleared rows for next run of the game loop

                this.state();
                // >

                  this.mapping();
                  // >

                    this.draw(this.tetris.y , this.tetris.x , this.pixels, this.shade);
                    // >

                      this.drawc(this.pixels);
                      // >

                        this.set(this.score);
                        // >

                          this.disable = false;   }}










  spawn()  {

    const random = this.getRandomInt(7);

    this.shade = this.getColor();

    this.tetris = new shapesArray[random](this.startdown , this.startacross , this.pixels , this.pixels);  }





  getRandomInt(max) {                                                                                 //    Important:      Function for generating random number to pick color and tetramino

    return Math.floor(Math.random( ) * max);  }





  getColor()  {

    const ramdomColor = this.getRandomInt(3);

    return this.colors[ramdomColor];          }





  movedown(down , across) {                                                                           //    Improvements:   Variables for clearing bricks passed as parameters

    myclear.play();                                                                                   //                    B [ this . cellsdown ]       ->    Removed   --  Not used
                                                                                                      //                    A [ this . cellsacross ]     ->    Removed   --  Passed as parameter
    for (let i = down; i > 0 ; i--) {                                                                 //                    C [ this . vertical ]        ->    Removed   --  Passed as parameter
                                                                                                      //                    D [ this . rows ]            ->    Removed   --  Not used
      for (let j = 0; j < across ; j++) {

        if (this.original[i-1][j] === true) {

          this.original[i-1][j] = false;

          this.original[i][j] = true;       }}}}





  state()   {

    this.matrix = this.original.map( arr => arr.slice(0) );   }                                       //    Important:      Save matrix grid to original grid





  mapping() {                                                                                         //    Improvements:   Remove newi / newj variables     --    Built into loop statement
                                                                                                      //                    Remove mapA / mapB variables     --    Built into if statement as   this.tetris.y / x
    for (let i = -1; i < 2; i++)  {

      for (let j = -1; j < 2; j++)  {

      if (this.tetris.Positions[this.tetris.Position][i + 1][j + 1] === 1)  {

        this.matrix[this.tetris.y + i][this.tetris.x + j] = true;   }}}}                              //    Important:      Each time the game loop runs map the change of the tetramino position to the matrix grid
                                                                                                      //                    starting in top left coordinate of the tetramino shapes matrix    --    Note the tetramino position
                                                                                                      //                    is not mapped to the original grid and only if frozen in place



  down()  {

    this.disable = true;

    for (let i = -1; i < 2; i++)  {                                                                   //    Improvements:   Removed newi / newj variables     --    Built into loop statement

      for (let j = -1; j < 2; j++)   {

        if  (this.tetris.Positions[this.tetris.Position][i + 1][j + 1] === 1   &&  this.tetris.y + i + 1 === this.cellsdown)    {
                                                                                           //  ^   ^   ^     ^
                                                                                           //                if this equals bottom of the grid
                                                                                           //          one line down
                                                                                           //      row in grid
                                                                                           //  tetramino current coordinate

          this.freeze(this.cellsdown , this.cellsacross);                                             //    Improvements:   Improved Orthonologity    --    Variables are passed as parameters

          myfreeze.play();

          return    }

        else if (this.tetris.Positions[this.tetris.Position][i + 1][j + 1] === 1   &&  this.original[this.tetris.y + i + 1][this.tetris.x + j] === true)    {

          this.freeze(this.cellsdown , this.cellsacross);

          myfreeze.play();

          return    }}}

    this.tetris.y += 1;   }                                                                           //    Improvements:   Left - Right - Down   controls move the tetramino coordinates      [ +=1       ]
                                                                                                      //                    Each new position is rewdrawn through a speerate function call     [ draw()    ]
                                                                                                      //                    No positional updates made to the matrix for moves
                                                                                                      //                    On each game loop   (1) the frozen bricks are mapped               [ state()   ]
                                                                                                      //                                        (2) the active tetramino is mapped             [ mapping() ]

  freeze(down , across)  {

    for (let i = 0; i < down; i++)  {

      for (let j = 0; j < across; j++)  {

        this.original[i][j] = this.matrix[i][j];  }}

    this.tetris = null;

    this.active = false;

    this.lines(down , across);  }                                                                     //    Improvements:   DRY     --    Design principle to ensure that every source of knowledge is represented in one place
                                                                                                      //                                  Parameters are passed and routed through each function rather than declared again



  lines(down , across)  {                                                                             //    Improvements:   Improved Orthonologity     --     Each function has a single well defined purpose within the system
                                                                                                      //                                                      (1) check for completed lines         [ lines( down , across ) ]
  dance:  for (let i = down - 1; i > 0; i--) {                                                        //                                                      (2) Clear completed line if found     [ clear( line , across ) ]

            for (let j = 0; j < across; j++) {

              if (this.original[i][j] === false)  {

                continue dance; }}

            if ( i > this.vertical )  {

              this.vertical = i; }

            this.clear(i , across);

            this.rows += 1;

            this.score += 1;    }}


  clear(line , across) {

    for (let i = 0; i < across; i++) {

      this.original[line][i] = false;  }}





  right(across) {

    for (let i = -1 ; i < 2 ; i++)  {

      for (let j = -1; j < 2; j++)  {

        if  ( this.tetris.Positions[this.tetris.Position][i + 1][j + 1] === 1   &&  this.tetris.x + j + 1 === across )  {

          return  }

        else if ( this.tetris.Positions[this.tetris.Position][i + 1][j + 1] === 1   &&  this.original[this.tetris.y + i][this.tetris.x + j + 1] === true )  {

          return  }}}

    this.tetris.x += 1;  }





  left()  {


    for (let i = -1 ; i < 2 ; i++)  {

      for (let j = -1; j < 2; j++)    {

        if  ( this.tetris.Positions[this.tetris.Position][i + 1][j + 1] === 1   &&  this.tetris.x + j - 1 === -1 )  {

          return  }

        else if ( this.tetris.Positions[this.tetris.Position][i + 1][j + 1] === 1   &&  this.original[this.tetris.y + i][this.tetris.x + j - 1] === true )  {

          return  }}}

    this.tetris.x -= 1;  }





  pipe()  {                                                                                       //    Important:      Reduce the function calls and enforce DRY principles

    const check = this.collision();                                                               //    Improvements:   Run function to validate state of future position     --    When there is a collision terminate the route

    if(check === true)  {

      return  }

    else  {

      this.rotate();   }}                                                                         //    Improvements:   If no coliisions rotate tetramino





  collision() {

    for (let i = -1 ; i < 2 ; i++)  {                                                             //    Improvements:   Removed newi / newj variables     --    Built into loop statement

      for (let j = -1; j < 2; j++)   {

          if  ( this.tetris.Positions[this.tetris.Potential][i+1][j+1] === 1  &&

          this.original[this.tetris.y + i][this.tetris.x + j] === true )  {

          return true;  }

          else if ( this.tetris.Positions[this.tetris.Potential][i+1][j+1] === 1  &&

          this.original[this.tetris.y + i][this.tetris.x + j] === undefined )   {

          return true;  }}}

    return false  }





  rotate()  {

    const length = this.tetris.Positions.length;

    if  ( this.tetris.Position === length - 2 )  {

      this.tetris.Potential = 0;

      this.tetris.Position = length - 1;  }

    else if ( this.tetris.Position === length - 1 )  {

      this.tetris.Potential = 1;

      this.tetris.Position = 0;  }

    else  {

      this.tetris.Potential += 1;

      this.tetris.Position  += 1;  }}





  drawc(pixels)  {

    const canvas = document.getElementById("board");

    const ctx = canvas.getContext("2d");

    for (let Y = 0; Y < this.original.length ; Y++)  {

      for (let X = 0; X < this.original[0].length; X++) {

        if (this.original[Y][X] === true)   {

          ctx.fillStyle = "slategray";                                                              //    Improvements:   Color of frozen bricks

          const WIDTH = 360;

          ctx.fillRect(X * pixels, Y * pixels, pixels - 1, pixels - 1);       }}}}






  draw(y , x , pixels, color)  {

    const canvas = document.getElementById("board");

    const ctx = canvas.getContext("2d");

    ctx.clearRect( 0 , 0 , this.width , this.height );

    for (let i = -1; i < 2 ; i++)  {

      for (let j = -1; j < 2; j++) {

        if ( this.tetris.Positions[this.tetris.Position][i + 1][j + 1] === 1 )  {

          ctx.fillStyle = color;                                                                    //    Improvements:   Color of active brick

          ctx.fillRect((x + j) * pixels , (y + i) * pixels , pixels - 1 , pixels - 1 )  }}}}





  set(score) {

    const set = document.getElementById("score");

    set.innerHTML = "Score: " + score;  }





  gameover()  {

    for (let i = -1; i < 2; i++)  {

      for (let j = -1; j < 2; j++) {

        if ( this.tetris.y === this.startdown   &&    this.tetris.Positions[this.tetris.Position][i + 1][j + 1] === 1    &&    this.original[this.tetris.y + i + 1][this.tetris.x + j] === true )   {

          clearInterval(this.count);

          clearInterval(this.update);

          this.tetris = null;

          this.active = false;



          this.drawc(this.pixels);

          var gameButton = document.createElement('div');

          gameButton.id = "gameover";

          gameButton.innerHTML += "Game Over";

          // container[0].appendChild(gameButton);

          head[0].appendChild(gameButton);

          return    }}}}}





















///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
//////////            TETRIS   CLASSES              ///////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////





const shapesArray =   [

  class L   {

    Position = 0;
    Potential = 1;
    Positions  =

    [ [ [0, 1, 0] ,
        [0, 1, 0] ,
        [0, 1, 1] ] ,
        //  L [0]

      [ [0, 0, 0] ,
        [1, 1, 1] ,
        [1, 0, 0] ] ,
        //  L [1]

      [ [0, 0, 0] ,
        [1, 0, 0] ,
        [1, 1, 1] ] ,
        //  L [1]

      [ [1, 1, 0] ,
        [0, 1, 0] ,
        [0, 1, 0] ] ];
        //  L [2]

      constructor (y , x , w , h)   {

        this.y = y;
        this.x = x;
        this.w = w;
        this.h = h;     }} ,



  class F   {

    Position = 0;
    Potential = 1;
    Positions  =

    [ [ [0, 1, 0] ,
        [0, 1, 0] ,
        [1, 1, 0] ] ,
        //  F [0]

      [ [0, 0, 0] ,
        [1, 1, 1] ,
        [0, 0, 1] ] ,
        //  F [1]

      [ [0, 0, 0] ,
        [0, 0, 1] ,
        [1, 1, 1] ] ,
        //  L [1]

      [ [0, 1, 1] ,
        [0, 1, 0] ,
        [0, 1, 0] ] ];
        //  F [2]

      constructor (y , x , w , h)   {

        this.y = y;
        this.x = x;
        this.w = w;
        this.h = h;     }} ,



  class O   {

    Position = 0;
    Potential = 1;
    Positions  =

    [ [ [1, 1, 0] ,
        [1, 1, 0] ,
        [0, 0, 0] ] ,
        //  O [0]

      [ [1, 1, 0] ,
        [1, 1, 0] ,
        [0, 0, 0] ] ,
        //  O [1]

      [ [1, 1, 0] ,
        [1, 1, 0] ,
        [0, 0, 0] ] ];
        //  O [2]

      constructor (y , x , w , h)   {

        this.y = y;
        this.x = x;
        this.w = w;
        this.h = h;     }} ,



  class Z   {

    Position = 0;
    Potential = 1;
    Positions  =

    [ [ [1, 1, 0] ,
        [0, 1, 1] ,
        [0, 0, 0] ] ,
        //  Z [0]

      [ [1, 0, 0] ,
        [1, 1, 0] ,
        [0, 1, 0] ] ,
        //  Z [1]



      [ [0, 1, 0] ,
        [1, 1, 0] ,
        [1, 0, 0] ] ];
        //  Z [2]

      constructor (y , x , w , h)   {

        this.y = y;
        this.x = x;
        this.w = w;
        this.h = h;     }} ,



  class S {

    Position = 0;
    Potential = 1;
    Positions  =

    [ [ [0, 1, 1] ,
        [1, 1, 0] ,
        [0, 0, 0] ] ,
        //  S [0]

      [ [1, 0, 0] ,
        [1, 1, 0] ,
        [0, 1, 0] ] ,
        //  S [1]

      [ [0, 1, 0] ,
        [1, 1, 0] ,
        [1, 0, 0] ] ];
        //  S [2]

      constructor (y , x , w , h)   {

        this.y = y;
        this.x = x;
        this.w = w;
        this.h = h;     }} ,



  class I  {

    Position = 0;
    Potential = 1;
    Positions  =

    [ [ [0, 1, 0] ,
        [0, 1, 0] ,
        [0, 1, 0] ] ,
        //  I [0]

      [ [0, 0, 0] ,
        [1, 1, 1] ,
        [0, 0, 0] ] ,
        //  I [1]

      [ [0, 1, 0] ,
        [0, 1, 0] ,
        [0, 1, 0] ] ];
        //  I [2]

      constructor (y , x , w , h)   {

        this.y = y;
        this.x = x;
        this.w = w;
        this.h = h;     }} ,



  class T {

    Position = 0;
    Potential = 1;
    Positions  =

    [ [ [0, 1, 0] ,
        [1, 1, 1] ,
        [0, 0, 0] ] ,
        //  T [0]

      [ [1, 0, 0] ,
        [1, 1, 0] ,
        [1, 0, 0] ] ,
        //  T [1]

      [ [0, 0, 0] ,
        [1, 1, 1] ,
        [0, 1, 0] ] ,
        //  T [2]

      [ [0, 1, 0] ,
        [1, 1, 0] ,
        [0, 1, 0] ] , ];
        //  T [1]

      constructor (y , x , w , h)   {

        this.y = y;
        this.x = x;
        this.w = w;
        this.h = h;     }} ,    ];













//////////////////////////////////////////////////////////////////////////////////////
//  * This is a reducer - a function that takes a current state value & an          //
//  * action object describing "what happened", then returns a new state value.     //
//  * A reducer's function signature is: (state, action) => newState                //
//  *                                                                               //
//  * The Redux state should contain only plain JS objects, arrays, and primitives. //
//  * The root state value is usually an object. It's important that you should     //
//  * not mutate the state object, but return a new object if the state changes.    //
//  *                                                                               //
//  * You can use any conditional logic you want in a reducer. In this example,     //
//  * we use a switch statement, but it's not required.                             //
// ///////////////////////////////////////////////////////////////////////////////////






