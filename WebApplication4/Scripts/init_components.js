﻿jsPlumb.ready(function () {

    //set appropriate default edges
    jsPlumb.importDefaults({
        Connector: "Straight",
        PaintStyle: {
            lineWidth: 1,
            strokeStyle: "#456"
        },
    });

    //Set container for all graphs elements
    jsPlumb.setContainer($('#drawing-area'));

    /*//init final test sets
    var initFinalTestVertices = getFinalTestVertices();
    var initFinalTestEdges = getFinalTestEdges();
   
    //draw vertices
    createVertices(initFinalTestVertices);

    //draw edges
    createEdges(initFinalTestEdges);*/

    //Create test vertices and edges
    var testVertices = getTestVertices();
    var testEdges = getTestEdges();

    constructGraph(testVertices, testEdges);

    //Make all components draggable
    jsPlumb.draggable($('.component'));

});

//Create and draw all vertices in the graph
function createVertices(vertices) {

    //For each vertice in the graph
    $.each(vertices, function () {

        //create vertex and append it to drawing area
         var tempVertex = jQuery('<div/>',{
            id: this.label,
            text: this.label
         }).appendTo('#drawing-area');

        //add vertex-class
         tempVertex.addClass('component');

        //Set appropriate coordinates of vertex
         tempVertex.css({
             'left': this.xCoordinate*100,
             'top' : this.layer*100
         });

        //Update references in jsPlumb
         jsPlumb.setIdChanged(this.label, this.label);
    });
};

//Create and draw all edges in the graph
function createEdges(edges) {

    //Declare all possible positions of endpoints
    var dynamicAnchors = ["Top","TopRight","TopLeft", "Right", "Left", "BottomLeft", "Bottom", "BottomRight"];

    //For each edge, create a connection between TO and FROM with an arrow pointing in the direction of the flow
    $.each(edges, function () {

        //Decide on connector drawing style
        var connectorStyle;
        if (this.reversed)
            connectorStyle = ['StateMachine', { showLoopback: true }];
        else
            connectorStyle = 'Straight';

        var edge = jsPlumb.connect({
            source: this.from,
            target: this.to,
            anchors: [dynamicAnchors, "Continuous"],
            endpoint: "Blank",
            anchor: ["Perimeter", { shape: "Rectangle" }],
            overlays: [
                    ["Arrow", { width: 12, length: 12, location: 1}]
            ],
            scope: "allEdges",
            connector: connectorStyle
        });
    });
};

//Create and return final test set of vertices
function getFinalTestVertices() {

    //init some testing vertices
    var node0 = { "label": "node0", "layer": 0, "layerX": 0, "xCoordinate": 3, "neighbors": ["node1", "node2"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" };
    var node1 = { "label": "node1", "layer": 1, "layerX": 0, "xCoordinate": 2, "neighbors": ["node3"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" };
    var node2 = { "label": "node2", "layer": 1, "layerX": 1, "xCoordinate": 4, "neighbors": ["node4", "node8"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" };
    var node3 = { "label": "node3", "layer": 2, "layerX": 0, "xCoordinate": 2, "neighbors": ["node5", "node7"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" };
    var node4 = { "label": "node4", "layer": 2, "layerX": 1, "xCoordinate": 5, "neighbors": ["node6"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" };
    var node5 = { "label": "node5", "layer": 3, "layerX": 0, "xCoordinate": 1, "neighbors": ["node7"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" };
    var node6 = { "label": "node6", "layer": 3, "layerX": 1, "xCoordinate": 5, "neighbors": ["node8", "node9"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" };
    var node7 = { "label": "node7", "layer": 4, "layerX": 0, "xCoordinate": 2, "neighbors": ["node11"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" };
    var node8 = { "label": "node8", "layer": 4, "layerX": 1, "xCoordinate": 4, "neighbors": ["node10"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" };
    var node9 = { "label": "node9", "layer": 4, "layerX": 2, "xCoordinate": 5, "neighbors": ["node6", "node10"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" };
    var node10 = { "label": "node10", "layer": 5, "layerX": 0, "xCoordinate": 4, "neighbors": ["node11"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" };
    var node11 = { "label": "node11", "layer": 6, "layerX": 0, "xCoordinate": 3, "neighbors": [], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" };

    var init_vertices = [node0, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11];
    return init_vertices;
}

//Create and return final test set of edges
function getFinalTestEdges() {

    //init test edges
    var edge0 = { "to": "node1", "from": "node0", "reversed": false, "type": "diEdge" };
    var edge1 = { "to": "node2", "from": "node0", "reversed": false, "type": "diEdge" };
    var edge2 = { "to": "node3", "from": "node1", "reversed": false, "type": "diEdge" };
    var edge3 = { "to": "node8", "from": "node2", "reversed": false, "type": "diEdge" };
    var edge4 = { "to": "node4", "from": "node2", "reversed": false, "type": "diEdge" };
    var edge5 = { "to": "node5", "from": "node3", "reversed": false, "type": "diEdge" };
    var edge6 = { "to": "node7", "from": "node3", "reversed": false, "type": "diEdge" };
    var edge7 = { "to": "node6", "from": "node4", "reversed": false, "type": "diEdge" };
    var edge8 = { "to": "node7", "from": "node5", "reversed": false, "type": "diEdge" };
    var edge9 = { "to": "node8", "from": "node6", "reversed": false, "type": "diEdge" };
    var edge10 = { "to": "node9", "from": "node6", "reversed": false, "type": "diEdge" };
    var edge11 = { "to": "node11", "from": "node7", "reversed": false, "type": "diEdge" };
    var edge12 = { "to": "node2", "from": "node8", "reversed": true, "type": "diEdge" };
    var edge13 = { "to": "node10", "from": "node8", "reversed": false, "type": "diEdge" };
    var edge14 = { "to": "node6", "from": "node9", "reversed": true, "type": "diEdge" };
    var edge15 = { "to": "node10", "from": "node9", "reversed": false, "type": "diEdge" };
    var edge16 = { "to": "node11", "from": "node10", "reversed": false, "type": "diEdge" };
    var edge17 = { "to": "node11", "from": "node11", "reversed": true, "type": "diEdge" };

    init_edges = [edge3, edge10, edge12, edge14, edge0, edge1, edge2, edge4, edge5, edge6, edge7, edge8, edge9, edge11, edge13, edge15, edge16, edge17];
    return init_edges;
};

function getTestVertices() {

    var node0 = { "label": "node0"} 
    var node1 = { "label": "node1" }
    var node2 = { "label": "node2" }
    var node3 = { "label": "node3" }
    var node4 = { "label": "node4" }
    var node5 = { "label": "node5" }
    var node6 = { "label": "node6" }
    var node7 = { "label": "node7" }
    var node8 = { "label": "node8" }
    var node9 = { "label": "node9" }
    var node10 = { "label": "node10"}
    var node11 = { "label": "node11"}

    var init_vertices = [node0, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11];
    return init_vertices;
};

function getTestEdges() {

    //init test edges
    var edge0 = { "to": "node1", "from": "node0" };
    var edge1 = { "to": "node2", "from": "node0"};
    var edge2 = { "to": "node3", "from": "node1"};
    var edge3 = { "to": "node8", "from": "node2"};
    var edge4 = { "to": "node4", "from": "node2"};
    var edge5 = { "to": "node5", "from": "node3"};
    var edge6 = { "to": "node7", "from": "node3"};
    var edge7 = { "to": "node6", "from": "node4"};
    var edge8 = { "to": "node7", "from": "node5"};
    var edge9 = { "to": "node8", "from": "node6"};
    var edge10 = { "to": "node9", "from": "node6" };
    var edge11 = { "to": "node11", "from": "node7" };
    var edge12 = { "to": "node2", "from": "node8"  };
    var edge13 = { "to": "node10", "from": "node8" };
    var edge14 = { "to": "node6", "from": "node9"  };
    var edge15 = { "to": "node10", "from": "node9" };
    var edge16 = { "to": "node11", "from": "node10"};
    var edge17 = { "to": "node11", "from": "node11"};

    init_edges = [edge3, edge10, edge12, edge14, edge0, edge1, edge2, edge4, edge5, edge6, edge7, edge8, edge9, edge11, edge13, edge15, edge16, edge17];
    return init_edges;
}

/**

Performs 4 steps ending in a layered graph drawing
    - Step 1: Cycle removal - follows the guidlines of Berger and Shor
        - Return a new set of edges with the additional property of {reversed : true or false} marking an edge to reversed in the final drawing
    - Step 2: Layer of verices
    - Step 3: Edge crossing recuction
    - Step 4: X-coordinate assignment

Input: 
    - A set of vertices on the form [vertice1,vertice2,...,vertice n-1], each vertex is on the form {label : vertexlabel}
    - A set of edges on the form [edge1,edge2,...,edge m-1], each edge is on the form {from : vertexLabel, to : vertexlabel}

Output: 
    - A layered drawing of a graph

**/
function constructGraph(vertices,edges) {

    var G = [vertices, edges];

    //Step 1 - Contruct a FAS-set, returns a new graph GFas
    var GFas = cycleRemoval(G);



};


function cycleRemoval(graph) {
    var newEdges = jQuery.extend(true, {}, graph[1]);
    var newEdgesWithDegreeCount = setDegreeCount(newEdges);
};

function setDegreeCount(edges) {
    $.each(edges, function () {

    });
}
/*********************** Berger and Shor ***********************/

function checkSink(graph) {

}

function checkSource(graph) {

};
