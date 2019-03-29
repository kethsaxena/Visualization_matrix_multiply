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


 function updateBuffer(){

    let rows = d3.select("#n").property("value");
    let cols = d3.select("#m").property("value");
    let pols = d3.select("#p").property("value");
    

    d=createBuffer(cols,rows,50,50,30,0)
      .concat(createBuffer(cols,pols,50,100,30,50))
      .concat(createBuffer(pols,rows,50,150,30,50))

    update2= svg2.selectAll("rect")
    .data(d)
    
    update2.enter()
    .append("rect")
    .merge(update2)
    .attr("x",function(d,i){return d.x })
    .attr("y",function(d,i){return d.y })
    .attr("width","20")
    .attr("height","20")
    .attr("fill","white")
    .attr("stroke","black");


   
    d=["A","B","C"];


    svg2.selectAll("text").data(d).enter().append("text")
    .attr("fill","black")
    .attr("x","55")
    .attr("y",function(d,i){return (i*50)+65 })
    .text(function(d){return d});


   
    update2.exit()
    .remove()

    
};



function createBuffer(N,M,xstr,ystr,xspace,yspace){
    var data= [];

    var xstr=xstr,ystr=ystr,ycord,xcord;
    ycord=ystr;
    for(var i=0;i<1;i++){
        xcord=xstr; 
    
        for (var j = 0; j <((N*M)+1); j++) {
        
        data.push({x:xcord, y:ycord});
        xcord+=xspace;
        }
        
        ycord+=yspace;
 
    }

    return data;

   
}



updateBuffer(); 
updateMatrix();


function play() {
    var t = d3.interval(function(elapsed) {
        // console.log(elapsed);
        step();
        if (elapsed > 100000) t.stop();
        },2000);
}



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




function step(){
    
let rows = d3.select("#n").property("value");
let cols = d3.select("#m").property("value");
let pols = d3.select("#p").property("value");

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
        .duration(1000)
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

