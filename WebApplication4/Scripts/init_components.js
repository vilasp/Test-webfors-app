jsPlumb.ready(function () {

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
    var edge17 = { "to": "node11", "from": "node11" };
    var edge18 = { "to": "node10", "from": "node10" };
    var edge19 = { "to": "node5", "from": "node1" };

    init_edges = [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge19, edge10, edge11, edge12, edge18, edge14, edge15, edge16, edge17, edge13];
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
function constructGraph(vertices, edges) {
    
    var G = [vertices, edges];

    //Label edges
    labelEdges(G);
    
    //Remove self loops
    var selfLoopEdges = removeAndStoreSelfLoops(G);

    //Set up neighbor lists and degree count
    setDegreeCountAndNeighbors(G);

    //Remove and store two loops
    var twoLoopEdges = removeAndStoreTwoLoops(G);

    //prettyDebugPrint('printDegreeAndNeighbors',G)
    
    //Step 1 - Contruct a FAS-set, returns a new graph GFas
    var GFas = cycleRemoval(G);



};


var graph = { vertices: [], edges: [] };

graph.edges = getTestEdges();
graph.vertices = getTestVertices();

var adjecencyMatrix = [{ neighborsIn: [] }, { neighborsOut: [] }];

function assignVertexNumber(graph) {
    var number = 0;
    $.each(graph.vertices, function () {
        this['number'] = number;
        number++;
    });
};








//Label each edge 
function labelEdges(graph) {
    var i = 0;

    $.each(graph[1], function () {
        this['label'] = 'edge' + i;
        i++;
    });
    //return graph;
};

//Remove self loops from the graph
function removeAndStoreSelfLoops(graph) {

    var selfLoopEdges = [];

    for (var index = 0; index < graph[1].length; index++) {
        if (graph[1][index].from === graph[1][index].to) {
            var deepCopyElement = $.extend(true, [], graph[1][index]);
            selfLoopEdges.push(deepCopyElement)
            graph[1].splice(index, 1);
            index--;
        }
    };

    return selfLoopEdges;
};

//Remove two-loops from the graph
function removeAndStoreTwoLoops(graph) {

    var twoLoopEdges = [];

    for (var index = 0; index < graph[1].length; index++) {

        var currentEdge = graph[1][index];
        var currentEdgeIsPartOfTwoLoop = false;
        var from, to;

        //Find nodes of current edge
        $.each(graph[0], function () {
            if (this.label === currentEdge.from) from = this;
            if (this.label === currentEdge.to) to = this;
        });

        //Set edge attribute 
        currentEdge['reversed'] = false;

        //Check if From vertex is part of a two loop
        if (from.neighborsIn !== undefined) {
            for (var index1 = 0; index1 < from.neighborsIn.length; index1++) {
                if (from.neighborsIn[index1].label === to.label && !checkIfTwoLoopAlreadyExist(currentEdge, twoLoopEdges)) {
                    currentEdgeIsPartOfTwoLoop = true;
                    from.neighborsIn.splice(index1, 1);
                    var tmpDegree = from.inDegree;
                    from.inDegree = tmpDegree - 1;
                    break;
                }
            }
        }

        //If From was part of two loop so is To
        if (currentEdgeIsPartOfTwoLoop) {
            for (var index2 = 0; index2 < to.neighborsOut.length; index2++) {
                if (to.neighborsOut[index2].label === from.label) {
                    to.neighborsOut.splice(index2, 1);
                    var tmpDegree = to.outDegree;
                    to.outDegree = tmpDegree - 1;

                    //Remove the reversed edge form the graph
                    var tmpEdge = jQuery.extend(true, {}, graph[1][index]);
                    tmpEdge.reversed = true;
                    twoLoopEdges.push(tmpEdge);
                    graph[1].splice(index, 1);
                    index--;
                    break;
                }
            }
        }
    };
    return twoLoopEdges;
}

//Check if a edge already had a reversed brother
function checkIfTwoLoopAlreadyExist(edge, existingTwoLoopEdges) {
    var findReverse = false;
    $.each(existingTwoLoopEdges, function () {
        if (this.to === edge.from && this.from === edge.to) {
            findReverse = true;
        }
    });
    return findReverse;
};

//Initialize a graph with neighbor list and degree count
function setDegreeCountAndNeighbors(graph) {

    $.each(graph[1], function () {
        var currentEdge = this;
        var from, to;

        $.each(graph[0], function () {

            if (this.label === currentEdge.from) from = this;
            if (this.label === currentEdge.to) to = this;
        });

        //Edge from vertex
        if (!from.hasOwnProperty('neighborsOut')) from['neighborsOut'] = [to];
        else {
            from['neighborsOut'].push(to);
        }

        //Edge into vertex
        if (!to.hasOwnProperty('neighborsIn')) to['neighborsIn'] = [from];
        else {
            to['neighborsIn'].push(from);
        }

        to['inDegree'] = to.neighborsIn.length;
        from['outDegree'] = from.neighborsOut.length;
    });
}

//Initialize the cycle removal step
function cycleRemoval(graph) {

    //Do a deep copy of the graph to work with
    var newEdges = jQuery.extend(true, {}, graph[1]);
    //var newVertices = jQuery.extend(true, {}, graph[0]);
    var GCycleRemoval = [graph[0], newEdges];

    //start the Berger and Shor algorithm
    var topologicalOrdering = bergerAndShor(GCycleRemoval);
};

/*********************** Berger and Shor ***********************
Works by successively removing sources and sinks from the graph and placing
them in separate sets. When no more sinks/ sources can be removed a vertex
with largest degree is chosen. When no more vertices exist in the graph 
the algorithm returns with a toplogical ordering of vertices.
***************************************************************/
function bergerAndShor(graph) {

    //create empty sets, s1 = sources append here, s2 sinks prepend here
    var s1 = []
    var s2 = []
    var notFas = [];

    //Main loop : until graph is empty
    while (graph[0].length > 0) {
        var sources = getSources(graph);
        var sinks = getSinks(graph);
        
        //Loop as long as there are sinks in the graph
        while (sinks.length > 0) {
            
            //Take first sink from list
            var tmpVertex = jQuery.extend(true, {}, sinks[0]);
            sinks.splice(0, 1);
            
            //add edges to not FAS set
            $.merge(notFas,addSEdgeToFas(graph,'sink',tmpVertex));

            //Remove vertex from graph
            removeVertex(graph, tmpVertex);

            $.merge(getPossiblyNewSinks(graph, tmpVertex), sinks);
        }

        //Loop as long as there as sources in the graph
        while (source.length > 0) {

            //Take first source from list
            var tmpVertex = jQuery.extend(true, {}, sources[0]);
            sources.splice(0, 1);
            
            //add edges to not FAS set
            $.merge(notFas,addSEdgeToFas(graph,'source',tmpVertex));

            //Remove vertex from graph
            removeVertex(graph, tmpVertex);

            $.merge(getPossiblyNewSources(graph, tmpVertex), sources);

        }

        //Choose a vertex with the largest degree, append to source set s1
        var largetDegreeVertex = getVerticeWithLargestDegree(graph);

        //add edges to not FAS set
        $.merge(notFas,addSEdgeToFas(graph,'source',largetDegreeVertex));

        //Remove vertex from graph
        removeVertex(graph, largetDegreeVertex);

    }
    return notFas;

}

//Loops through the set of vertices and checks if they only have out neighbors
function getSinks(graph) {
    var sinks = [];

    $.each(graph[0],function () {
        if (this.neighborsIn.length > 0 && this.neighboursOut.length === 0) {
            sinks.push(this);
        }
    });

    return sinks;
}

function getPossiblyNewSinks(graph,vertex) {
    var possiblyNewSinks = [];

    $.each(vertex.neighboursIn, function () {
        if (this.neighborsIn.length > 0 && this.neighboursOut.length === 0)
            possiblyNewSinks.push(this);
    });
}

function getSources(graph) {
    var sources = [];

    $.each(graph[0], function () {
        if (this.neighborsOut.length > 0 && this.neighboursIn.length === 0) {
            sources.push(this);
        }
    });

    return sources;
};

function getPossiblyNewSinks(graph,vertex) {
    var possiblyNewSources = [];

    $.each(vertex.neighboursIn, function () {
        if (this.neighborsOut.length > 0 && this.neighboursIn.length === 0)
            possiblyNewSources.push(this);
    });
}

function getVerticeWithLargestDegree(graph) {
    var largestIndex;
    var largestDegree = -100000000;
    $.each(graph[0],function(index){
        if((this.outDegree + this.inDegree) > largestDegree)
            largestIndex = index;
    });

    return graph[0][index];
};

function addSEdgeToFas(graph,type,vertex){

    var notFas = [];
    if (type === 'sink') {
        $.each(vertex.neighborsIn, function () {
            var neighbor = this;
            $.each(graph[1], function (index) {
                if (this.from === neighbor.label && this.to === vertex.label) {
                    var tmpEdge = jQuery.extend(true, {}, graph[1][index]);
                    notFas.push(tmpEdge);
                    graph[1].splice(index, 1);
                }

            });
        });
    }
    else{
        $.each(vertex.neighborsOut, function () {
            var neighbor = this;
            $.each(graph[1], function (index) {
                if (this.to === neighbor.label && this.from === vertex.label) {
                    var tmpEdge = jQuery.extend(true, {}, graph[1][index]);
                    notFas.push(tmpEdge);
                    graph[1].splice(index, 1);
                }

            });
        });
    }
    return notFas;
    
}
/************************************ End of Berger and Shor *******************/

//Removes a vertex from the given graph
function removeVertex(graph,vertex){
    
    $.each(graph[0], function (index) {

        //Find vertex
        if (this.label === vertex.label) {

            //Remove edges to node
            var neighborList = $.merge(this.neighborsOut, this.neighborsIn);
            removeFromNeighborLists(neighborList, vertex);

            //Remove vertex from graph
            graph[0].splice(index,1);
        }
    });
}

//Removes edge from the given graph
function removeEdge(graph,edge){

}

//Remove vertex from neigborlists
function removeFromNeighborList(neighborList, vertex) {
    $.each(neighborList, function () {

        var inList = this.neighborsIn;
        //Remove vertex in IN edges list on neighbor
        $.each(inList, function (index) {
            if(this.label === vertex.label){
                inList.splice(index, 1);
            }
        })

        var outList = this.neighborsOut;
        //Remove vertex in Out edges list on neighbor
        $.each(outList, function (index) {
            if (this.label === vertex.label) {
                outList.splice(index, 1);
            }
        })
    });
}


//Printing function to see some debug messages
function prettyDebugPrint(message, G) {

    //Print all the neighbors and the degree of each vertex
    if (message === 'printDegreeAndNeighbors') {
        var i = 0;
        $.each(G[0], function () {
             if(this.neighborsIn !== undefined)
                 console.log('Node ' + i + ' has in neighbors: ' + this.neighborsIn.join() + ' and the total indegree of ' + this.inDegree);
             if (this.neighborsOut !== undefined)
                 console.log('Node ' + i + ' has out neighbors: ' + this.neighborsOut.join() + ' and the total outdegree of ' + this.outDegree);
             i++;
         });
    }
}