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
    var initFinalTestEdges = getFinalTestEdges();*/



    var graph = constructGraph();

    //draw vertices
    createVertices(graph.vertices);

    //draw edges
    createEdges(graph.edges);

    //Make all components draggable
    jsPlumb.draggable($('.component'));

});

//Create and draw all vertices in the graph
function createVertices(vertices) {

    //For each vertice in the graph
    $.each(vertices, function () {

        //create vertex and append it to drawing area
        var tempVertex = jQuery('<div/>', {
            id: this.label,
            text: this.label
        }).appendTo('#drawing-area');

        //add vertex-class
        tempVertex.addClass('component');

        //Set appropriate coordinates of vertex
        tempVertex.css({
            'left': this.xCoordinate * 100,
            'top': this.layer * 100
        });

        if (this.dummy) {
            tempVertex.addClass('invisiburu')
        }

        //Update references in jsPlumb
        jsPlumb.setIdChanged(this.label, this.label);
    });
};

//Create and draw all edges in the graph
function createEdges(edges) {

    //Declare all possible positions of endpoints
    var dynamicAnchors = ["Top", "TopRight", "TopLeft", "Right", "Left", "BottomLeft", "Bottom", "BottomRight"];

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
                    ["Arrow", { width: 12, length: 12, location: 1 }]
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
    var node9 = { "label": "node9", staticToVertex: {to : 'node6', yAxis : 'below', xAxis : 'left'} }
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

    //Remove two loops and store them separately 
    var twoLoopEdges = removeAndStoreTwoLoops(graph);

    //Step 1 - Contruct a FAS-set, returns an array where [0] = edges not in FAS, [1] = FAS
    var fas = cycleRemoval(graph);

    //Step 1.1 - Reverse edges left in FAS
    reverseEdgesInFas(fas);

    //Step 1.2 - Update graph with new structure
    var newEdges = $.merge(fas[0], fas[1]);
    graph.edges = newEdges;
    graph.adjacencyList = [];
    assigningVertexAndLabelNumber(graph);
    setNeighbors(graph);

    //Step 2 - Remove one of the static vertices under constraints
    var verticesUnderConstraints = removeAndStoreVerticesUnderConstraints(graph);

    //Step 2.1 - Make a layering of the graph
    var layeredVertices = clusticLongestPath(graph);
    graph.vertices = layeredVertices[0];
    graph['layering'] = layeredVertices[1];

    //Step 2.2 - Reintroduce vertices under static constraints
    reIntroduceStaticConstraintsVertices(graph, verticesUnderConstraints);

    //Step 2.3 - Assign the removed node 

    //Step 2.1 - Make proper layering
    var dummyVerticesAndEdges = makeProperLayering(graph);
    addDummyVerticesToGraphAndLayering(graph, dummyVerticesAndEdges[0]);
    addDummyEdgesToGraph(graph, dummyVerticesAndEdges[1]);

    //Step 2.2 - Remove leftover edges in the graph
    removeAllNeighbors(graph);

    //Step 2.3 - Add all the edges, original + dummies
    setNeighbors(graph);

    //Step 3 - Edge crossing minimization
    edgeCrossingMinimization(graph);

    //Step 4 - x-coordinate assignment
    edgeStraightening(graph);

    //Step 5 - Reverse vertices layering so bottom is top and top is bottom
    for (var i = 0; i < graph.vertices.length; i++) {

        //Revers of layer
        var reverseLayer = graph.layering.length - graph.vertices[i].layer;
        graph.vertices[i].layer = reverseLayer;
    };

    //Step 5.1 - Remove all dummy vertices
    for (var i = 0; i < graph.vertices.length; i++) {
        if (graph.vertices[i].dummy) {
            graph.vertices.splice(i, 1);
            i--;
        }
    }

    //Step 5.2 - Remove all dummy edges
    for (var i = 0; i < graph.edges.length; i++) {
        if (graph.edges[i].dummy) {
            graph.edges.splice(i, 1);
            i--;
        }
    }

    //Step 5.3 - Reverse fas edges back to original direction
    var reversedFas = reverseEdgesInFas(fas);
    $.merge(graph.edges, fas[1]);

    //Step 5.4 - Add all two loop, self loop edges and all edges replacing dummy edges back to the edge set
    $.merge(graph.edges, twoLoopEdges);
    $.merge(graph.edges, selfLoopEdges);
    removeDuplicateEdges(graph, dummyVerticesAndEdges[2])
    $.merge(graph.edges, dummyVerticesAndEdges[2]);

    return graph;


};
/************************ Graph construction end **************************************/

//Remove all already existing edges from the set of original set
function removeDuplicateEdges(graph, oldEdges) {
    for (var i = 0; i < oldEdges.length; i++) {
        $.each(graph.edges, function () {
            if (oldEdges[i].label === this.label) {
                oldEdges.splice(i, 1),
                i--;
            }
        });
    }
};

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
            deepCopyElement = $.extend(true, {}, graph.edges[index]);
            deepCopyElement['reversed'] = true;
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
                        if (this[0] === to.label) graph.adjacencyList[from.number].neighborsOut.splice(removeIndex, 1);
                    });

                }
            }
        }

        //If From was part of two loop then so is To
        if (currentEdgeIsPartOfTwoLoop) {
            for (var index2 = 0; index2 < graph.adjacencyList[to.number].neighborsIn.length; index2++) {
                if (graph.adjacencyList[to.number].neighborsIn[index2][0] === from.label) {
                    graph.adjacencyList[to.number].neighborsIn.splice(index2, 1);

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

        var sinks = getSinks([], graph);

        //Loop as long as there are sinks in the graph
        while (sinks.length > 0) {

            //Take first sink from list
            var tmpVertex = jQuery.extend(true, {}, sinks[0]);
            sinks.splice(0, 1);

            //add edges to not FAS set
            $.merge(notFas, addEdgeToFas(graph, 'sink', tmpVertex));

            //Remove vertex from graph
            removeVertex('sink', graph, tmpVertex);

            var tmp = $.merge(sinks, getSinks(sinks, graph));

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
    return [notFas, graph.edges];

};
/****************************** End of Berger and Shor main loop *********************************/

//Loops through the set of vertices and checks if they only have in neighbors
function getSinks(existingSinks, graph) {
    var sinks = [];

    $.each(graph.vertices, function () {
        if (graph.adjacencyList[this.number].neighborsIn.length > 0 && graph.adjacencyList[this.number].neighborsOut.length === 0) {
            if (!alreadyExist(existingSinks, this))
                sinks.push(this);
        }
    });

    return sinks;
};

//Check if sink all-ready exist
function alreadyExist(list, vertex) {
    var exists = false;

    $.each(list, function () {
        if (this.label === vertex.label) {
            exists = true;
        }
    });
    return exists;
};

//Loops through the set of vertices and checks if they only have out neighbors
function getSources(existingSources, graph) {
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
                removeFromNeighborLists(type, graph.adjacencyList[this.number].neighborsIn, vertex, graph);
            } else if (type === 'source') {
                removeFromNeighborLists(type, graph.adjacencyList[this.number].neighborsOut, vertex, graph);
            } else {
                removeFromNeighborLists(type, graph.adjacencyList[this.number].neighborsIn, vertex, graph);
                removeFromNeighborLists(type, graph.adjacencyList[this.number].neighborsOut, vertex, graph);
            }

            //Remove vertex from graph, empty its neighbors lists
            graph.vertices.splice(index, 1);
            graph.adjacencyList[this.number].neighborsIn = [];
            graph.adjacencyList[this.number].neighborsOut = [];
        }
    });
};

//Remove vertex from neigborlists
function removeFromNeighborLists(type, neighborList, vertex, graph) {

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

function getHighestVerticeNumber(graph) {
    return graph.vertices.length;
};

function getHighestEdgeLabel(graph) {
    return undefined
};

function addDummyVerticesToGraphAndLayering(graph, dummies) {
    $.each(dummies, function () {
        graph.vertices.push(this);
        graph.layering[this.layer].push(this);
    });
};

function addDummyEdgesToGraph(graph, dummies) {
    $.merge(graph.edges, dummies);
};

function removeAllNeighbors(graph) {
    $.each(graph.adjacencyList, function () {
        this.neighborsIn = [];
        this.neighborsOut = [];
    });
};
/****************************** Longest-path algrithm ************************************************/
function clusticLongestPath(graph) {
    var alreadyPicked = [], 
        layering = [], 
        currentLayerVertices = [],
        verticesUnderConstraints = [];
    var currentLayer = 1;
    var previousLayer = getSinks([], graph);

    //Add sink vertices to the first layer
    $.each(previousLayer, function () {
        this['layer'] = 0;
        alreadyPicked.push(this);
        currentLayerVertices.push(this);
        removeVertex("source", graph, this);

    });

    layering.push(currentLayerVertices);
    currentLayerVertices = [];

    //As long as there is edges left in the graph
    while (graph.vertices.length > 0) {

        //Get vertex with maximum out degree
        var currentMaxVertex = checkMostEdgesInPreviousLayer(graph, previousLayer);

        //If vertex is found add to current layer being built and add to the already pick list
        if (currentMaxVertex !== undefined) {
            currentMaxVertex['layer'] = currentLayer;
            alreadyPicked.push(currentMaxVertex);
            currentLayerVertices.push(currentMaxVertex);
            removeVertex("source", graph, currentMaxVertex);
        }

        //If no vertex is selected add the current layer
        if (currentMaxVertex === undefined || graph.vertices.length === 0) {
            currentLayer++;
            layering.push(currentLayerVertices);
            var tmpPrevious = $.merge(previousLayer, currentLayerVertices);
            currentLayerVertices = [];
        }
    };


    return [alreadyPicked, layering];

}

function checkMostEdgesInPreviousLayer(graph, previousLayer) {
    var maxVertex = undefined;
    var max = 0;

    for (var index = 0; index < graph.vertices.length; index++) {

        var currentVertex = graph.vertices[index];
        var currentVertexOutgoingEdges = graph.adjacencyList[currentVertex.number].neighborsOut;
        var currentMaxCount = 0;

        //Select vertex with most outgoing edges in the previous layer
        $.each(currentVertexOutgoingEdges, function () {
            var tmpVertex = this;
            $.each(previousLayer, function () {
                if (this.label === tmpVertex[0]) {
                    currentMaxCount++;
                }
            });
        });

        if (currentMaxCount === currentVertexOutgoingEdges.length)
            maxVertex = currentVertex;
    }
    return maxVertex;
}

//Removes one of the two vertices under constraints with each other
function removeAndStoreVerticesUnderConstraints(graph){
    var verticesUnderConstraints = [];

    for(var i = 0; i < graph.vertices.length; i++){
        if(graph.vertices[i].staticToVertex !== undefined){
            var tmpVertex = {}
            tmpVertex['vertex'] = jQuery.extend(true, {}, graph.vertices[i]);
            tmpVertex['neighborsIn'] = graph.adjacencyList[tmpVertex.vertex.number].neighborsIn;
            tmpVertex['neighborsOut'] = graph.adjacencyList[tmpVertex.vertex.number].neighborsOut;
            verticesUnderConstraints.push(tmpVertex);
            removeVertex("largestDegree", graph, graph.vertices[i]);
        }   
    };
    return verticesUnderConstraints;
}

//Re introduces the removed vertices back into the set
function reIntroduceStaticConstraintsVertices(graph, verticesUnderConstraint) {
    $.each(verticesUnderConstraint, function () {
        placeVertexInLayer(graph,this);
        graph.vertices.push(this.vertex);
        graph.adjacencyList[this.vertex.number].neighborsIn = this.neighborsIn;
        graph.adjacencyList[this.vertex.number].neighborsOut = this.neighborsOut;
    });
};

function placeVertexInLayer(graph,currentVertex) {
    $.each(graph.vertices, function () {
        if (this.label === currentVertex.vertex.staticToVertex.to) {
            if (currentVertex.vertex.staticToVertex.yAxis === 'below') {
                currentVertex.vertex['layer'] = this.layer - 1;
            }
            else if (currentVertex.vertex.staticToVertex.yAxis === 'above') {
                currentVertex.vertex['layer'] = this.layer + 1;
            }
            graph.layering[currentVertex.vertex.layer].push(currentVertex.vertex);
        }
    });
};
/****************************** End of longest path   ************************************************/

/****************************** Proper layering *****************************************************/
function makeProperLayering(graph) {
    var dummyVertices = [], dummyEdges = [], oldEdges = [];
    for (var index = 0; index < graph.edges.length; index++) {
        var to, from;
        var currentEdge = graph.edges[index];
        var tmpDummies = [], tmpEdges = [];

        //Get vertices in edge
        $.each(graph.vertices, function () {
            if (currentEdge.from === this.label) from = this;
            else if (currentEdge.to === this.label) to = this;
        });

        var span = Math.abs(from.layer - to.layer);
        if (span > 1) {
            for (var index1 = 0; index1 < span - 1; index1++) {
                if (index1 === 0)
                    tmpDummies.push(createDummyVertex(graph, from));
                else
                    tmpDummies.push(createDummyVertex(graph, tmpDummies[index1 - 1]));
            };

            for (var index2 = 0; index2 < span; index2++) {

                var tmpEdge;
                if (index2 === 0) {
                    tmpEdge = createDummyEdge(from, tmpDummies[index2], true);
                    //updateAdjacencyList(graph, from, tmpDummies[index2]);
                }

                else if (index2 < span - 1) {
                    tmpEdge = createDummyEdge(tmpDummies[index2 - 1], tmpDummies[index2], true);
                    //updateAdjacencyList(graph, tmpDummies[index2 - 1], tmpDummies[index2]);
                }

                else {
                    tmpEdge = createDummyEdge(tmpDummies[index2 - 1], to, true);
                    //updateAdjacencyList(graph, tmpDummies[index2-1], to);
                }
                dummyEdges.push(tmpEdge);
            };
            var originalEdge = jQuery.extend(true, {}, graph.edges[index]);
            oldEdges.push(originalEdge);
            graph.edges.splice(index, 1);
            index--;
        }
    };
    return [dummyVertices, dummyEdges, oldEdges];
};

function createDummyVertex(graph, fromParent) {
    var newDummyVertex = {};
    newDummyVertex['label'] = 'node' + getHighestVerticeNumber(graph);
    newDummyVertex['number'] = getHighestVerticeNumber(graph);
    newDummyVertex['layer'] = fromParent.layer - 1;
    newDummyVertex['dummy'] = true;
    graph.vertices.push(newDummyVertex);
    graph.layering[newDummyVertex.layer].push(newDummyVertex);
    graph.adjacencyList.push({ neighborsIn: [], neighborsOut: [] });
    return newDummyVertex;
};

function createDummyEdge(from, to) {
    var newDummyEdge = {};
    newDummyEdge['to'] = to.label;
    newDummyEdge['from'] = from.label;
    newDummyEdge['dummy'] = true;
    return newDummyEdge;

};

function updateAdjacencyList(graph, from, to) {
    //set the edge in from vertex
    graph.adjacencyList[from.number].neighborsOut.push([to.label, to.number]);

    //set the edge in In veretx
    graph.adjacencyList[to.number].neighborsIn.push([from.label, from.number])
};
/****************************** End of proper layering **********************************************/

/****************************** Edge crossing minimization ******************************************/
function edgeCrossingMinimization(graph) {

    //Until convergence to some value
    var convergenceValue = 100;
    for (var i = 0; i < convergenceValue; i++) {
        sweepDownUp(graph);
        sweepUpDown(graph);
    };
};

function barycenter(graph, currentLayer, incidentMatrix) {

    for (var row = 0; row < incidentMatrix.length; row++) {
        var colValue = 0, numberOfEdges = 0;
        for (var col = 0; col < incidentMatrix[row].length; col++) {
            if (incidentMatrix[row][col] === 1) {
                colValue += (col + 1);
                numberOfEdges++;
            }
        }

        //Prevent NaN
        if (colValue === 0) colValue = -1000;
        graph.layering[currentLayer][row]['barycenter'] = colValue / numberOfEdges;
    }
};

function removeBarycenter(graph, currentLayer) {
    for (var row = 0; row < graph.layering[currentLayer].length; row++) {
        delete graph.layering[currentLayer][row]['barycenter'];
    };
}

function sweepDownUp(graph) {
    //Sweep down -> up
    for (var currentLayer = 1; currentLayer < graph.layering.length; currentLayer++) {
        var incidentMatrix = fillIncidentMatrix(graph, graph.layering[currentLayer], graph.layering[currentLayer - 1]);
        barycenter(graph, currentLayer, incidentMatrix);
        graph.layering[currentLayer].sort(sortingOnBarycenter);
        removeBarycenter(graph, currentLayer);
    };
};

function sweepUpDown(graph) {
    //Sweep up -> down
    for (var currentLayer = graph.layering.length - 2; currentLayer > -1; currentLayer--) {
        var incidentMatrix = fillIncidentMatrix(graph, graph.layering[currentLayer], graph.layering[currentLayer + 1]);
        barycenter(graph, currentLayer, incidentMatrix);
        graph.layering[currentLayer].sort(sortingOnBarycenter);
        removeBarycenter(graph, currentLayer);
    };
};

function fillIncidentMatrix(graph, nonFixed, fixed) {
    var matrix = createIncidentMatrix(nonFixed, fixed);

    for (var row = 0; row < nonFixed.length; row++) {
        for (var col = 0; col < fixed.length; col++) {
            if (chechIfEdgeExists(graph, nonFixed[row], fixed[col])) {
                matrix[row][col] = 1;
            }
            else {
                matrix[row][col] = 0;
            }
        }
    }
    return matrix;
};

function createIncidentMatrix(nonFixed, fixed) {
    var matrix = new Array(nonFixed.length);
    for (var row = 0; row < matrix.length; row++) {
        matrix[row] = new Array(fixed.length);
    };
    return matrix;
};

function chechIfEdgeExists(graph, vertex, neighbor) {
    var exists = false;
    for (var index = 0; index < graph.adjacencyList[vertex.number].neighborsOut.length; index++) {
        if (graph.adjacencyList[vertex.number].neighborsOut[index][0] === neighbor.label) {
            exists = true;
        }
    };
    for (var index = 0; index < graph.adjacencyList[vertex.number].neighborsIn.length; index++) {
        if (graph.adjacencyList[vertex.number].neighborsIn[index][0] === neighbor.label) {
            exists = true;
        }
    }
    return exists;
};

function sortingOnBarycenter(a, b) {
    if (a.barycenter === b.barycenter) {
        return 0;
    } else {
        return (a.barycenter < b.barycenter) ? -1 : 1;
    }
};

/****************************** End of edge crossing minimization ***********************************/

/****************************** Edge Straightening *************************************************/
function edgeStraightening(graph) {
    //Set x-coordinate of all vertices in the graph
    setWithinLayerXCoordinate(graph);

    //Until convergence to some value
    sweepXCoordinateDownUp(graph);
    sweepXCoordinateUpDown(graph);
    sweepXCoordinateDownUp(graph);
    sweepXCoordinateUpDown(graph);

};

function setWithinLayerXCoordinate(graph) {
    for (var layer = 0; layer < graph.layering.length; layer++) {
        for (var positionInLayer = 0; positionInLayer < graph.layering[layer].length; positionInLayer++) {

            //Set x-coordinate within layer
            graph.layering[layer][positionInLayer]['layerX'] = positionInLayer;
            graph.layering[layer][positionInLayer]['xCoordinate'] = positionInLayer;
        };
    };
};

function setPriority(graph, currentLayer, type) {
    for (var position = 0; position < graph.layering[currentLayer].length; position++) {
        var currentVertex = graph.layering[currentLayer][position];
        if (type === 'downToUp') {
            (currentVertex.dummy) ? currentVertex['priority'] = 20000 : currentVertex['priority'] = graph.adjacencyList[currentVertex.number].neighborsOut.length;
        }
        else if (type === 'upToDown') {
            (currentVertex.dummy) ? currentVertex['priority'] = 20000 : currentVertex['priority'] = graph.adjacencyList[currentVertex.number].neighborsIn.length;
        }
    };
};

function sweepXCoordinateDownUp(graph) {
    //Sweep down -> up
    for (var currentLayer = 1; currentLayer < graph.layering.length; currentLayer++) {

        //Get incident matrix for barycenter calculation
        var incidentMatrix = fillIncidentMatrix(graph, graph.layering[currentLayer], graph.layering[currentLayer - 1]);

        //Set priorities of the current layer
        setPriority(graph, currentLayer, 'downToUp');

        //Set the Barycenters of the current layer
        xCoordinateBarycenter(graph, currentLayer, incidentMatrix, graph.layering[currentLayer - 1]);

        //Copy the current layer into a new set for temporary removal
        var tmpCurrentLayer = jQuery.extend(true, [], graph.layering[currentLayer]);

        //Assign x-coordinates to vertices in current layer
        setXCoordinate(graph, tmpCurrentLayer, graph.layering[currentLayer]);

        //Remove Barycenter value from current layer
        removeBarycenter(graph, currentLayer);
    };
};

function sweepXCoordinateUpDown(graph) {
    //Sweep up -> down
    for (var currentLayer = graph.layering.length - 2; currentLayer > -1; currentLayer--) {
        //Get incident matrix for barycenter calculation
        var incidentMatrix = fillIncidentMatrix(graph, graph.layering[currentLayer], graph.layering[currentLayer + 1]);

        //Set priorities of the current layer
        setPriority(graph, currentLayer, 'upToDown');

        //Set the Barycenters of the current layer
        xCoordinateBarycenter(graph, currentLayer, incidentMatrix, graph.layering[currentLayer + 1]);

        //Copy the current layer into a new set for temporary removal
        var tmpCurrentLayer = jQuery.extend(true, [], graph.layering[currentLayer]);

        //Assign x-coordinates to vertices in current layer
        setXCoordinate(graph, tmpCurrentLayer, graph.layering[currentLayer]);

        //Remove Barycenter value from current layer
        removeBarycenter(graph, currentLayer);
    };
};

function xCoordinateBarycenter(graph, currentLayer, incidentMatrix, fixedLayer) {

    for (var row = 0; row < incidentMatrix.length; row++) {
        var colValue = 0, numberOfEdges = 0;
        for (var col = 0; col < incidentMatrix[row].length; col++) {
            if (incidentMatrix[row][col] === 1) {
                colValue += fixedLayer[col].xCoordinate;
                numberOfEdges++;
            }
        }

        //Prevent NaN
        if (colValue === 0)
            graph.layering[currentLayer][row]['barycenter'] = graph.layering[currentLayer][row].xCoordinate;
        else
            graph.layering[currentLayer][row]['barycenter'] = Math.round(colValue / numberOfEdges);
    }
};



function setXCoordinate(graph, tmpCurrentLayer, currentLayer) {

    var mk = [];

    for (var initialXCoordinate = 0; initialXCoordinate < tmpCurrentLayer.length; initialXCoordinate++) {
        mk.push(tmpCurrentLayer[initialXCoordinate].xCoordinate);
    }

    for (var current = 0; current < tmpCurrentLayer.length; current++) {

        var currentHigh = -1,
        currentVertex = undefined;

        for (var initialXCoordinate = 0; initialXCoordinate < tmpCurrentLayer.length; initialXCoordinate++) {
            if (!tmpCurrentLayer[initialXCoordinate].used && tmpCurrentLayer[initialXCoordinate].priority > currentHigh) {
                currentHigh = tmpCurrentLayer[initialXCoordinate].priority;
                currentVertex = tmpCurrentLayer[initialXCoordinate];
            }
        }

        //Is the vertex placed on the right side of its Barycenter
        if ((currentVertex.barycenter - mk[currentVertex.layerX]) < 0) {
            leftOfItsBarycenter(currentVertex, tmpCurrentLayer, mk);
        }
            //On the left side of its Barycenter
        else if ((currentVertex.barycenter - mk[currentVertex.layerX]) > 0) {
            rightOfItsBarycenter(graph, currentVertex, tmpCurrentLayer, mk);
        }

        //Store the x-coordinate of the current vertex and remove it from the temporary list
        currentLayer[currentVertex.layerX].xCoordinate = mk[currentVertex.layerX];
        currentVertex['used'] = true;
    }
};

function leftOfItsBarycenter(currentVertex, currentLayer, mk) {

    var current = currentVertex.layerX;

    //The leftmost vertex in the layer
    if (current === 0) {
        mk[current] = currentVertex.barycenter;
        return;
    } else {

        //Get vertex closest to the left x-coordinate from currenVertex with equal or lager priority
        var k = -1

        for (var prioVertex = 0; prioVertex < currentLayer.length; prioVertex++) {
            if (currentLayer[prioVertex].priority >= currentVertex.priority && currentLayer[prioVertex].label !== currentVertex.label) {
                k = prioVertex;
            }
        }

        //If there is a vertex on the left of currentVertex with higher or equal priority
        if (k !== -1) {
            if (mk[k] >= currentVertex.barycenter + k - current) {

                for (var l = 1; l < 100; l++) {
                    mk[k + l] = mk[k] + l;

                    if (l >= (current - k)) {
                        return;
                    }
                }
            }
        }

        mk[current] = currentVertex.barycenter;

        //If there are vertices on the current Barycenter we can push it to the left
        for (var l = 1; l < 100; l++) {

            if (mk[current + l] === undefined || currentVertex.barycenter - l >= (mk[current - l])) {
                return;
            } else {
                mk[current - l] = currentVertex.barycenter - l;
                if (l >= current - 1) {
                    return;
                }
            }
        }
    }
};

function rightOfItsBarycenter(graph, currentVertex, currentLayer, mk) {

    var current = currentVertex.layerX;

    //The leftmost vertex in the layer
    if (current === graph.vertices.length - 1) {
        mk[current] = currentVertex.barycenter;
        return;
    } else {

        //Get vertex closest to the left x-coordinate from currenVertex with equal or lager priority
        var k = -1

        for (var prioVertex = current; prioVertex < currentLayer.length; prioVertex++) {
            if (currentLayer[prioVertex].priority >= currentVertex.priority && currentLayer[prioVertex].label !== currentVertex.label) {
                k = prioVertex;
            }
        }

        //If there is a vertex on the left of currentVertex with higher or equal priority
        if (k !== -1) {
            if (mk[k] <= currentVertex.barycenter + k - current) {

                for (var l = 1; l < 100; l++) {
                    mk[k - l] = mk[k] - l;

                    if (l >= (k - current)) {
                        return;
                    }
                }
            }
        }

        mk[current] = currentVertex.barycenter;

        //If there are vertices on the current Barycenter we can push it to the left
        for (var l = 1; l < 100; l++) {

            if (mk[current + l] === undefined || currentVertex.barycenter + l < (mk[current + l])) {
                return;
            } else {
                mk[current + l] = currentVertex.barycenter + l;
                if (l >= (graph.vertices.length - 1 - current)) {
                    return;
                }
            }
        }
    }
};

function sortingOnPriorityThenPositionWithinLayer(a, b) {
    var aPriority = a.priority;
    var bPriority = b.priority;

    var aLayerx = a.layerX;
    var bLayerX = b.layerX;

    return (a.priority > b.priority) ? -1 : 1;
    return (a.layerX < b.layerX) ? -1 : 1;
    return 0;
};
/****************************** End of edge straightening *******************************************/