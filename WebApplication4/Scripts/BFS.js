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
    
    var nVertices = getNyAnstalldVertices();

    var graph = constructGraph(getTestVertices(), getTestEdges(), nVertices.length);

    //draw vertices
    createVertices(graph);

    //draw edges
    createEdges(graph);

    //Make all components draggable
    jsPlumb.draggable($('.component'));

});

//Create and draw all vertices in the graph
function createVertices(graph) {
    var positions = [];
    //For each vertice in the graph
    $.each(graph.vertices, function () {

        //create vertex and append it to drawing area
        var tempVertex = jQuery('<div/>', {
            id: this.label,
            text: this.label
        }).appendTo('#drawing-area');


        if (this.markNode)
            tempVertex.addClass('marked');

        //add vertex-class
        tempVertex.addClass('component');

        if(positions[graph.distanceMatrix['node0'][this.label]] === undefined)
            positions[graph.distanceMatrix['node0'][this.label]] = 0;
        else
            positions[graph.distanceMatrix['node0'][this.label]]++;

        //Set appropriate coordinates of vertex
        tempVertex.css({
            'left': ((positions[graph.distanceMatrix['node0'][this.label]]+1) * 50),
            'top': (graph.distanceMatrix['node0'][this.label] + 2) * 60
        });

        //Update references in jsPlumb
        jsPlumb.setIdChanged(this.label, this.label);
    });
};

//Create and draw all edges in the graph
function createEdges(graph) {

    //Declare all possible positions of endpoints
    //var dynamicAnchors = ["Top", "TopRight", "TopLeft", "Right", "Left", "BottomLeft", "Bottom", "BottomRight"];
    var dynamicAnchors = ["Top", "Right", "Left", "Bottom"];

    //For each edge, create a connection between TO and FROM with an arrow pointing in the direction of the flow
    $.each(graph.edges, function () {

        var connectorStyle;
        if (this.selfLoop)
            connectorStyle = ['StateMachine', { showLoopback: true }];
        else
            connectorStyle = 'Straight';

            var edge = jsPlumb.connect({
                source: this.from,
                target: this.to,
                anchors: [dynamicAnchors, "Continuous"],
                endpoint: "Blank",
                anchor: ["Perimeter", { shape: "Rectangle" }],
                scope: "allEdges",
                overlays: [["Arrow", { width: 5, length: 5, location: 1 }]],
                connector: connectorStyle
            });
    });
};

function getTestEdges() {

    //init test edges
    var edge0 = { "to": "node1", "from": "node0"};
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
    var edge19 = { "to": "node1", "from": "node5" };
    var edge20 = { "to": "node2", "from": "node10" };
    var edge21 = { "to": "node4", "from": "node8" };
    return [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11, edge12, edge18, edge14, edge15, edge16, edge17, edge13];
    //return [edge0, edge1, edge2, edge3, edge20, edge21, edge4, edge5, edge6, edge7, edge8, edge9, edge19, edge10, edge11, edge12, edge18, edge14, edge15, edge16, edge17, edge13];
    //return [edge3, edge4, edge7,edge15,edge20,edge21, edge9, edge10, edge12, edge13, edge14];
};

function getTestVertices() {

    var node0 = { "label": "node0", markNode: true }
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
    var node11 = { "label": "node11", markNode: true }

    return [node0, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11];
};

/************************ Graph construction start ***********************************/
function constructGraph(vertices, edges, numberOfOriginalVertices, dummies) {
    var graph = { vertices: [], edges: [], adjacencyList: [], numberOfOriginalVertices: numberOfOriginalVertices };

    graph.edges = edges;
    graph.vertices = vertices;

    //Assign labels to each node and init adjacency lists
    assigningVertexAndLabelNumber(graph);

    //Remove self loop edges and store separately
    var selfLoopEdges = removeAndStoreSelfLoops(graph);

    //Set neighbors of all vertices in the graph
    setNeighbors(graph);

    //Calculate the distance matrix
    graph['distanceMatrix'] = createDistanceMatrix(graph);

    $.merge(graph.edges, selfLoopEdges);

    return graph;

};
/************************ Graph construction end **************************************/

//Construct the distance matrix
function createDistanceMatrix(graph) {

    var distanceMatrix = intiDistanceMatrix(graph);
    breadthFirstSearch(graph, distanceMatrix);

    return distanceMatrix;

};

//Initialize the distance matrix with values -1 for all but those edges moving back itself, 0 for them
function intiDistanceMatrix(graph) {
    var distanceMatrix = {};

    $.each(graph.vertices, function () {
        distanceMatrix[this.label] = {};
        var rowVertex = this;
        $.each(graph.vertices, function () {
            if (rowVertex.label === this.label)
                distanceMatrix[rowVertex.label][this.label] = 0;
            else
                distanceMatrix[rowVertex.label][this.label] = -1;
        });
    });

    return distanceMatrix;
};


//Make a breadth-first search in order to construct a distance matrix 
function breadthFirstSearch(graph, distanceMatrix) {

    $.each(graph.vertices, function () {

        var neigbors = [[this.label, this.number]],
            alreadyVisited = [this.label],
            tmpNeigbors = [],
            currentVertice = this,
            currentCount = 1,
            done = false;

        while (neigbors.length !== 0) {
            $.each(graph.adjacencyList[neigbors[0][1]].neighborsOut, function () {

                if (!isInArray(this[0], alreadyVisited)) {
                    alreadyVisited.push(this[0]);
                    distanceMatrix[currentVertice.label][this[0]] = currentCount;
                    $.merge(tmpNeigbors, [this]);
                }

            });

            neigbors.splice(0, 1);

            if (neigbors.length === 0) {
                currentCount++;
                neigbors = tmpNeigbors;
                tmpNeigbors = [];
            }
        }
    });
};

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}



//Remove all already existing edges from the set of original edges
function removeDuplicateEdges(oldEdges) {
    for (var i = 0; i < oldEdges.length; i++) {
        if (oldEdges[i].reversed) {
            oldEdges.splice(i, 1);
            i--;
        }
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
            deepCopyElement['selfLoop'] = true;
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

function getNyAnstalldVertices() {
    var node0 = { "label": "node0" , markNode :true}
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
    var node12 = { "label": "node12" }
    var node13 = { "label": "node13" }
    var node14 = { "label": "node14" }
    var node15 = { "label": "node15" }
    var node16 = { "label": "node16" }
    var node17 = { "label": "node17" }
    var node18 = { "label": "node18" }
    var node19 = { "label": "node19" }
    var node20 = { "label": "node20" }
    var node21 = { "label": "node21" }
    var node22 = { "label": "node22" }
    var node23 = { "label": "node23" ,markNode:true}

    return [node0, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11, node12, node13, node14, node15, node16, node17, node18, node19, node20, node21, node22, node23];
};

function getNyAnstalldEdges() {
    var edge0 = { "from": "node0", "to": "node1" };
    var edge1 = { "from": "node1", "to": "node2" };
    var edge2 = { "from": "node1", "to": "node23" };
    var edge3 = { "from": "node2", "to": "node4" };
    var edge4 = { "from": "node2", "to": "node14" };
    var edge5 = { "from": "node3", "to": "node18" };
    var edge6 = { "from": "node3", "to": "node5" };
    var edge7 = { "from": "node4", "to": "node6" };
    var edge8 = { "from": "node4", "to": "node7" };
    var edge9 = { "from": "node4", "to": "node22" };
    var edge10 = { "from": "node5", "to": "node8" };
    var edge11 = { "from": "node5", "to": "node18" };
    var edge12 = { "from": "node6", "to": "node3" };
    var edge13 = { "from": "node6", "to": "node9" };
    var edge14 = { "from": "node7", "to": "node6" };
    var edge15 = { "from": "node7", "to": "node10" };
    var edge16 = { "from": "node7", "to": "node22" };
    var edge17 = { "from": "node8", "to": "node18" };
    var edge18 = { "from": "node8", "to": "node11" };
    var edge19 = { "from": "node9", "to": "node19" };
    var edge20 = { "from": "node9", "to": "node12" };
    var edge21 = { "from": "node10", "to": "node13" };
    var edge22 = { "from": "node10", "to": "node20" };
    var edge23 = { "from": "node11", "to": "node18" };
    var edge24 = { "from": "node11", "to": "node15" };
    var edge25 = { "from": "node12", "to": "node19" };
    var edge26 = { "from": "node12", "to": "node15" };
    var edge27 = { "from": "node13", "to": "node16" };
    var edge28 = { "from": "node13", "to": "node20" };
    var edge29 = { "from": "node14", "to": "node18" };
    var edge30 = { "from": "node15", "to": "node19" };
    var edge31 = { "from": "node16", "to": "node20" };
    var edge32 = { "from": "node17", "to": "node21" };
    var edge33 = { "from": "node18", "to": "node23" };
    var edge34 = { "from": "node19", "to": "node23" };
    var edge35 = { "from": "node20", "to": "node21" };
    var edge36 = { "from": "node21", "to": "node22" };
    var edge37 = { "from": "node22", "to": "node23" };

    return [edge0, edge1, edge2, edge3, edge16, edge17, edge32, edge33, edge34, edge18, edge19, edge20, edge21, edge22, edge23, edge24, edge25, edge26, edge27, edge28, edge29, edge30, edge31, edge35, edge36, edge37, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11, edge12, edge13, edge14, edge15];

};

function getEfterAffarVertices() {
    var node0 = { "label": "node0" ,markNode :true}
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
    var node12 = { "label": "node12" }
    var node13 = { "label": "node13" }
    var node14 = { "label": "node14" }
    var node15 = { "label": "node15" }
    var node16 = { "label": "node16" ,markNode :true}
    var node17 = { "label": "node17" }
    var node18 = { "label": "node18" }
    var node19 = { "label": "node19" }
    var node20 = { "label": "node20" }
    var node21 = { "label": "node21" }
    var node22 = { "label": "node22" }
    var node23 = { "label": "node23" }
    var node24 = { "label": "node24" }
    var node25 = { "label": "node25" }
    var node26 = { "label": "node26" }
    var node27 = { "label": "node27" }
    var node28 = { "label": "node28" }
    var node29 = { "label": "node29" }


    return [node0, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11, node12, node13, node14, node15, node16, node17, node18, node19, node20, node21, node22, node23, node24, node25, node26, node27, node28, node29];
};

function getEfterAffarEdges() {
    var edge0 = { "from": "node0", "to": "node1" };
    var edge1 = { "from": "node0", "to": "node2" };
    var edge2 = { "from": "node0", "to": "node3" };
    var edge3 = { "from": "node1", "to": "node4" };
    var edge4 = { "from": "node1", "to": "node13" };
    var edge5 = { "from": "node2", "to": "node5" };
    var edge6 = { "from": "node2", "to": "node14" };
    var edge7 = { "from": "node3", "to": "node6" };
    var edge8 = { "from": "node3", "to": "node22" };
    var edge9 = { "from": "node4", "to": "node13" };
    var edge10 = { "from": "node4", "to": "node7" };
    var edge11 = { "from": "node5", "to": "node8" };
    var edge12 = { "from": "node6", "to": "node22" };
    var edge13 = { "from": "node6", "to": "node9" };
    var edge14 = { "from": "node7", "to": "node13" };
    var edge15 = { "from": "node7", "to": "node10" };
    var edge16 = { "from": "node8", "to": "node14" };
    var edge17 = { "from": "node8", "to": "node11" };
    var edge18 = { "from": "node9", "to": "node22" };
    var edge19 = { "from": "node9", "to": "node12" };
    var edge20 = { "from": "node11", "to": "node14" };
    var edge21 = { "from": "node12", "to": "node15" };
    var edge22 = { "from": "node12", "to": "node17" };
    var edge23 = { "from": "node13", "to": "node16" };
    var edge24 = { "from": "node14", "to": "node16" };
    var edge25 = { "from": "node15", "to": "node17" };
    var edge26 = { "from": "node15", "to": "node18" };
    var edge27 = { "from": "node17", "to": "node22" };
    var edge28 = { "from": "node18", "to": "node19" };
    var edge29 = { "from": "node18", "to": "node20" };
    var edge30 = { "from": "node18", "to": "node21" };
    var edge31 = { "from": "node19", "to": "node22" };
    var edge32 = { "from": "node20", "to": "node19" };
    var edge33 = { "from": "node20", "to": "node17" };
    var edge34 = { "from": "node20", "to": "node23" };
    var edge35 = { "from": "node21", "to": "node18" };
    var edge36 = { "from": "node22", "to": "node16" };
    var edge37 = { "from": "node23", "to": "node17" };
    var edge38 = { "from": "node23", "to": "node24" };
    var edge39 = { "from": "node24", "to": "node19" };
    var edge40 = { "from": "node24", "to": "node25" };
    var edge41 = { "from": "node24", "to": "node26" };
    var edge42 = { "from": "node25", "to": "node24" };
    var edge43 = { "from": "node26", "to": "node17" };
    var edge44 = { "from": "node26", "to": "node27" };
    var edge45 = { "from": "node27", "to": "node17" };
    var edge46 = { "from": "node27", "to": "node28" };
    var edge47 = { "from": "node28", "to": "node29" };
    var edge48 = { "from": "node28", "to": "node19" };
    var edge49 = { "from": "node29", "to": "node28" };

    return [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11, edge12, edge13, edge14, edge15, edge16, edge17, edge18, edge19, edge20, edge21, edge22, edge23, edge24, edge25, edge26, edge27, edge28, edge29, edge30, edge31, edge32, edge33, edge34, edge35, edge36, edge37, edge38, edge39, edge40, edge41, edge42, edge43, edge44, edge45, edge46, edge47, edge48, edge49];

};

function getVardeBevakarenVertices() {
    var node0 = { "label": "node0" ,markNode :true}
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
    var node12 = { "label": "node12" }
    var node13 = { "label": "node13" }
    var node14 = { "label": "node14" }
    var node15 = { "label": "node15" }
    var node16 = { "label": "node16" }
    var node17 = { "label": "node17" }
    var node18 = { "label": "node18" }
    var node19 = { "label": "node19" }
    var node20 = { "label": "node20" }
    var node21 = { "label": "node21" }
    var node22 = { "label": "node22" }
    var node23 = { "label": "node23" , markNode : true}


    return [node0, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11, node12, node13, node14, node15, node16, node17, node18, node19, node20, node21, node22, node23];
};

function getVardeBevakarenEdges() {
    var edge0 = { "from": "node0", "to": "node1" };
    var edge1 = { "from": "node1", "to": "node1" };
    var edge2 = { "from": "node1", "to": "node2" };
    var edge3 = { "from": "node2", "to": "node3" };
    var edge4 = { "from": "node2", "to": "node4" };
    var edge5 = { "from": "node2", "to": "node23" };
    var edge6 = { "from": "node3", "to": "node7" };
    var edge7 = { "from": "node3", "to": "node23" };
    var edge8 = { "from": "node4", "to": "node3" };
    var edge9 = { "from": "node4", "to": "node5" };
    var edge10 = { "from": "node5", "to": "node3" };
    var edge11 = { "from": "node5", "to": "node6" };
    var edge12 = { "from": "node6", "to": "node3" };
    var edge13 = { "from": "node7", "to": "node23" };
    var edge14 = { "from": "node7", "to": "node8" };
    var edge15 = { "from": "node8", "to": "node23" };
    var edge16 = { "from": "node8", "to": "node22" };
    var edge17 = { "from": "node8", "to": "node9" };
    var edge40 = { "from": "node9", "to": "node10" };
    var edge18 = { "from": "node9", "to": "node12" };
    var edge19 = { "from": "node10", "to": "node12" };
    var edge20 = { "from": "node10", "to": "node11" };
    var edge21 = { "from": "node11", "to": "node12" };
    var edge22 = { "from": "node12", "to": "node13" };
    var edge23 = { "from": "node12", "to": "node23" };
    var edge24 = { "from": "node13", "to": "node23" };
    var edge25 = { "from": "node13", "to": "node14" };
    var edge26 = { "from": "node14", "to": "node15" };
    var edge27 = { "from": "node14", "to": "node20" };
    var edge28 = { "from": "node15", "to": "node15" };
    var edge29 = { "from": "node15", "to": "node16" };
    var edge30 = { "from": "node16", "to": "node17" };
    var edge31 = { "from": "node16", "to": "node3" };
    var edge32 = { "from": "node17", "to": "node3" };
    var edge33 = { "from": "node17", "to": "node18" };
    var edge34 = { "from": "node18", "to": "node3" };
    var edge35 = { "from": "node18", "to": "node19" };
    var edge36 = { "from": "node19", "to": "node3" };
    var edge37 = { "from": "node20", "to": "node21" };
    var edge38 = { "from": "node20", "to": "node20" };
    var edge39 = { "from": "node21", "to": "node3" };

    return [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11, edge12, edge13, edge14, edge15, edge16, edge17, edge18, edge19, edge20, edge21, edge22, edge23, edge24, edge25, edge26, edge27, edge28, edge29, edge30, edge31, edge32, edge33, edge34, edge35, edge36, edge37, edge38, edge39, edge40];

};

function getSlutPrisPrenumerationVertices() {
    var node0 = { "label": "node0", markNode:true }
    var node1 = { "label": "node1" }
    var node2 = { "label": "node2" }
    var node3 = { "label": "node3" }
    var node4 = { "label": "node4" }
    var node5 = { "label": "node5" }
    var node6 = { "label": "node6" }
    var node7 = { "label": "node7" ,markNode:true}
    var node8 = { "label": "node8" }
    var node9 = { "label": "node9" }
    var node10 = { "label": "node10" }
    var node11 = { "label": "node11" }
    var node12 = { "label": "node12" }
    var node13 = { "label": "node13" }
    var node14 = { "label": "node14" }


    return [node0, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11, node12, node13, node14];
};

function getSlutPrisPrenumerationEdges() {
    var edge0 = { "from": "node0", "to": "node1" };
    var edge1 = { "from": "node1", "to": "node3" };
    var edge2 = { "from": "node1", "to": "node4" };
    var edge3 = { "from": "node2", "to": "node1" };
    var edge4 = { "from": "node5", "to": "node1" };
    var edge5 = { "from": "node2", "to": "node7" };
    var edge6 = { "from": "node3", "to": "node6" };
    var edge7 = { "from": "node3", "to": "node7" };
    var edge8 = { "from": "node4", "to": "node7" };
    var edge9 = { "from": "node4", "to": "node8" };
    var edge10 = { "from": "node5", "to": "node7" };
    var edge11 = { "from": "node6", "to": "node2" };
    var edge12 = { "from": "node6", "to": "node9" };
    var edge13 = { "from": "node6", "to": "node10" };
    var edge14 = { "from": "node8", "to": "node11" };
    var edge15 = { "from": "node8", "to": "node12" };
    var edge16 = { "from": "node8", "to": "node5" };
    var edge17 = { "from": "node9", "to": "node2" };
    var edge18 = { "from": "node9", "to": "node13" };
    var edge19 = { "from": "node10", "to": "node13" };
    var edge20 = { "from": "node11", "to": "node5" };
    var edge21 = { "from": "node12", "to": "node5" };
    var edge22 = { "from": "node13", "to": "node2" };
    var edge23 = { "from": "node13", "to": "node14" };
    var edge24 = { "from": "node14", "to": "node2" };

    return [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11, edge12, edge13, edge14, edge15, edge17, edge18, edge19, edge20, edge21, edge22, edge23, edge24];

};