class World {
    constructor(ctx, minor) {
        //this.grid = new Array(41).fill(new Array(41).fill(0)); Don't do this again: it made an array of references to a single other array
        this.grid = new Array(41).fill(0).map(() => new Array(41).fill(0));
        this.changedCells = [];
        this.colors = ["black", "red", "yellow", "blue"];
        this.minor = minor || 10;
        this.ctx = ctx || null;
    }
    redrawCell(x, y) {
        //console.log(this.grid[x][y]);
        fill_square(this.ctx, x, y, this.colors[this.grid[x][y]], this.minor);
    }
    nextState(x, y) {
        //console.log(this.grid)
        this.grid[x][y] = this.grid[x][y] + 1;
        if (this.grid[x][y] >= this.colors.length) {
            this.grid[x][y] = 0;
        }
        this.redrawCell(x, y);
    }
    /*	updateCanvas() - DEPRECATED
        {
            for (let i = 0; i < this.changedCells.length; i++)
            {
                let cell : Array<number> = this.changedCells[i];
                this.redrawCell(cell[0], cell[1]);
            }
        }*/
    getGridValue(x, y) {
        return this.grid[x][y];
    }
}
class Ant {
    constructor(ctx, minor, world) {
        this.world = world;
        this.ctx = ctx;
        this.minor = minor;
        this.ruleset = [1, 1, 0, 0];
        this.pos = [20, 20];
        this.heading = 'E';
    }
    logStatus() {
        console.log(this.pos.toString() + this.heading + this.world.grid[this.pos[0]][this.pos[1]]);
    }
    getHeading() {
        if (this.heading === 'N') {
            return [0, -1]; // quirk of coordinate system
        }
        else if (this.heading === 'S') {
            return [0, 1];
        }
        else if (this.heading === 'E') {
            return [1, 0];
        }
        else if (this.heading === 'W') {
            return [-1, 0];
        }
    }
    next() {
        // turn, increment, move
        this.turn(); // turn ant based on the ruleset of the current position
        this.world.nextState(this.pos[0], this.pos[1]);
        this.moveForward();
        this.draw();
    }
    moveForward() {
        //console.log(this.pos[0],this.pos[1]);
        this.pos[0] += this.getHeading()[0];
        this.pos[1] += this.getHeading()[1];
    }
    turn() {
        let x = this.pos[0];
        let y = this.pos[1];
        //console.log(this.heading);
        var bool = this.ruleset[this.world.getGridValue(x, y)];
        // turn right if bool is true
        // bool is true when the ruleset is 0
        if (this.heading === 'N') {
            this.heading = bool ? 'W' : 'E';
        }
        else if (this.heading === 'S') {
            this.heading = bool ? 'E' : 'W';
        }
        else if (this.heading === 'E') {
            this.heading = bool ? 'N' : 'S';
        }
        else if (this.heading === 'W') {
            this.heading = bool ? 'S' : 'N';
        }
    }
    draw() {
        function vec_avg(a, b) {
            return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        }
        // TODO: fix these, the names do NOT correspond to their locations
        var uleft = grid_position(this.minor, [this.pos[0], this.pos[1] + 1]);
        var bleft = [uleft[0], uleft[1] - this.minor];
        var uright = [uleft[0] + this.minor, uleft[1]];
        var bright = [uleft[0] + this.minor, uleft[1] - this.minor];
        var top = vec_avg(uleft, uright);
        var bottom = vec_avg(bleft, bright);
        var left = vec_avg(uleft, bleft);
        var right = vec_avg(uright, bright);
        if (this.heading === 'N') {
            this.draw_triangle(bottom, uleft, uright);
        }
        else if (this.heading === 'S') {
            this.draw_triangle(top, bleft, bright);
        }
        else if (this.heading === 'E') {
            this.draw_triangle(right, uleft, bleft);
        }
        else if (this.heading === 'W') {
            this.draw_triangle(left, uright, bright);
        }
    }
    draw_triangle(p1, p2, p3) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(p1[0], p1[1]);
        this.ctx.lineTo(p2[0], p2[1]);
        this.ctx.lineTo(p3[0], p3[1]);
        this.ctx.closePath();
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.restore();
    }
}
function grid_position(rminor, gridPos) {
    return [rminor * gridPos[0], rminor * gridPos[1]];
}
function fill_square(ctx, grid_x, grid_y, color, rminor) {
    ctx.save();
    ctx.fillStyle = color;
    var real_pos = grid_position(rminor, [grid_x, grid_y]);
    ctx.fillRect(real_pos[0], real_pos[1], rminor, rminor);
    ctx.restore();
}
function sleep(ms) {
    // https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
    // TODO: Maybe change to requestAnimationFrame?
    return new Promise(resolve => setTimeout(resolve, ms));
}
/* Previously used for debugging
let numTests : number = 0;
function expect(output, expected)
{
    output = (typeof output === typeof []) ? output.toString() : output;
    expected = (typeof expected === typeof []) ? expected.toString() : expected;
    let test : number = numTests + 1;
    if (output == expected)
    {
        console.log("Test #" + test + ": successful! (" +expected+","+output+")");
    } else
    {
        console.log("Test #" + test + ": Expected " + expected + " but instead received " + output);
    }
    numTests++;
}

function tests(ant : Ant, world : World)
{
    expect(world.grid[20][20], 0);
    expect(ant.pos, [20,20]);
    expect(ant.heading, 'E');
    expect(ant.getHeading(), [1,0]);
}


async function main(ctx : CanvasRenderingContext2D, minor : number)
{
    fill_square(ctx, 0, 0, "white", 410);
    var world = new World(ctx, minor);
    var ant = new Ant(ctx, minor, world);
//	tests(ant,world)
    ant.next();
    var passes = 0; // TODO: make a property of Ant?
    while(true){
        ant.next();
        document.getElementById("h1").innerHTML = "Passes: " + passes;
        passes++;
        await sleep(1);
    }
}*/ 
//# sourceMappingURL=cella.js.map