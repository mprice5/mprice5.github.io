function onLoadBody() {
    $('.side-nav').css("margin-top","0");
}

// $(window).scroll(function() {
//     var height = $(window).scrollTop();
//     var section1 = $("#overview").scrollTop();
//     var section2 = $("#highlight").scrollTop();
//     var section3 = $("#profile1").scrollTop();
//     var overview = $("#Personal-Characteristics").scrollTop();
//     var overview = $("#International-Presence").scrollTop();
//     var overview = $("#Professional-Profile").scrollTop();
//     var overview = $("#Profile-by-Region").scrollTop();
//     var section4 = $("#profile2").scrollTop();
//     var overview = $("#Experience-with-Node").scrollTop();
//     var overview = $("#Development-Focus").scrollTop();
//     var overview = $("#Profile-by-Development-Area").scrollTop();
//     var overview = $("#Where-Deploy-Code").scrollTop();
//     var overview = $("#Types-of-Development-Work").scrollTop();
//     var overview = $("#Tools-Technologies-Used").scrollTop();
//     var overview = $("#Correlated-Technologies").scrollTop();
//     var overview = $("#Transpilers-and-Bundlers").scrollTop();
//     var overview = $("#Primary-OS-Distro").scrollTop();
//     var section5 = $("#language").scrollTop();
//     var overview = $("#Languages-Used").scrollTop();
//     var overview = $("#Expected-Change-In-Node-Usage").scrollTop();
//     var overview = $("#Expected-Change-In-Other-Languages").scrollTop();
//     var section6 = $("#package").scrollTop();
//     var overview = $("#Package-Manager-Usage").scrollTop();
//     var overview = $("#Managing-Different-Packages").scrollTop();
//     var overview = $("#Availability-of-Multiple-Registries").scrollTop();
//     var overview = $("#learning").scrollTop();
//     var overview = $("#Informal-Education").scrollTop();
//     var overview = $("#How-Learned-Node").scrollTop();
//     var overview = $("#Ease-of-Learning-Node").scrollTop();
//     var overview = $("#Learning-Resources").scrollTop();
//     var overview = $("#Resources-Used").scrollTop();
//     var overview = $("#version").scrollTop();
//     var overview = $("#Version-Managers").scrollTop();
//     var overview = $("#Release-Line").scrollTop();
//     var overview = $("#LTS-Support").scrollTop();
//     var overview = $("#Understanding-Newer-Node-Users").scrollTop();
//     var overview = $("#impact").scrollTop();
//     var overview = $("#Words-to-Describe-Node").scrollTop();
//     var overview = $("#Business-Impact").scrollTop();
//     if($height > 50) {
        
//     }
// });

$(function() {
    var navflag = false;
  $( '.main-nav li' ).on( 'click', function() {
    if ($( this ).children('.sub-nav').length) {
        if ($( this ).children('.sub-nav').css("display") == "block") {
            if (navflag) {
                navflag = false;
            } else {
                $( this ).children('.sub-nav').css("display","none");
            }
            return;
        } 
        $( this ).parent().find( 'li.active' ).children('.sub-nav').css("display","none");
        $( this ).parent().find( 'li.active' ).removeClass( 'active');
        $( this ).addClass( 'active' );
        $( this ).children('.sub-nav').css("display","block");
        $( this ).children('.sub-nav').children(":first").addClass('active');
    } else {
        $( this ).parent().find( 'li.active' ).children('.sub-nav').css("display","none");
        $( this ).parent().find( 'li.active' ).removeClass( 'active' );
        $( this ).addClass( 'active' );
        navflag = true;
    }
  });
  $( '.back-to-top li' ).on( 'click', function() {
    $( ".main-nav" ).find( 'li.active' ).children('.sub-nav').css("display","none");
    $( ".main-nav" ).find( 'li.active' ).removeClass( 'active' );
  });
});

var tooltip = d3.select("body").append("div").attr("class", "toolTip");

//set up svg using margin conventions - we'll need plenty of room on the left for labels
var margin = {
    top: 15,
    right: 35,
    bottom: 15,
    left: 300
};

function createChart(strid,paramWidth, paramHeight, data , tooltipdata) {
    console.log(data);
    var width = paramWidth - margin.left - margin.right,
    height = paramHeight - margin.top - margin.bottom;

var svg = d3.select(strid).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
    .range([0, width])
    .domain([0, d3.max(data, function (d) {
        if (d.value == "<1") return 0.5;
        else return d.value;
    })]);

var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .7)
    .domain(data.map(function (d) {
        return d.name;
    }));

//make y axis to show bar names
var yAxis = d3.svg.axis()
    .scale(y)
    //no tick marks
    .tickSize(0)
    .orient("left");

var gy = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

var bars = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("g")

//append rects
bars.append("rect")
    .attr("class", "bar")
    .attr("y", function (d) {
        return y(d.name);
    })
    .attr("height", y.rangeBand())
    .attr("x", 0)
    .attr("width", function (d) {
        if (d.value == "<1") return x(0.5);
        else return x(d.value);
    })
    .on("mousemove", function(d){
        if (tooltipdata == 0) return;
        for (var i = tooltipdata.length - 1; i >= 0; i--) {
            if(d.name == tooltipdata[i].name) {
                if (tooltipdata[i].value == 0) {
                    tooltip
                        .style("left", d3.event.pageX - 30 + "px")
                        .style("top", d3.event.pageY - 30 + "px")
                        .style("display", "inline-block")
                        .html("decrease from previous year");    
                } else {
                    tooltip
                        .style("left", d3.event.pageX - 30 + "px")
                        .style("top", d3.event.pageY - 30 + "px")
                        .style("display", "inline-block")
                        .html("increase from previous year"); 
                }
            } 
        }
    })
    .on("mouseout", function(d){ tooltip.style("display", "none");});

// svg.append("g")
//    .attr("transform", "translate(0, "+y(yPos)+")")
//    .append("line")
//    .attr("x2", width)
//    .style("stroke", "#000")
//    .style("stroke-width", "2px")

//add a value label to the right of each bar
bars.append("text")
    .attr("class", "label")
    //y position of the label is halfway down the bar
    .attr("y", function (d) {
        return y(d.name) + y.rangeBand() / 2 + 4;
    })
    //x position is 3 pixels to the right of the bar
    .attr("x", function (d) {
        if (d.value == "<1") return x(0.5) + 5;
        else return x(d.value) + 5;
    })
    .text(function (d) {
        return d.value + d.unit;
    });
}

function onCapture1_1(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 106 && event.offsetX < 142 && event.offsetY > 96 && event.offsetY < 205) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 106 && event.offsetX < 142 && event.offsetY > 205 && event.offsetY < 280) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

margin.left = 150;
createChart("#tab7content", 500, 200 , tab7content , 0);

function onCapture2(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 82 && event.offsetX < 85 && event.offsetY > 266 && event.offsetY < 276) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 342 && event.offsetX < 395 && event.offsetY > 53 && event.offsetY < 60) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 342 && event.offsetX < 362 && event.offsetY > 89 && event.offsetY < 97) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 342 && event.offsetX < 354 && event.offsetY > 164 && event.offsetY < 170) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 342 && event.offsetX < 345 && event.offsetY > 267 && event.offsetY < 273) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture3(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 126 && event.offsetX < 163 && event.offsetY > 78 && event.offsetY < 104) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 404 && event.offsetX < 458 && event.offsetY > 311 && event.offsetY < 331) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 457 && event.offsetX < 563 && event.offsetY > 314 && event.offsetY < 331) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 692 && event.offsetX < 742 && event.offsetY > 314 && event.offsetY < 331) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

margin.left = 300;
createChart("#tab10_1_1content", 600, 250 , tab10_1_1content , 0);
createChart("#tab10_1_2content", 600, 250 , tab10_1_2content , tab10_1_2contenttp);
createChart("#tab10_1_3content", 600, 250 , tab10_1_3content , tab10_1_3contenttp);
createChart("#tab10_1_4content", 600, 250 , tab10_1_4content , 0);

createChart("#tab10_2_1content", 600, 250 , tab10_2_1content , 0);
createChart("#tab10_2_2content", 600, 250 , tab10_2_2content , 0);
createChart("#tab10_2_3content", 600, 250 , tab10_2_3content , tab10_2_3contenttp);
createChart("#tab10_2_4content", 600, 250 , tab10_2_4content , 0);

function onCapture5(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 152 && event.offsetX < 187 && event.offsetY > 71 && event.offsetY < 172) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html("<i>Especially. . .<li>APAC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 56%</li><li>&lt100 ee's 48%</li></i>");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture6(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 223 && event.offsetX < 400 && event.offsetY > 82 && event.offsetY < 92) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

margin.left = 200;
createChart("#tab13_1content", 600, 400 , tab13_1content , tab13_1contenttp);
createChart("#tab13_2content", 600, 400 , tab13_2content , 0);
createChart("#tab13_3content", 600, 400 , tab13_3content , tab13_3contenttp);
createChart("#tab13_4content", 600, 400 , tab13_4content , 0);

margin.left = 300;
createChart("#tab14_1_1content", 600, 400 , tab14_1_1content , tab14_1_1contenttp);
createChart("#tab14_1_2content", 600, 400 , tab14_1_2content , 0);
createChart("#tab14_1_3content", 600, 400 , tab14_1_3content , 0);
createChart("#tab14_1_4content", 600, 400 , tab14_1_4content , tab14_1_4contenttp);

createChart("#tab14_2_1content", 600, 400 , tab14_2_1content , tab14_2_1contenttp);
createChart("#tab14_2_2content", 600, 400 , tab14_2_2content , 0);
createChart("#tab14_2_3content", 600, 400 , tab14_2_3content , 0);
createChart("#tab14_2_4content", 600, 400 , tab14_2_4content , tab14_2_4contenttp);

function onCapture8(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 226 && event.offsetX < 312 && event.offsetY > 167 && event.offsetY < 177) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 226 && event.offsetX < 246 && event.offsetY > 306 && event.offsetY < 316) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 226 && event.offsetX < 248 && event.offsetY > 353 && event.offsetY < 362) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 226 && event.offsetX < 230 && event.offsetY > 398 && event.offsetY < 409) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 713 && event.offsetX < 796 && event.offsetY > 165 && event.offsetY < 174) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 714 && event.offsetX < 728 && event.offsetY > 306 && event.offsetY < 316) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 714 && event.offsetX < 717 && event.offsetY > 396 && event.offsetY < 407) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

margin.left = 200;
createChart("#tab16_1_1content", 600, 400 , tab16_1_1content , 0);
createChart("#tab16_1_2content", 600, 400 , tab16_1_2content , 0);
createChart("#tab16_1_3content", 600, 400 , tab16_1_3content , tab16_1_3contenttp);
createChart("#tab16_1_4content", 600, 400 , tab16_1_4content , tab16_1_4contenttp);

createChart("#tab16_2_1content", 600, 400 , tab16_2_1content , tab16_2_1contenttp);
createChart("#tab16_2_2content", 600, 400 , tab16_2_2content , tab16_2_2contenttp);
createChart("#tab16_2_3content", 600, 400 , tab16_2_3content , tab16_2_3contenttp);
createChart("#tab16_2_4content", 600, 400 , tab16_2_4content , tab14_2_4contenttp);

margin.left = 200;
createChart("#tab17_1_1content", 600, 400 , tab17_1_1content , 0);
createChart("#tab17_1_2content", 600, 400 , tab17_1_2content , 0);
createChart("#tab17_1_3content", 600, 400 , tab17_1_3content , 0);
createChart("#tab17_1_4content", 600, 400 , tab17_1_4content , tab17_1_4contenttp);

createChart("#tab17_2_1content", 600, 400 , tab17_2_1content , tab17_2_1contenttp);
createChart("#tab17_2_2content", 600, 400 , tab17_2_2content , tab17_2_2contenttp);
createChart("#tab17_2_3content", 600, 400 , tab17_2_3content , tab17_2_3contenttp);
createChart("#tab17_2_4content", 600, 400 , tab17_2_4content , tab17_2_4contenttp);

margin.left = 200;
createChart("#tab18_1content", 600, 400 , tab18_1content , 0);
createChart("#tab18_2content", 600, 400 , tab18_2content , 0);
createChart("#tab18_3content", 600, 400 , tab18_3content , 0);
createChart("#tab18_4content", 600, 400 , tab18_4content , 0);

function onCapture11(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 165 && event.offsetX < 240 && event.offsetY > 167 && event.offsetY < 175) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("<b>3%</b> are Hobbyists only");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture12(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 270 && event.offsetX < 356 && event.offsetY > 300 && event.offsetY < 311) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 270 && event.offsetX < 300 && event.offsetY > 345 && event.offsetY < 355) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

margin.left = 200;
createChart("#tab19_1content", 600, 400 , tab19_1content , 0);
createChart("#tab19_2content", 600, 400 , tab19_2content , tab19_2contenttp);
createChart("#tab19_3content", 600, 400 , tab19_3content , 0);
createChart("#tab19_4content", 600, 400 , tab19_4content , tab19_4contenttp);

margin.left = 200;
createChart("#tab20_1content", 600, 300 , tab20_1content , tab20_1contenttp);
createChart("#tab20_2content", 600, 300 , tab20_2content , tab20_2contenttp);
createChart("#tab20_3content", 600, 300 , tab20_3content , tab20_3contenttp);
createChart("#tab20_4content", 600, 300 , tab20_4content , tab20_4contenttp);
createChart("#tab20_5content", 600, 300 , tab20_5content , tab20_5contenttp);
createChart("#tab20_6content", 600, 300 , tab20_6content , tab20_6contenttp);
createChart("#tab20_7content", 600, 300 , tab20_7content , tab20_7contenttp);

function onCapture15(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 118 && event.offsetX < 141 && event.offsetY > 158 && event.offsetY < 170) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 293 && event.offsetX < 377 && event.offsetY > 101 && event.offsetY < 110) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 293 && event.offsetX < 342 && event.offsetY > 158 && event.offsetY < 170) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

margin.left = 200;
createChart("#tab23_1_1content", 600, 400 , tab23_1_1content , tab23_1_1contenttp);
createChart("#tab23_1_2content", 600, 400 , tab23_1_2content , tab23_1_2contenttp);
createChart("#tab23_1_3content", 600, 400 , tab23_1_3content , 0);
createChart("#tab23_1_4content", 600, 400 , tab23_1_4content , 0);

createChart("#tab23_2_1content", 600, 400 , tab23_2_1content , tab23_2_1contenttp);
createChart("#tab23_2_2content", 600, 400 , tab23_2_2content , tab23_2_2contenttp);
createChart("#tab23_2_3content", 600, 400 , tab23_2_3content , 0);
createChart("#tab23_2_4content", 600, 400 , tab23_2_4content , 0);

margin.left = 200;
createChart("#tab24_1_1content", 600, 400 , tab24_1_1content , tab24_1_1contenttp);
createChart("#tab24_1_2content", 600, 400 , tab24_1_2content , 0);
createChart("#tab24_1_3content", 600, 400 , tab24_1_3content , 0);
createChart("#tab24_1_4content", 600, 400 , tab24_1_4content , tab24_1_4contenttp);

createChart("#tab24_2_1content", 600, 400 , tab24_2_1content , tab24_2_1contenttp);
createChart("#tab24_2_2content", 600, 400 , tab24_2_2content , 0);
createChart("#tab24_2_3content", 600, 400 , tab24_2_3content , 0);
createChart("#tab24_2_4content", 600, 400 , tab24_2_4content , tab24_2_4contenttp);

function onCapture18(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 106 && event.offsetX < 347 && event.offsetY > 69 && event.offsetY < 78) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 107 && event.offsetX < 141 && event.offsetY > 375 && event.offsetY < 387) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 718 && event.offsetX < 748 && event.offsetY > 208 && event.offsetY < 226) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("Up from 11% in ‘16");
    } else {
        tooltip.style("display", "none");
    }
}

margin.left = 200;
createChart("#tab27_1_1content", 600, 400 , tab27_1_1content , 0);
createChart("#tab27_1_2content", 600, 400 , tab27_1_2content , tab27_1_2contenttp);
createChart("#tab27_1_3content", 600, 400 , tab27_1_3content , tab27_1_3contenttp);
createChart("#tab27_1_4content", 600, 400 , tab27_1_4content , tab27_1_4contenttp);

createChart("#tab27_2_1content", 600, 400 , tab27_2_1content , tab27_2_1contenttp);
createChart("#tab27_2_2content", 600, 400 , tab27_2_2content , tab27_2_2contenttp);
createChart("#tab27_2_3content", 600, 400 , tab27_2_3content , tab27_2_3contenttp);
createChart("#tab27_2_4content", 600, 400 , tab27_2_4content , tab27_2_4contenttp);

function onCapture20(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 131 && event.offsetX < 153 && event.offsetY > 97 && event.offsetY < 219) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 214 && event.offsetX < 234 && event.offsetY > 96 && event.offsetY < 219) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("Up from 69% in ‘16");
    } else if (event.offsetX > 622 && event.offsetX < 644 && event.offsetY > 96 && event.offsetY < 219) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("Up from 71% in ‘16");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture21(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 158 && event.offsetX < 172 && event.offsetY > 106 && event.offsetY < 229) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 277 && event.offsetX < 292 && event.offsetY > 116 && event.offsetY < 229) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 90 + "px")
            .style("display", "inline-block")
            .html("Up from 66% in ‘16<br><i>Especially...<li>LatAm 85%</li><li>APAC 79%</li></i>");
    } else if (event.offsetX > 456 && event.offsetX < 471 && event.offsetY > 148 && event.offsetY < 230) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("Up from 42% in ‘16");
    } else if (event.offsetX > 811 && event.offsetX < 826 && event.offsetY > 192 && event.offsetY < 229) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html("Up from 14% in ‘16<br><i>Especially...<li>APAC 46%</li></i>");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture22(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 99 && event.offsetX < 112 && event.offsetY > 70 && event.offsetY < 176) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 266 && event.offsetX < 280 && event.offsetY > 79 && event.offsetY < 175) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 605 && event.offsetX < 617 && event.offsetY > 207 && event.offsetY < 263) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture24(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 60 && event.offsetX < 230 && event.offsetY > 90 && event.offsetY < 104) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 50 + "px")
            .style("display", "inline-block")
            .html("<i>Especially...<br><li>US/CA 64%</li></i>");
    } else if (event.offsetX > 61 && event.offsetX < 96 && event.offsetY > 152 && event.offsetY < 164) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 651 && event.offsetX < 782 && event.offsetY > 144 && event.offsetY < 155) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 651 && event.offsetX < 654 && event.offsetY > 198 && event.offsetY < 208) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 651 && event.offsetX < 654 && event.offsetY > 251 && event.offsetY < 261) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture25(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 169 && event.offsetX < 190 && event.offsetY > 95 && event.offsetY < 206) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 50 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 325 && event.offsetX < 347 && event.offsetY > 90 && event.offsetY < 206) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("Up from 36% in ‘16");
    } else if (event.offsetX > 562 && event.offsetX < 582 && event.offsetY > 101 && event.offsetY < 207) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("Up from 34% in ‘16");
    } else if (event.offsetX > 169 && event.offsetX < 190 && event.offsetY > 250 && event.offsetY < 276) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 246 && event.offsetX < 267 && event.offsetY > 250 && event.offsetY < 277) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 326 && event.offsetX < 347 && event.offsetY > 250 && event.offsetY < 272) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 561 && event.offsetX < 582 && event.offsetY > 250 && event.offsetY < 280) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 719 && event.offsetX < 740 && event.offsetY > 249 && event.offsetY < 261) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture27(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 267 && event.offsetX < 482 && event.offsetY > 72 && event.offsetY < 89) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 50 + "px")
            .style("display", "inline-block")
            .html("<i>Especially<li>Outside US/CA 41%</li></i>");
    } else if (event.offsetX > 266 && event.offsetX < 289 && event.offsetY > 153 && event.offsetY < 168) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 50 + "px")
            .style("display", "inline-block")
            .html("<i>Especially<li>APAC 9%</li></i>");
    } else if (event.offsetX > 267 && event.offsetX < 441 && event.offsetY > 359 && event.offsetY < 376) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 50 + "px")
            .style("display", "inline-block")
            .html("<i>Especially<li>APAC 36%</li></i>");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture28(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 129 && event.offsetX < 152 && event.offsetY > 144 && event.offsetY < 215) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 376 && event.offsetX < 398 && event.offsetY > 141 && event.offsetY < 214) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture29(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 119 && event.offsetX < 137 && event.offsetY > 81 && event.offsetY < 192) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 598 && event.offsetX < 615 && event.offsetY > 238 && event.offsetY < 242) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture30(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 140 && event.offsetX < 291 && event.offsetY > 130 && event.offsetY < 140) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 140 && event.offsetX < 277 && event.offsetY > 174 && event.offsetY < 184) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 140 && event.offsetX < 244 && event.offsetY > 218 && event.offsetY < 228) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 140 && event.offsetX < 232 && event.offsetY > 262 && event.offsetY < 272) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 703 && event.offsetX < 831 && event.offsetY > 130 && event.offsetY < 140) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 703 && event.offsetX < 794 && event.offsetY > 218 && event.offsetY < 228) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 703 && event.offsetX < 759 && event.offsetY > 305 && event.offsetY < 315) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture31(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 83 && event.offsetX < 96 && event.offsetY > 119 && event.offsetY < 249) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 117 && event.offsetX < 130 && event.offsetY > 119 && event.offsetY < 249) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 255 && event.offsetX < 268 && event.offsetY > 153 && event.offsetY < 249) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 425 && event.offsetX < 438 && event.offsetY > 156 && event.offsetY < 249) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 461 && event.offsetX < 474 && event.offsetY > 164 && event.offsetY < 249) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 700 && event.offsetX < 713 && event.offsetY > 175 && event.offsetY < 249) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 870 && event.offsetX < 883 && event.offsetY > 190 && event.offsetY < 249) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture32(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 267 && event.offsetX < 280 && event.offsetY > 137 && event.offsetY < 239) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 602 && event.offsetX < 615 && event.offsetY > 178 && event.offsetY < 239) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture33(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 79 && event.offsetX < 90 && event.offsetY > 132 && event.offsetY < 244) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 111 && event.offsetX < 122 && event.offsetY > 113 && event.offsetY < 244) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 204 && event.offsetX < 215 && event.offsetY > 157 && event.offsetY < 244) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 236 && event.offsetX < 247 && event.offsetY > 140 && event.offsetY < 244) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 725 && event.offsetX < 736 && event.offsetY > 140 && event.offsetY < 244) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture35(event) {
    console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 195 && event.offsetX < 353 && event.offsetY > 161 && event.offsetY < 171) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 195 && event.offsetX < 273 && event.offsetY > 225 && event.offsetY < 235) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 195 && event.offsetX < 237 && event.offsetY > 322 && event.offsetY < 332) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 195 && event.offsetX < 224 && event.offsetY > 417 && event.offsetY < 427) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

margin.left = 200;
createChart("#tab45_1content", 600, 400 , tab45_1content , 0);
createChart("#tab45_2content", 600, 400 , tab45_2content , 0);

function onCapture36(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 233 && event.offsetX < 307 && event.offsetY > 239 && event.offsetY < 250) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 233 && event.offsetX < 301 && event.offsetY > 303 && event.offsetY < 314) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("increase from previous year");
    } else if (event.offsetX > 233 && event.offsetX < 296 && event.offsetY > 371 && event.offsetY < 382) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

margin.left = 200;
createChart("#tab46_1content", 600, 400 , tab46_1content , 0);
createChart("#tab46_2content", 600, 400 , tab46_2content , 0);

margin.left = 200;
createChart("#tab47_1_1content", 600, 400 , tab47_1_1content , 0);
createChart("#tab47_1_2content", 600, 400 , tab47_1_2content , 0);
createChart("#tab47_1_3content", 600, 400 , tab47_1_3content , 0);
createChart("#tab47_1_4content", 600, 400 , tab47_1_4content , tab47_1_4contenttp);

createChart("#tab47_2_1content", 600, 400 , tab47_2_1content , 0);
createChart("#tab47_2_2content", 600, 400 , tab47_2_2content , 0);
createChart("#tab47_2_3content", 600, 400 , tab47_2_3content , tab47_2_3contenttp);
createChart("#tab47_2_4content", 600, 400 , tab47_2_4content , tab47_2_4contenttp);

function onCapture38(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 711 && event.offsetX < 810 && event.offsetY > 86 && event.offsetY < 96) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 120 + "px")
            .style("display", "inline-block")
            .html("<i>Especially...<li>LatAm 61%</li><li>US/CA 57%</li><li>Back End 56%</li><li>APAC 55%</li><li>Using Node 55%<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2+ yrs</li></i>");
    } else if (event.offsetX > 711 && event.offsetX < 731 && event.offsetY > 174 && event.offsetY < 184) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture39(event) {
    // console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 69 && event.offsetX < 254 && event.offsetY > 67 && event.offsetY < 102) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 60 + "px")
            .style("display", "inline-block")
            .html("<i>LTS especially used by...<li>1000+ ee’s 63%</li><li>Back-end 61%</li></i>");
    } else if (event.offsetX > 251 && event.offsetX < 402 && event.offsetY > 67 && event.offsetY < 102) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 60 + "px")
            .style("display", "inline-block")
            .html("<i>Current especially used by...<li>&lt;100 ee’s 47%</li><li>Use &lt; 2 yrs 47%</li></i>");
    } else {
        tooltip.style("display", "none");
    }
}

function onCapture41(event) {
    console.log(event.offsetX,event.offsetY);
    if (event.offsetX > 125 && event.offsetX < 141 && event.offsetY > 112 && event.offsetY < 228) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 244 && event.offsetX < 260 && event.offsetY > 112 && event.offsetY < 228) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("Down from 59%");
    } else if (event.offsetX > 303 && event.offsetX < 319 && event.offsetY > 136 && event.offsetY < 228) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("Down from 56%");
    } else if (event.offsetX > 423 && event.offsetX < 439 && event.offsetY > 108 && event.offsetY < 228) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("Down from 62%");
    } else if (event.offsetX > 482 && event.offsetX < 498 && event.offsetY > 105 && event.offsetY < 228) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("Down from 57%");
    } else if (event.offsetX > 661 && event.offsetX < 677 && event.offsetY > 121 && event.offsetY < 228) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("Down from 63%");
    } else if (event.offsetX > 125 && event.offsetX < 140 && event.offsetY > 271 && event.offsetY < 282) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else if (event.offsetX > 780 && event.offsetX < 795 && event.offsetY > 271 && event.offsetY < 277) {
        tooltip
            .style("left", event.pageX - 30 + "px")
            .style("top", event.pageY - 30 + "px")
            .style("display", "inline-block")
            .html("decrease from previous year");
    } else {
        tooltip.style("display", "none");
    }
}

margin.left = 300;
createChart("#tab56_1content", 600, 400 , tab56_1content , 0);
createChart("#tab56_2content", 600, 400 , tab56_2content , 0);

margin.left = 300;
createChart("#tab57_1content", 600, 400 , tab57_1content , 0);
createChart("#tab57_2content", 600, 400 , tab57_2content , tab57_2contenttp);
createChart("#tab57_3content", 600, 400 , tab57_3content , 0);
createChart("#tab57_4content", 600, 400 , tab57_4content , tab57_4contenttp);