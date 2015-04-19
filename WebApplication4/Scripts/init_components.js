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

    constructGraph();

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

function getTestEdges() {

    //init test edges
    var edge0 = { "to": "node1", "from": "node0" };
    var edge1 = { "to": "node2", "from": "node0" };
    var edge2 = { "to": "node3", "from": "node1" };
    var edge3 = { "to": "node8", "from": "node2" };
    var edge4 = { "to": "node4", "from": "node2" };
    var edge5 = { "to": "node5", "from": "node3" };
    var edge6 = { "to": "node7", "from": "node3" };
    var edge7 = { "to": "node6", "from": "node4" };
    var edge8 = { "to": "node7", "from": "node5" };
    var edge9 = { "to": "node8", "from": "node6" };
    var edge10 = { "to": "node9", "from": "node6" };
    var edge11 = { "to": "node11", "from": "node7" };
    var edge12 = { "to": "node2", "from": "node8" };
    var edge13 = { "to": "node10", "from": "node8" };
    var edge14 = { "to": "node6", "from": "node9" };
    var edge15 = { "to": "node10", "from": "node9" };
    var edge16 = { "to": "node11", "from": "node10" };
    var edge17 = { "to": "node11", "from": "node11" };
    var edge18 = { "to": "node10", "from": "node10" };
    //var edge19 = { "to": "node1", "from": "node5" };
    //var edge20 = { "to": "node2", "from": "node10" };
    //var edge21 = { "to": "node4", "from": "node8" };
    return [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11, edge12, edge18, edge14, edge15, edge16, edge17, edge13];
    //return [edge0, edge1, edge2, edge3, edge20, edge21, edge4, edge5, edge6, edge7, edge8, edge9, edge19, edge10, edge11, edge12, edge18, edge14, edge15, edge16, edge17, edge13];//
};

function getTestVertices() {

    var node0 = { "label": "node0" }
    var node1 = { "label": "node1" }
    var node2 = { "label": "node2" }
    var node3 = { "label": "node3" }
    var node4 = { "label": "node4" }
    var node5 = { "label": "node5" }
    var node6 = { "label": "node6" }
    var node7 = { "label": "node7" }
    var node8 = { "label": "node8" }
    var node9 = { "label": "node9" }
    var node10 = { "label": "node10" }
    var node11 = { "label": "node11" }

    return [node0, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11];
};

/************************ Graph construction start ***********************************/
function constructGraph() {
    var graph = { vertices: [], edges: [], adjacencyList: [] };

    graph.edges = getTestEdges();
    graph.vertices = getTestVertices();

    //Assign labels to each node and init adjacency lists
    assigningVertexAndLabelNumber(graph);

    //Remove self loop edges and store separately
    var selfLoopEdges = removeAndStoreSelfLoops(graph);

    //Set neighbors of all vertices in the graph
    setNeighbors(graph);

    //Remove two loops and storelilife them separately 
    var twoLoopEdges = removeAndStoreTwoLoops(graph);

    //Step 1 - Contruct a FAS-set, returns a array of [0] = edges not in FAS, [1] = FAS
    var Fas = cycleRemoval(graph);

    //Step 1.1 - Reverse edges left in FAS
    reverseEdgesInFas(Fas);

    //Step 1.2 - Update graph with new structure
    var newEdges = $.merge(Fas[0], Fas[1]);
    graph.edges = newEdges;
    graph.adjacencyList = [];
    assigningVertexAndLabelNumber(graph);
    setNeighbors(graph);

    //Step 2 - Assign vertices to layers
    var layeredVertices = longestPath(graph);
    var tmp = 4;
};
/************************ Graph construction end **************************************/


//Assign vertex numbers and init adjacency lists
function assigningVertexAndLabelNumber(graph) {
    var number = 0;

    //Label vertices
    $.each(graph.vertices, function () {
        this['number'] = number;
        graph.adjacencyList.push({ neighborsIn: [], neighborsOut: [] });
        number++;
    });

    number = 0;

    //Label edges
    $.each(graph.edges, function () {
        this['label'] = 'edge' + number;
        number++;
    });
};

//Removes all self loop edges and stores them in a separate array
function removeAndStoreSelfLoops(graph) {

    var selfLoopEdges = [];
    var deepCopyElement,
        index;

    for (index = 0; index < graph.edges.length; index++) {
        if (graph.edges[index].from === graph.edges[index].to) {
            deepCopyElement = $.extend(true, [], graph.edges[index]);
            selfLoopEdges.push(deepCopyElement)
            graph.edges.splice(index, 1);
            index--;
        }
    };

    return selfLoopEdges;
};

//Initialize a graph with neighbor list and degree count
function setNeighbors(graph) {

    //For every edge in the graph
    $.each(graph.edges, function () {
        var currentEdge = this;
        var to, from

        //Add to corresponding neighbor set
        $.each(graph.vertices, function () {
            if (this.label === currentEdge.from)
                from = this;
            else if (this.label === currentEdge.to)
                to = this;

        });

        graph.adjacencyList[from.number].neighborsOut.push([currentEdge.to, to.number]);
        graph.adjacencyList[to.number].neighborsIn.push([currentEdge.from, from.number]);

    });
};

//Remove two-loops from the graph
function removeAndStoreTwoLoops(graph) {

    var twoLoopEdges = [];

    for (var index = 0; index < graph.edges.length; index++) {

        var currentEdge = graph.edges[index];
        var currentEdgeIsPartOfTwoLoop = false;
        var from, to;

        //Find nodes of current edge
        $.each(graph.vertices, function () {
            if (this.label === currentEdge.from) from = this;
            if (this.label === currentEdge.to) to = this;
        });

        //Set edge attribute 
        currentEdge['reversed'] = false;

        //Remove edge from neighbor
        if (graph.adjacencyList[from.number].neighborsIn.length > 0) {
            for (var index1 = 0; index1 < graph.adjacencyList[from.number].neighborsIn.length; index1++) {
                if (graph.adjacencyList[from.number].neighborsIn[index1][0] === to.label && !checkIfTwoLoopAlreadyExist(currentEdge, twoLoopEdges)) {
                    currentEdgeIsPartOfTwoLoop = true;
                    $.each(graph.adjacencyList[from.number].neighborsOut, function (removeIndex) {
                        if(this[0] === to.label)graph.adjacencyList[from.number].neighborsOut.splice(removeIndex, 1);
                    });
                    
                }
            }
        }

        //If From was part of two loop then so is To
        if (currentEdgeIsPartOfTwoLoop) {
            for (var index2 = 0; index2 < graph.adjacencyList[to.number].neighborsOut.length; index2++) {
                if (graph.adjacencyList[to.number].neighborsOut[index2][0] === from.label) {
                    $.each(graph.adjacencyList[to.number].neighborsIn, function (removeIndex1) {
                        if (this[0] === from.label) graph.adjacencyList[to.number].neighborsIn.splice(removeIndex1, 1);
                    });

                    graph.adjacencyList[to.number].neighborsOut.splice(index2, 1);

                    //Remove the reversed edge form the graph only if 
                    var tmpEdge = jQuery.extend(true, {}, graph.edges[index]);
                    twoLoopEdges.push(tmpEdge);
                    graph.edges.splice(index, 1);
                    index--;
                }
            }
        }
    };

    return twoLoopEdges;
};

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

//Initialize the cycle removal step
function cycleRemoval(graph) {

    //Do a deep copy of the graph to work with
    var GCycleRemoval = jQuery.extend(true, {}, graph);

    //start the Berger and Shor algorithm
    return bergerAndShor(GCycleRemoval);
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
    while (graph.vertices.length > 0) {
 
        var sinks = getSinks([],graph);

        //Loop as long as there are sinks in the graph
        while (sinks.length > 0) {

            //Take first sink from list
            var tmpVertex = jQuery.extend(true, {}, sinks[0]);
            sinks.splice(0, 1);

            //add edges to not FAS set
            $.merge(notFas, addEdgeToFas(graph, 'sink', tmpVertex));

            //Remove vertex from graph
            removeVertex('sink', graph, tmpVertex);

            var tmp = $.merge(sinks, getSinks(sinks,graph));

        }

        var sources = getSources([], graph);

        //Loop as long as there as sources in the graph
        while (sources.length > 0) {

            //Take first source from list
            var tmpVertex = jQuery.extend(true, {}, sources[0]);
            sources.splice(0, 1);

            //add edges to not FAS set
            $.merge(notFas, addEdgeToFas(graph, 'source', tmpVertex));

            //Remove vertex from graph
            removeVertex('source', graph, tmpVertex);

            var tmp = $.merge(sources, getSources(sources, graph));

        }
        if (graph.vertices.length > 0) {
            //Choose a vertex with the largest degree, append to source set s1
            var largestDegreeVertex = getVertexWithLargestDegree(graph);

            //add edges to not FAS set
            $.merge(notFas, addEdgeToFas(graph, 'source', largestDegreeVertex));

            //Remove vertex from graph
            removeVertex('largestDegree', graph, largestDegreeVertex);
        }
    }
    return [notFas,graph.edges];

};
/****************************** End of Berger and Shor main loop *********************************/

//Loops through the set of vertices and checks if they only have in neighbors
function getSinks(existingSinks,graph) {
    var sinks = [];

    $.each(graph.vertices, function () {
        if (graph.adjacencyList[this.number].neighborsIn.length > 0 && graph.adjacencyList[this.number].neighborsOut.length === 0) {
            if(!alreadyExist(existingSinks,this))
                sinks.push(this);
        }
    });

    return sinks;
};

//Check if sink all-ready exist
function alreadyExist(list,vertex) {
    var exists = false;

    $.each(list, function () {
        if (this.label ===   vertex.label) {
            exists = true;
        }
    });
    return exists;
};

//Loops through the set of vertices and checks if they only have out neighbors
function getSources(existingSources,graph) {
    var sources = [];

    $.each(graph.vertices, function () {
        if (graph.adjacencyList[this.number].neighborsOut.length > 0 && graph.adjacencyList[this.number].neighborsIn.length === 0) {
            if (!alreadyExist(existingSources, this))
                sources.push(this);
        }
    });

    return sources;
};

//Returns vertex with largest degree
function getVertexWithLargestDegree(graph) {
    var largestIndex;
    var largestDegree = -100000000;
    $.each(graph.vertices, function (index) {

        var currDegree = graph.adjacencyList[this.number].neighborsOut.length - graph.adjacencyList[this.number].neighborsIn.length;

        if (currDegree > largestDegree) {
            largestIndex = index;
            largestDegree = currDegree;
        }
    });

    return graph.vertices[largestIndex];
};

//Adds edges to the notFas set
function addEdgeToFas(graph, type, vertex) {

    var notFas = [];
    if (type === 'sink') {
        $.each(graph.adjacencyList[vertex.number].neighborsIn, function () {
            var neighbor = this[0];
            $.each(graph.edges, function (index) {
                if (this.from === neighbor && this.to === vertex.label) {
                    var tmpEdge = jQuery.extend(true, {}, graph.edges[index]);
                    notFas.push(tmpEdge);
                    graph.edges.splice(index, 1);
                }
            });
        });
    }
    else {
        $.each(graph.adjacencyList[vertex.number].neighborsOut, function () {
            var neighbor = this[0];
            $.each(graph.edges, function (index1) {
                if (this.to === neighbor && this.from === vertex.label) {
                    var tmpEdge = jQuery.extend(true, {}, graph.edges[index1]);
                    notFas.push(tmpEdge);
                    graph.edges.splice(index1, 1);
                }
            });
        });
    }
    return notFas;

};
/************************************ End of Berger and Shor block *****************************************/

//Removes a vertex from the given graph
function removeVertex(type, graph, vertex) {

    $.each(graph.vertices, function (index) {

        //Find vertex
        if (this.label === vertex.label) {

            //Remove vertex from neighbor lists
            if (type === 'sink') {
                removeFromNeighborLists(type, graph.adjacencyList[this.number].neighborsIn, vertex,graph);
            } else if (type === 'source') {
                removeFromNeighborLists(type, graph.adjacencyList[this.number].neighborsOut, vertex,graph);
            } else {
                removeFromNeighborLists(type, graph.adjacencyList[this.number].neighborsIn, vertex,graph);
                removeFromNeighborLists(type, graph.adjacencyList[this.number].neighborsOut, vertex,graph);
            }

            //Remove vertex from graph, empty its neighbors lists
            graph.vertices.splice(index, 1);
            graph.adjacencyList[this.number].neighborsIn = [];
            graph.adjacencyList[this.number].neighborsOut = [];
        }
    });
};

//Remove vertex from neigborlists
function removeFromNeighborLists(type, neighborList, vertex,graph) {

    $.each(neighborList, function () {

        var currentVertice = this;
        if (type === 'sink' || type === 'largestDegree') {
            $.each(graph.adjacencyList[currentVertice[1]].neighborsOut, function (index) {
                if (this[0] === vertex.label) {
                    graph.adjacencyList[currentVertice[1]].neighborsOut.splice(index, 1);
                }
            });
        } else if (type === 'source' || type === 'largestDegree') {
            $.each(graph.adjacencyList[currentVertice[1]].neighborsIn, function (index) {
                if (this[0] === vertex.label) {
                    graph.adjacencyList[currentVertice[1]].neighborsIn.splice(index, 1);
                }
            });
        }
    });

};

function reverseEdgesInFas(fas) {
    $.each(fas[1], function () {

        //Store original values
        var to = this.to;
        var from = this.from;

        //Override original values with their reverse
        this.to = from;
        this.from = to;

        //Update reverse attribute so we can keep track of reversed edges
        this.reversed = true;
    });
}

/****************************** Longest-path algrithm ************************************************/
function longestPath(graph) {
    var alreadyPicked = [];
    var currentLayer = 1;
    var previousLayer = getSinks([], graph);

    //Add sink vertices to the first layer
    $.each(previousLayer, function () {
        this['layer'] = 0;
        alreadyPicked.push(this);
        removeVertex("source", graph, this);
    });

    while (graph.vertices.length > 0) {
        var currentMaxVertex = checkMostEdgesInPreviousLayer(graph, previousLayer);
        if (currentMaxVertex !== undefined) {
            currentMaxVertex['layer'] = currentLayer;
            alreadyPicked.push(currentMaxVertex);
            removeVertex("source",graph,currentMaxVertex);
        }
        if (currentMaxVertex === undefined) {
            currentLayer++;
            var tmpPrevious = $.merge(previousLayer,alreadyPicked);
        }
    };


    return alreadyPicked;
   
}

function checkMostEdgesInPreviousLayer(graph,previousLayer) {
    var maxVertex = undefined;
    var max = 0;

    for (var index = 0; index < graph.vertices.length; index++) {

        //Select vertex with most outgoing edges in the previous layer
        var currentVertex = graph.vertices[index];
        var currentVertexOutgoingEdges = graph.adjacencyList[currentVertex.number].neighborsOut;
        var currentMaxCount = 0;
        $.each(currentVertexOutgoingEdges, function () {
            tmpVertex = this;
            $.each(previousLayer, function () {
                if (this.label === tmpVertex[0]) {
                    currentMaxCount++;
                }
            });
        });
        if (currentMaxCount > max) {
            max = currentMaxCount;
            maxVertex = currentVertex;
        }
            
    }
    return maxVertex;
}


/****************************** End of longest path   ************************************************/
