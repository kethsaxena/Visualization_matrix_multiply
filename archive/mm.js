//CANVAS VARIABLES 
var svg_width=20000;
var svg_height=400;

//BETWEEN ELEMENTS 
var Xspacing=20;
var Yspacing=20;
var radius=5;


//sliders
d3.select("#n").on("input",function(){updateMatrix(+this.value);});
d3.select("#m").on("input",function(){updateMatrix(+this.value);});
d3.select("#p").on("input",function(){updateMatrix(+this.value);});


//button

var b_step=d3.select("body")
.append("button").text("Step").attr("value",10).attr("id","b_step")
.on("click", step);

d3.select("body").append("button").text("Play").on("click", play);

//CREATE INITIAL SVG
var svg = d3.select("body")
.append("svg")
.attr("width", svg_width)
.attr("height", svg_height);


var svg2 = d3.select("body")
.append("svg")
.attr("width", svg_width)
.attr("height", 300);



updateBuffer(); 
updateMatrix();


function play() {
    var t = d3.interval(function(elapsed) {
        // console.log(elapsed);
        step();
        if (elapsed > 100000) t.stop();
        },1000);
}




function step(){
    
    let rows = d3.select("#n").property("value");
    let cols = d3.select("#m").property("value");
    let pols = d3.select("#p").property("value");
    let xspace=11;
    
    d3.select("#n-value").text(rows);
    d3.select("#m-value").text(cols);
    d3.select("#p-value").text(pols);
    
    
    
    var matA= createData(rows,cols,10,1); 
    
    var wedge=cols*(2*radius+Xspacing);
    var matB= createData(cols,pols,wedge,2);
    
    wedge=(Math.log(cols*pols)*10)*(radius+(Xspacing));
    var matC= createData(rows,pols,wedge,3);
    
    var data=matA.concat(matB).concat(matC);
    drawMat2(data,rows,cols,pols);

    
    highlight_buffer(createBuffer(cols,rows,50,50,xspace,0)
    .concat(createBuffer(cols,pols,50,100,xspace,50))
    .concat(createBuffer(pols,rows,50,150,xspace,50)));
    


    
    }
    
    var i=0,BcolCount=1,ArowCount=1;
    var stepX=10;
       
    function drawMat2(matrix,rows,cols,pols){
    
        //MATRIX A 
        
        // console.log(stepX,ArowCount,rows);
    
        // let stepX=parseInt(d3.select("#b_step").property("value"));
    
        let stepY=(i*2*10)+(cols*(2*radius+Xspacing));
        let stepCx=(i*2*10)+(Math.log(cols*pols)*10)*(radius+(Xspacing));
        // console.log(stepCx);
        
        update = svg
        .selectAll('circle')
        .data(matrix)
    
            
        update.enter()
            .append('circle')
            .merge(update)
            .attr('cx',function(d){return d.x})
            .attr('cy',function(d){return d.y})
            .attr('r',radius)
            .attr('fill',"grey")
            .attr('stroke',"white")
            .attr('stroke-width',1)
            
        update.filter(function(d,i) {if(d.y == stepX & d.type==1) {return d} 
            else if (d.x == stepY & d.type==2) {return d} 
            else if (d.type==3 & d.x==stepCx & d.y==stepX) {return d}}) 
            .transition()
                .attr('r', 7)
                .style("fill", "red")
                .duration(500)
            .transition()
                .attr('r', radius)
                .style("fill", "grey")
                .duration(500)
            
            
            
            
        update.exit()
            .remove()
        
        i+=1;
        BcolCount+=1;
        ArowCount+=1;
        if (BcolCount<=pols)
        {
            stepX=stepX;
        }
        else{
            stepX+=Yspacing;
            BcolCount=1;
            
            if(ArowCount>rows*pols)
            {
                stepX=10;
                ArowCount=1;
            };
    
        };
            
    
        if(stepY>=(cols*(2*radius+Xspacing)+Xspacing*(pols-1))){
            i=0;
            
        }
    
        b_step=d3.select("#b_step").attr("value",stepX)
    
    
    };
    
    


function updateMatrix(){

let rows = d3.select("#n").property("value");
let cols = d3.select("#m").property("value");
let pols = d3.select("#p").property("value");
    

d3.select("#n-value").text(rows);
d3.select("#m-value").text(cols);
d3.select("#p-value").text(pols);

updateBuffer(); 

var matA= createData(rows,cols,10,1);
// console.log(matA);
// .concat(createData(rows,rows,25))
// .concat(createData(rows,rows,55));
var wedge=cols*(2*radius+Xspacing);
var matB= createData(cols,pols,wedge,2);

wedge=(Math.log(cols*pols)*10)*(radius+(Xspacing));
var matC= createData(rows,pols,wedge,3);

var data=matA.concat(matB).concat(matC)
drawMat(data);





};

function createData(N,M,str,iter){
    var data= [];

    var xstr=str,ystr=10,ycord,xcord;
    ycord=ystr;
    for(var i=0;i<N;i++){
        xcord=xstr; 
    
        for (var j = 0; j <M; j++) {
        
        data.push({x:xcord, y:ycord,type:iter});
        xcord+=Xspacing;
        }
        
        ycord+=Yspacing;
 
    }

    return data;

   
}




function drawMat(matrix){
// console.log(matrix)
update = svg
    .selectAll('circle')
    .data(matrix)

    
update.enter()
    .append('circle')
    .merge(update)
    .attr('cx',function(d){return d.x})
    .attr('cy',function(d){return d.y})
    .attr('r',radius)
    .attr('fill',"grey")
    .attr('stroke',"white")
    .attr('stroke-width',1)
    
update.exit()
     .remove()

    

};




//BUFFER FUNCTIONS 

function createBuffer(N,M,xstr,ystr,xspace,yspace){
    var data= [];

    var xstr=xstr,ystr=ystr,ycord,xcord;
    ycord=ystr;
    for(var i=0;i<1;i++){
        xcord=xstr; 
    
        for (var j = 0; j <((N*M)); j++) {
        
        data.push({x:xcord, y:ycord});
        xcord+=xspace;
        }
        
        ycord+=yspace;
 
    }

    return data;

   
}


 function updateBuffer(){

    let rows = d3.select("#n").property("value");
    let cols = d3.select("#m").property("value");
    let pols = d3.select("#p").property("value");
    let xspace=11;
    rad_small=4;

    d=createBuffer(cols,rows,50,50,xspace,0)
      .concat(createBuffer(cols,pols,50,100,xspace,50))
      .concat(createBuffer(pols,rows,50,150,xspace,50))

    update2= svg2.selectAll("circle")
    .data(d)
    
    update2.enter()
    .append("circle")
    .merge(update2)
    .attr("cx",function(d,i){return d.x })
    .attr("cy",function(d,i){return d.y })
    .attr("r",rad_small)
    .attr("fill","white")
    .attr("stroke","black")
    
    
    
    // d=[1,2]

    
    // update2= svg2.selectAll("circle")
    // .data(d)
    
    // update2.enter()
    // .append("circle")
    // .merge(update2)
    // .transition()
    //     .attr('r', 5)
    //     .style("fill", "red")
    //     .duration(500)
    // .transition()
    //     .attr('r', rad_small)
    //     .style("fill", "grey")
    //     .duration(500);
    


   
     d=["A","B","C"];

    
    update3=svg2
    // .selectAll("text")
    .selectAll("rect")
    .data(d)

    update3
    .enter()
    .append("rect")
        .attr("x","20")
        .attr("y",function(d,i){return (i*50)+40 })
        .attr("width","20")
        .attr("height","20")
        .attr("fill","white")
        .attr("stroke","black")
    
    
    update4=svg2.selectAll("text")
    .data(d)
    .enter()
    .append("text")
        .attr("fill","black")
        .attr("x","25")
        .attr("y",function(d,i){return (i*50)+55 })
        .text(function(d){return d});
    
   

    // d=createBuffer(1,2,50,50,xspace,0);
    
    // svg2.selectAll("rect")
    // .data(d)
    // .enter()
    // .transition()
    //     .attr('r', 5)
    //     .style("fill", "red")
    //     .duration(500)
    // .transition()
    //     .attr('r', rad_small)
    //     .style("fill", "grey")
    //     .duration(500)
    

    
    update2.exit()
    .remove()

    update3.exit()
    .remove()
   
    
};


var acounter=1,bcounter=1,ccounter=1,Acolcounter=1;
var axcord=50,bxcord=50,cxcord=50;
var Aa=0,Ab=parseInt(d3.select("#m").property("value"));
var Ba=parseInt(d3.select("#n").property("value"))*parseInt(d3.select("#m").property("value"));
function highlight_buffer(data)
{
    
    let rows = parseInt(d3.select("#n").property("value"));
    let cols = parseInt(d3.select("#m").property("value"));
    let pols = parseInt(d3.select("#p").property("value"));
    let xspace=11;
    rad_small=4;

    update2= svg2.selectAll("circle")
    .data(data)
    
    update2.enter()
    .append("circle")
    .merge(update2)
    .attr("cx",function(d,i){return d.x })
    .attr("cy",function(d,i){return d.y })
    .attr("r",rad_small)
    .attr("fill","white")
    .attr("stroke","black")

    // MATRIX A
    
    update2
    .filter(function(d,i) {if(i<Ab & i>=Aa & d.y==50) {return d}})
    .transition()
        .attr('r', 5)
        .style("fill", "red")
        .duration(500)
    .transition()
        .attr('r', rad_small)
        .style("fill", "white")
        .duration(500);
     
    acounter+=1;
    Acolcounter+=1;
    
    // console.log(rows)
    if(acounter>=(rows*pols)){Aa=0,Ab=cols,acounter=1}
    else{
        if(Acolcounter<=pols){Aa+=0;Ab+=0;}
        else{
        Acolcounter=1;
        Aa+=cols;
        Ab+=cols;
        }
    
    }


    // //MATRIX B
    
    // if(bcounter>(pols)||bcounter==1){Aa=rows*cols,Ab=2,acounter=1}
    // else{Aa+=parseInt(cols);
    //     Ab+=parseInt(cols);} (cols*(rows+pols))

     
    // console.log((parseInt(cols)*(parseInt(rows+pols))))
    // console.log((rows*cols)+(cols*pols));
    // console.log((cols*(rows+pols))-1);
    

    update2
    .filter(function(d,i) {
        if((i==Ba || i==Ba+4) & d.y==100) {return d}

        else if((i==Ba || i==Ba+4) & d.y==100){return d}
    
    })
    .transition()
        .attr('r', 5)
        .style("fill", "red")
        .duration(500)
    .transition()
        .attr('r', rad_small)
        .style("fill", "white")
        .duration(500);
    console.log(bcounter);
    bcounter+=1;
    if(bcounter>(pols)){Ba=rows*cols,bcounter=1}
    else{Ba+=1} 
    


    ccounter+=1;
    //C MATRIX
    update2
    .filter(function(d,i) {if(d.x==cxcord & d.y==150) {return d}})
    .transition()
        .attr('r', 5)
        .style("fill", "red")
        .duration(500)
    .transition()
        .attr('r', rad_small)
        .style("fill", "white")
        .duration(500);

    
    if(ccounter>(rows*pols)){cxcord=50,ccounter=1}
    else{cxcord+=xspace}

    
    update2.exit()
    .remove()
    


   

    // svg2
    // .selectAll("circle")
    // .filter(function(d,i) {if(i<15*2) {return d}})
    // .transition()
    //     .attr('r', 5)
    //     .style("fill", "red")
    //     .duration(500)
    // .transition()
    //     .attr('r', rad_small)
    //     .style("fill", "grey")
    //     .duration(500);

};
