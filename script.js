document.addEventListener("DOMContentLoaded", ()=>{
    let controls = document.querySelector(".controls");
    let control = document.querySelector("header span");
    let body = document.querySelector("body");
    control.addEventListener("click", ()=>{
        controls.style.transition = "visibility 300ms ease, opacity 300ms ease";
        if (controls.style.display === "none") {
            controls.style.display = "block";
            setTimeout(()=>{
                controls.style.visibility = "visible";
                controls.style.opacity = "1";
            }, 100);
        } else {
            controls.style.visibility = "hidden";
            controls.style.opacity = "0";
            setTimeout(()=>{
                controls.style.display = "none";
            }, 300);
        }
    });

    body.addEventListener("click", (event)=>{
        if (!controls.contains(event.target) && event.target !== control) {
            controls.style.visibility = "hidden";
            controls.style.opacity = "0";
            setTimeout(()=>{
                controls.style.display = "none";
            }, 300);
        }
    });

    let canvas = document.querySelector("canvas");
    let ctx = canvas.getContext("2d")
    let main = document.querySelector("main")

    ResizeCanvas = ()=>{
        canvas.width = main.clientWidth
        canvas.height = main.clientHeight
    };
    ResizeCanvas();
    window.addEventListener("resize", ResizeCanvas)

    const arrowheight = 30;
    const arrowwidth = 30;
    let T = parseFloat(document.querySelector("#temp").value) + 1e-8;
    let J = parseInt(document.querySelector("#material").value);
    DrawArrow = (ctx, x, y, spin)=>{
        ctx.lineWidth = 5;
        
        if (spin === 1) {
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, (y + arrowheight));
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo((x - (arrowwidth/2)), (y + (arrowheight/2)))
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo((x + (arrowwidth/2)), (y + (arrowheight/2)))
            ctx.stroke();
        }
        else{
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, (y + arrowheight));
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x, (y + arrowheight));
            ctx.lineTo((x - (arrowwidth/2)), (y + (arrowheight/2)))
            ctx.stroke();
    
            ctx.beginPath();
            ctx.moveTo(x, (y + arrowheight));
            ctx.lineTo((x + (arrowwidth/2)), (y + (arrowheight/2)))
            ctx.stroke();
        }
    };

    let lattice = new Array();
    let nrows = Math.floor(canvas.height/arrowheight);
    let ncolumns = Math.floor(canvas.width/arrowwidth);
    for (let i = 0; i < nrows; i++) {
        let row = new Array();
        for (let j = 0; j < ncolumns; j++) {
            let rnd = Math.random();
            if (rnd < 0.5) {
                row.push(1);
            } else {
                row.push(-1);
            }
        }
        lattice.push(row);
    }

    CalcMag = ()=>{
        let M = 0;
        lattice.forEach(row => {
            row.forEach(spin => {
                M += spin;
            });
        });
        return M;
    };

    DrawSpins = ()=>{
        let yval = 0;
        lattice.forEach(row => {
            let xval = (arrowwidth/2);
            row.forEach(spin => {
                DrawArrow(ctx, xval, yval, spin);
                xval += arrowwidth;
            });
            yval += arrowheight;
        });
    };
    let display = document.querySelector("#display");
    display.textContent = (CalcMag()/(nrows*ncolumns)).toFixed(2);

    DrawSpins();
    animate = ()=>{
        T = parseFloat(document.querySelector("#temp").value) + 1e-8;
        J = parseInt(document.querySelector("#material").value);
        let row = Math.floor(Math.random()*nrows);
        let column = Math.floor(Math.random()*ncolumns);
        let dE = ((2*J)*lattice[row][column])*((lattice[((row - 1) + nrows)%nrows][column] + lattice[(row + 1)%nrows][column]) + (lattice[row][((column - 1) + ncolumns)%ncolumns] + lattice[row][(column + 1)%ncolumns]));
        if (dE <= 0) {
            lattice[row][column] *= -1;
        }
        else {
            let rnd2 = Math.random();
            if (rnd2 < Math.exp(-(dE)/T)) {
                lattice[row][column] *= -1;
            }
        }
        display = document.querySelector("#display");
        display.textContent = `Magnetization: ${(CalcMag()/(nrows*ncolumns)).toFixed(2)}`;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        DrawSpins();
        requestAnimationFrame(animate);
    };
    animate();
})