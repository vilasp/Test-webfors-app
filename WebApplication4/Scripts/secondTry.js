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
var twoLoopEdges = removeAndStoreTwoLoops(G);

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

        if (graph.adjacencyList[from.number].neighborsIn.length > 0) {
            f
        }

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
