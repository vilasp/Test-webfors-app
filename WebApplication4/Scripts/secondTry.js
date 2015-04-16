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
    var edge19 = { "to": "node5", "from": "node1" };

    return [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge19, edge10, edge11, edge12, edge18, edge14, edge15, edge16, edge17, edge13];
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

//Step 1 - Contruct a FAS-set, returns a new graph GFas
var GFas = cycleRemoval(graph);

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

        //Add to corresponding neighbor set
        $.each(graph.vertices, function () {

            if (this.label === currentEdge.from)
                graph.adjacencyList[this.number].neighborsOut.push(currentEdge.to);
            else if (this.label === currentEdge.to)
                graph.adjacencyList[this.number].neighborsIn.push(currentEdge.from);
        });
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
                if (graph.adjacencyList[from.number].neighborsIn[index1] === to.label && !checkIfTwoLoopAlreadyExist(currentEdge, twoLoopEdges)) {
                    currentEdgeIsPartOfTwoLoop = true;
                    graph.adjacencyList[from.number].neighborsIn.splice(index1, 1);
                }
            }
        }

        //If From was part of two loop then so is To
        if (currentEdgeIsPartOfTwoLoop) {
            for (var index2 = 0; index2 < graph.adjacencyList[to.number].neighborsOut.length; index2++) {
                if (graph.adjacencyList[to.number].neighborsOut[index2] === from.label) {
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

//Initialize the cycle removal step
function cycleRemoval(graph) {

    //Do a deep copy of the graph to work with
    var GCycleRemoval = jQuery.extend(true, {}, graph);

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
    while (graph.vertices.length > 0) {
        var sources = getSources(graph);
        var sinks = getSinks(graph);

        //Loop as long as there are sinks in the graph
        while (sinks.length > 0) {

            //Take first sink from list
            var tmpVertex = jQuery.extend(true, {}, sinks[0]);
            sinks.splice(0, 1);

            //add edges to not FAS set
            $.merge(notFas, addEdgeToFas(graph, 'sink', tmpVertex));

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
            $.merge(notFas, addSEdgeToFas(graph, 'source', tmpVertex));

            //Remove vertex from graph
            removeVertex(graph, tmpVertex);

            $.merge(getPossiblyNewSources(graph, tmpVertex), sources);

        }

        //Choose a vertex with the largest degree, append to source set s1
        var largetDegreeVertex = getVerticeWithLargestDegree(graph);

        //add edges to not FAS set
        $.merge(notFas, addSEdgeToFas(graph, 'source', largetDegreeVertex));

        //Remove vertex from graph
        removeVertex(graph, largetDegreeVertex);

    }
    return notFas;

}

//Loops through the set of vertices and checks if they only have out neighbors
function getSinks(graph) {
    var sinks = [];

    $.each(graph.vertices, function () {
        if (graph.adjacencyList[this.number].neighborsIn > 0 && this.neighboursOut.length === 0) {
            sinks.push(this);
        }
    });

    return sinks;
}

//Adds edges to the notFas set
function addEdgeToFas(graph, type, vertex) {

    var notFas = [];
    if (type === 'sink') {
        $.each(graph.adjacencyList[vertex.number].neighborsIn, function () {
            var neighbor = this;
            $.each(graph.edges, function (index) {
                if (this.from === neighbor.label && this.to === vertex.label) {
                    var tmpEdge = jQuery.extend(true, {}, graph.edges[index]);
                    notFas.push(tmpEdge);
                    graph.edges.splice(index, 1);
                }
            });
        });
    }
    else {
        $.each(graph.adjacencyList[vertex.number].neighborsOut, function () {
            var neighbor = this;
            $.each(graph.edges, function (index) {
                if (this.to === neighbor.label && this.from === vertex.label) {
                    var tmpEdge = jQuery.extend(true, {}, graph.edges[index]);
                    notFas.push(tmpEdge);
                    graph.edges.splice(index, 1);
                }
            });
        });
    }
    return notFas;

}
/************************************ End of Berger and Shor *******************/