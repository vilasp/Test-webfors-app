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
    var dummies = true;

    //Start by extracting subgraphs and create their positioning within the subgraph
    var highestVertexNumber = {highestNumber : 0};

    //var vertices = getTestVertices();
    //var edges = getTestEdges();

    //var vertices = getNyAnstalldVertices();
    //var edges = getNyAnstalldEdges();

   // var vertices = getEfterAffarVertices();
    //var edges = getEfterAffarEdges();

    //var vertices = getVardeBevakarenVertices();
    //var edges = getVardeBevakarenEdges();

    var vertices = getSlutPrisPrenumerationVertices();
    var edges = getSlutPrisPrenumerationEdges();

    var subgraphs = extractAndCreateSubGraphs(vertices,edges,highestVertexNumber);

    //Add all of the subgraphs to a array of layered subgraphs
    var subLayouts = {},
        subgraphKeys = Object.keys(subgraphs);

    

    for (var i = 1; i < subgraphKeys.length; i++) {
        subLayouts[subgraphKeys[i]] = constructGraph(subgraphs[subgraphKeys[i]].vertices, subgraphs[subgraphKeys[i]].edges, highestVertexNumber, dummies);
    }

    //Change and store all the values of each subgraph so that the normal layering algorithm can be used
    changeAndStoreSubgraphValues(subLayouts, subgraphKeys);

    var graph = constructClusticGraph(dummies, subgraphs, subLayouts, subgraphKeys, highestVertexNumber);

    for (var i = 0; i < graph.vertices.length; i++) {

        //Revers of layer
        var reverseLayer = graph.layering.length - graph.vertices[i].layer;
        graph.vertices[i].layer = reverseLayer;
    };


    //draw vertices
    createVertices(graph.vertices);

    //createClusterVertices(graph.subgraphs.cluster1.vertices);

    //draw edges
    createEdges(graph.edges);

    //Make all components draggable
    jsPlumb.draggable($('.component'));

});

//Create and draw all vertices in the graph
function createVertices(vertices) {

    //For each vertice in the graph
    $.each(vertices, function () {

        var dummyAllignment = 0;

        //create vertex and append it to drawing area
        var tempVertex = jQuery('<div/>', {
            id: this.label,
            text: this.label
        }).appendTo('#drawing-area');

        if (this.markNode)
            tempVertex.addClass('marked');

        //add vertex-class
        tempVertex.addClass('component');

        if (this.dummy) {
            tempVertex.addClass('dummy');
            tempVertex.empty();
            dummyAllignment = 20;
        }
        if (this.cluster !== undefined)
            tempVertex.addClass('cluster');

        //Set appropriate coordinates of vertex
        tempVertex.css({
            'left': ((this.xCoordinate) * 50) + dummyAllignment,
            'top': this.layer * 60
        });

        //Update references in jsPlumb
        jsPlumb.setIdChanged(this.label, this.label);
    });
};

function createClusterVertices(vertices) {

    //For each vertice in the graph
    $.each(vertices, function () {

        var dummyAllignment = 0;

        //create vertex and append it to drawing area
        var tempVertex = jQuery('<div/>', {
            id: this.label,
            text: this.label
        }).appendTo('#drawing-area');

        //add vertex-class
        tempVertex.addClass('component');

        if (this.dummy) {
            tempVertex.addClass('dummy');
            tempVertex.empty();
            dummyAllignment = 20;
        }
        if (this.cluster !== undefined)
            tempVertex.addClass('cluster');

        //Set appropriate coordinates of vertex
        tempVertex.css({
            'left': ((this.clusterxCoordinate+2) * 100) + dummyAllignment,
            'top': this.clusterLayer * 100
        });
    });
};


//Create and draw all edges in the graph
function createEdges(edges) {

    //Declare all possible positions of endpoints
    //var dynamicAnchors = ["Top", "TopRight", "TopLeft", "Right", "Left", "BottomLeft", "Bottom", "BottomRight"];
    var dynamicAnchors = ["Top", "Right", "Left", "Bottom"];

    //For each edge, create a connection between TO and FROM with an arrow pointing in the direction of the flow
    $.each(edges, function () {

        if (this.dummies === undefined) {
            //Decide on connector drawing style
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
                connector: connectorStyle
            });

            if (!$('#' + this.to).hasClass('dummy'))
                edge.addOverlay(["Arrow", { width: 5, length: 5, location: 1 }]);
        }
    });
};

function extractAndCreateSubGraphs(vertices,edges,highestVertexNumber) {
    var vertices = vertices,
        edges = edges;

    highestVertexNumber.highestNumber = (getHighestVerticeNumber(highestVertexNumber ,vertices.length));
    var subgraphs = { remaining: { vertices: [], edges: [], numberOfOriginalVertices: highestVertexNumber} };


    $.each(vertices, function () {

        if (this.cluster !== undefined) {

            if (subgraphs[this.cluster] === undefined) {
                subgraphs[this.cluster] = { vertices: [this], edges: [], numberOfOriginalVertices: highestVertexNumber };
            }

            else if (subgraphs[this.cluster] !== undefined) {
                subgraphs[this.cluster].vertices.push(this);
            }

        }

        else {
            subgraphs.remaining.vertices.push(this);
        }

    });



    $.each(edges, function () {
        var currentEdge = this,
            isEdgePartOfCluster = false;

        $.each(subgraphs, function () {

            if (checkIfEdgeIsInCluster(this, currentEdge)) {
                this.edges.push(currentEdge);
                isEdgePartOfCluster = true;
            }

        });

        if (!isEdgePartOfCluster)
            subgraphs.remaining.edges.push(this);

    });

    return subgraphs;
};

//Checks if an edge is part of the current cluster
function checkIfEdgeIsInCluster(cluster, edge) {
    var to = false,
        from = false;

    $.each(cluster.vertices, function () {
        if (this.label === edge.from)
            from = true;
        else if (this.label === edge.to)
            to = true;
    });

    if (to && from)
        return true;
    else
        return false;
};

function changeAndStoreSubgraphValues(subgraphs, subgraphKeys) {


    $.each(subgraphs, function () {

        //Change and store vertices and their values
        $.each(this.vertices, function(){
            this['clusterLayer'] = this.layer;
            this['clusterLayerX'] = this.layerX;
            this['clusterxCoordinate'] = this.xCoordinate;
            this.layer = true;
            this.layerX = true;
            this.xCoordinate = true;

            
        });

        //Add a value to an edge indicating that this edge is part of a cluster and should be ignored in the layering
        $.each(this.edges,function(){
            this['partOfCluster'] = true;
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
    var edge19 = { "to": "node1", "from": "node5" };
    var edge20 = { "to": "node2", "from": "node10" };
    var edge21 = { "to": "node4", "from": "node8" };
    var edge22 = { "to": "node7", "from": "node1" };
    //return [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11, edge12, edge18, edge14, edge15, edge16, edge17, edge13];
    //return [edge0, edge1, edge2, edge3, edge20, edge21, edge4, edge5, edge6, edge7, edge8, edge9, edge19, edge10, edge11, edge12, edge18, edge14, edge15, edge16, edge17, edge13];
    //return [edge3, edge4, edge7,edge15,edge20,edge21, edge9, edge10, edge12, edge13, edge14];
    return [edge0, edge1, edge2,edge19,edge20,edge22, edge3, edge4, edge5, edge6,edge8, edge7, edge9, edge10, edge11, edge12, edge18, edge14, edge15, edge16, edge17, edge13];
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

function getTestClusterVertices() {

    var node0 = { "label": "node0" }
    var node1 = { "label": "node1"}
    var node2 = { "label": "node2"}
    var node3 = { "label": "node3", cluster : 'cluster2'}
    var node4 = { "label": "node4", cluster: 'cluster1' }
    var node5 = { "label": "node5", cluster: 'cluster2' }
    var node6 = { "label": "node6", cluster: 'cluster1' }
    var node7 = { "label": "node7", cluster: 'cluster2' }
    var node8 = { "label": "node8", cluster: 'cluster1' }
    var node9 = { "label": "node9", cluster: 'cluster1' }
    var node10 = { "label": "node10" }
    var node11 = { "label": "node11" }

    //, staticToVertex: { to: 'node2', yAxis: 'below' }
    return [node0, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11];
    //return[node2,node4, node6,node9,node8,node10];
};

function getNyAnstalldVertices() {
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
    var node23 = { "label": "node23", markNode: true }

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
    var node11 = { "label": "node11" }
    var node12 = { "label": "node12" }
    var node13 = { "label": "node13" }
    var node14 = { "label": "node14" }
    var node15 = { "label": "node15" }
    var node16 = { "label": "node16", markNode: true }
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
    var node23 = { "label": "node23", markNode: true }


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
    var node0 = { "label": "node0", markNode: true }
    var node1 = { "label": "node1" }
    var node2 = { "label": "node2", cluster: 'cluster1' }
    var node3 = { "label": "node3" }
    var node4 = { "label": "node4", cluster: 'cluster2' }
    var node5 = { "label": "node5", cluster: 'cluster2' }
    var node6 = { "label": "node6", cluster: 'cluster1' }
    var node7 = { "label": "node7", markNode: true }
    var node8 = { "label": "node8", cluster: 'cluster2' }
    var node9 = { "label": "node9" ,cluster : 'cluster1'}
    var node10 = { "label": "node10", cluster: 'cluster1' }
    var node11 = { "label": "node11", cluster: 'cluster2' }
    var node12 = { "label": "node12", cluster: 'cluster2' }
    var node13 = { "label": "node13", cluster: 'cluster1' }
    var node14 = { "label": "node14", cluster: 'cluster1' }


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

    return [edge0, edge4, edge10, edge1, edge2, edge3, edge5, edge6, edge7, edge8, edge9, edge11, edge12, edge13, edge14, edge15, edge17, edge18, edge19, edge20, edge21, edge22, edge23, edge24];

};
/************************ CLuster breathing phase ************************************/

function inhale(graph) {

    $.each(graph.subgraphs,function()
    {
        
        var collapsedCluster = {collapsedVertices : [], collapsedEdges : [], originalEdges : [], originalVertices : []},
            currentLayer = 0,
            currentCluster = this;

        $.each(this.layering,function()
        {

            if (this.length > 1 )
            {
                var tmpParent = { layer: currentLayer + 1, cluster : this[0].cluster },
                    type = 'nonClustic',
                    direction = 'down';
                var collapsedClusterLayer = createDummyVertex(currentCluster, tmpParent, type, graph.numberOfOriginalVertices, direction);
                    currentCluster.layering[currentLayer].splice(currentCluster.layering[currentLayer].length-1, 1);
                    collapsedClusterLayer['originalVerticesInCluster'] = [];
                    collapsedClusterLayer.dummy = false;
                    

                for (var i = 0; i < this.length; i++) {
                    var originalVertex = $.extend(true, {}, this[i]);

                    collapsedClusterLayer['clusterLayer'] = originalVertex.clusterLayer;
                    collapsedClusterLayer['clusterLayerX'] = originalVertex.clusterLayerX;
                    collapsedClusterLayer['clusterxCoordinate'] = originalVertex.clusterxCoordinate;


                    collapsedClusterLayer['originalVerticesInCluster'].push(originalVertex);

                    for(var j = 0; j < graph.edges.length; j++)
                    {
                        var tmpEdge = undefined,
                            currentEdge = graph.edges[j];
                       

                        if (currentEdge.from === originalVertex.label)
                        {
                            tmpEdge = createDummyEdge(graph, { label: collapsedClusterLayer.label }, { label: currentEdge.to })
                        }
                        else if (currentEdge.to === originalVertex.label)
                        {
                            tmpEdge = createDummyEdge(graph, { label: currentEdge.from }, { label: collapsedClusterLayer.label })
                        }
                        if(tmpEdge !== undefined)
                        {

                            var originalEdge = $.extend(true, {}, graph.edges[j]),
                                firstTmpEdge = collapsedEdgeAlreadyExists(collapsedCluster.collapsedEdges ,tmpEdge);

                            graph.edges.splice(graph.edges.length - 1, 1);
                            graph.edges.splice(j, 1);
                            j--;

                            tmpEdge['partOfCollapsedCluster'] = true;
                            tmpEdge['originalEdge'] = originalEdge;
                            tmpEdge['reversed'] = originalEdge.reversed;

                            collapsedCluster.originalEdges.push(originalEdge);

                            if (firstTmpEdge === undefined) {
                                collapsedCluster.collapsedEdges.push(tmpEdge);
                                graph.edges.push(tmpEdge);
                            }
                                

                            var numberVericesInCluster = 0;

                            $.each(currentCluster.vertices, function () {
                                if (this.label === tmpEdge.to || this.label === tmpEdge.from)
                                    numberVericesInCluster++;
                            });

                            if (numberVericesInCluster === 1)
                                tmpEdge['partiallyInCluster'] = true;
                        }
                    }
                    
                    collapsedCluster.originalVertices.push(originalVertex);
                }

                currentCluster.layering[currentLayer] = [collapsedClusterLayer];
                collapsedCluster.collapsedVertices.push(collapsedClusterLayer);
            }
            else
            {
                collapsedCluster.collapsedVertices.push(this[0]);
            }
            
            currentLayer++;

        });

        this.vertices = collapsedCluster.collapsedVertices;
        this.edges = collapsedCluster.collapsedEdges;
        this['originalEdges'] = collapsedCluster.originalEdges;

    });

    return graph;
};

function collapsedEdgeAlreadyExists(collapsedEdges,edge) {

    findEdge = undefined;

    $.each(collapsedEdges, function () {
        if (this.from === edge.from && this.to === edge.to)
            findEdge = this;
    });

    return findEdge;
};

function exhale(graph) {
    $.each(graph.subgraphs, function () {

        var clusterBoxSize = getClusterBoxSize(this),
            firstClusterVertex = this.vertices[0],
            clusterXCoordinate = firstClusterVertex.xCoordinate;
            
        $.each(graph.vertices, function () {
            if (this.cluster !== firstClusterVertex.cluster && this.xCoordinate > firstClusterVertex.xCoordinate) {
                this.xCoordinate  += clusterBoxSize.clusterXSpan;
            }
        });

        this.vertices = clusterBoxSize.clusterOriginalVertices;

        $.each(this.vertices, function () {
            this.xCoordinate = clusterXCoordinate + this.clusterxCoordinate - clusterBoxSize.left;
        });

        $.merge(graph.vertices, this.vertices);

        this.edges = this.originalEdges;

    });
};

function getClusterBoxSize(cluster) {
    var left = 100000000,
        right = -100000000,
        clusterOriginalVertices = [];

    $.each(cluster.vertices, function () {

        if (this.originalVerticesInCluster !== undefined)
        {
            var collapsedVertex = this;
            $.each(this.originalVerticesInCluster, function () {
                clusterOriginalVertices.push(this);
                if (this.clusterxCoordinate < left)
                    left = this.clusterxCoordinate;
                if (this.clusterxCoordinate > right)
                    right = this.clusterxCoordinate;
                if (this.xCoordinate) {
                    this.xCoordinate = this.clusterxCoordinate;
                    this.layer = collapsedVertex.layer;
                }
                    
            });
        }
        else
        {
            clusterOriginalVertices.push(this);
            if (this.clusterxCoordinate < left)
                left = this.clusterxCoordinate;
            if (this.clusterxCoordinate > right)
                right = this.clusterxCoordinate;
        }

    });

    return { clusterOriginalVertices: clusterOriginalVertices, clusterXSpan: (right - left),left:left,right:right };
}

/************************ End of cluster breathing phase *****************************/

/************************ Graph construction start ***********************************/
function constructGraph(vertices, edges, highestNumberVertex, dummies) {
    var graph = { vertices: [], edges: [], adjacencyList: [], numberOfOriginalVertices: highestNumberVertex };

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

    //Remove two loops and store them separately 
    var twoLoopEdges = removeAndStoreTwoLoops(graph);

    //Step 1 - Contruct a FAS-set, returns an array where [0] = edges not in FAS, [1] = FAS
    /*if (getSources([], graph).length === 1)
        var fas = realBergerAndShor(graph);
    else*/
        var fas = cycleRemoval(graph);

    //Step 1.1 - Reverse edges left in FAS
    reverseEdgesInFas(fas[1]);

    //Step 1.2 - Update graph with new structure
    var newEdges = $.merge(fas[0], fas[1]);
    graph.edges = newEdges;
    graph.adjacencyList = [];
    assigningVertexAndLabelNumber(graph);
    setNeighbors(graph);

    //Get all sinks of cluster
    var sinks = getSinks([], graph);
    $.each(sinks, function () {
        this['clusterSink'] = true;
    });

    //Step 2 - Remove  vertices under static constraints on y position
    var verticesUnderConstraints = removeAndStoreVerticesUnderConstraints(graph, 'y');

    //Step 2.1 - Make a layering of the graph
    var layeredVertices = longestPath(graph);
    graph.vertices = layeredVertices[0];
    graph['layering'] = layeredVertices[1];

    //Step 2.2 - Reintroduce vertices under static constraints
    reIntroduceStaticConstraintsVertices(graph, verticesUnderConstraints, 'y');

    //Step 2.3 - Make proper layering
    var removedOriginalEdges = makeProperLayering(graph );

    //Step 2.4 - Remove leftover edges in the graph
    removeAllNeighbors(graph);

    //Step 2.5 - Add all the edges, original + dummies
    setNeighbors(graph);

    //Step 3 - Remove all vertices with constraints on x position
    var verticesUnderConstraints = removeAndStoreVerticesUnderConstraints(graph, 'x');

    //Step 3.1 - Edge crossing minimization
    edgeCrossingMinimization(graph);

    //Step 3.2 - Reintroduce removed vertices back into the vertices set
    reIntroduceStaticConstraintsVertices(graph, verticesUnderConstraints, 'x');

    //Step 4 - x-coordinate assignment
    edgeStraightening(graph);

    //Step 5 - Reverse vertices layering so bottom is top and top is bottom
    /*  for (var i = 0; i < graph.vertices.length; i++) {
  
          //Revers of layer
          var reverseLayer = graph.layering.length - graph.vertices[i].layer;
          graph.vertices[i].layer = reverseLayer;
      };*/

    if (!dummies) {
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
    }


    //$.merge(graph.edges, removedOriginalEdges);

    //Step 5.3 - Reverse fas edges back to original direction
    removeDuplicateEdges(graph.edges)
    //var reversedFas = reverseEdgesInFas(fas[1]);
   // $.merge(graph.edges, fas[1]);

    //Step 5.4 - Add all two loop, self loop edges and all edges replacing dummy edges back to the edge set
    graph['fas'] = fas[1];
    graph['twoLoops'] = twoLoopEdges;
    graph['selfLoops'] = selfLoopEdges;
    //removeDuplicateEdges(dummyVerticesAndEdges[2])
    //$.merge(graph.edges, dummyVerticesAndEdges[2]);

    return graph;


};
/************************ Graph construction end **************************************/

/************************ CluStic Graph construction start ***********************************/
function constructClusticGraph(dummies, subgraphs, sublayouts, subgraphKeys, highestNumberVertex) {
    var graph = { vertices: [], edges: [], adjacencyList: [], numberOfOriginalVertices: highestNumberVertex };

    graph.edges = subgraphs.remaining.edges;
    graph.vertices = subgraphs.remaining.vertices;
    graph.subgraphs = sublayouts;

    $.each(graph.subgraphs, function () {
        $.merge(graph.edges, this.edges);
        $.merge(graph.vertices, this.vertices);
    });


    //Assign labels to each node and init adjacency lists
    assigningVertexAndLabelNumber(graph);

    //Remove self loop edges and store separately
    var selfLoopEdges = removeAndStoreSelfLoops(graph);

    //Set neighbors of all vertices in the graph
    setNeighbors(graph);

    //Calculate the distance matrix
    graph['distanceMatrix'] = createDistanceMatrix(graph);

    //Remove two loops and store them separately 
    var twoLoopEdges = removeAndStoreTwoLoops(graph);

    //Step 1 - Contruct a FAS-set, returns an array where [0] = edges not in FAS, [1] = FAS
    /*if (getSources([], graph).length === 1)
        var fas = realBergerAndShor(graph);
    else*/
    var fas = cycleRemoval(graph);

    //Step 1.1 - Reverse edges left in FAS
    reverseEdgesInFas(fas[1]);

    
    //Step 1.2 - Update graph with new structure
    var newEdges = $.merge(fas[0], fas[1]);
    graph.edges = newEdges;
    graph.adjacencyList = [];

    for (var i = 0; i < graph.vertices.length; i++) {
        if (graph.vertices[i].cluster !== undefined) {
            graph.vertices.splice(i, 1);
            i--;
        }
    }

    //Perfrom the inhale step of the breating phase
    inhale(graph)

    //Merge all vertices and edges from subgraphs with the original sets
    $.each(graph.subgraphs, function () {
        $.merge(graph.vertices, this.vertices);
        //$.merge(graph.edges, this.edges);
    });
        

    //Update new graph structure
    assigningVertexAndLabelNumber(graph);
    setNeighbors(graph);

    //Step 2 - Remove  vertices under static constraints on y position
    var verticesUnderConstraints = removeAndStoreVerticesUnderConstraints(graph, 'y');

    //Step 2.1 - Make a layering of the graph
    var layeredVertices = clusticLongestPath(graph,'clustic');
    graph.vertices = layeredVertices[0];
    graph['layering'] = layeredVertices[1];

    //Step 2.2 - Reintroduce vertices under static constraints
    reIntroduceStaticConstraintsVertices(graph, verticesUnderConstraints, 'y');


    //Step 2.3 - Make proper layering
    var type = 'clustic';
    var removedOriginalEdges = makeProperLayering(graph,type);

    //Step 2.4 - Remove leftover edges in the graph
    removeAllNeighbors(graph);

    //Step 2.5 - Add all the edges, original + dummies
    setNeighbors(graph);

    //Step 3 - Remove all vertices with constraints on x position
    var verticesUnderConstraints = removeAndStoreVerticesUnderConstraints(graph, 'x');

    //Step 3.1 - Edge crossing minimization
    clusticEdgeCrossingMinimization(graph);

    //Step 3.2 - Reintroduce removed vertices back into the vertices set
    reIntroduceStaticConstraintsVertices(graph, verticesUnderConstraints, 'x');

    //Step 4 - x-coordinate assignment
    clusticEdgeStraightening(graph);

    //Step 5 - Reverse vertices layering so bottom is top and top is bottom
    /*  for (var i = 0; i < graph.vertices.length; i++) {
  
          //Revers of layer
          var reverseLayer = graph.layering.length - graph.vertices[i].layer;
          graph.vertices[i].layer = reverseLayer;
      };*/

    if (!dummies) {
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
    }

    for (var i = 0; i < graph.vertices.length; i++) {
        if (graph.vertices[i].cluster !== undefined) {
            graph.vertices.splice(i, 1);
            i--;
        }
    }

    exhale(graph);
    

    for (var i = 0; i < graph.edges.length; i++) {
        if (graph.edges[i].partOfCollapsedCluster) {
            graph.edges.splice(i, 1);
            i--;
        }

        else if(graph.edges[i].partiallyInCluster){
            graph.edges.splice(i, 1);
            i--;
        }
            
    }

    removeDuplicateEdges(graph.edges)

    var longPartialInClusterEdges = [];
    $.each(removedOriginalEdges, function () {
        if (this.partiallyInCluster)
        {
            var currentVertex = this;
            $.each(this.dummies.dummyEdges, function () {
                if (this.originalEndVertex) {
                    currentVertex.to = this.originalEndVertex;
                    this.to = this.originalEndVertex;
                }
                    
            });

            longPartialInClusterEdges.push(this);
        }
       
    });

    $.each(graph.subgraphs, function () {
        //$.merge(graph.vertices, this.vertices);
        
        //Step 5.2 - Remove all dummy edges
        for (var i = 0; i < this.edges.length; i++) {
            var currentEdge = this.edges[i],
                edgeAlreadyExists = false;
            $.each(longPartialInClusterEdges, function () {
                if (this.from === currentEdge.from && this.to === currentEdge.to)
                    edgeAlreadyExists = true;
            });

            if (!edgeAlreadyExists && !currentEdge.partOfCollapsedCluster)
                graph.edges.push(currentEdge);
        }
    });

    $.each(longPartialInClusterEdges, function () {
        $.each(this.dummies.dummyEdges, function () {
            graph.edges.push(this);
        });
        
    });
    //$.merge(graph.edges, removedOriginalEdges);

    //Step 5.3 - Reverse fas edges back to original direction
    // removeDuplicateEdges(graph.edges)

    //Merge all fa sets original sets
    $.each(graph.subgraphs, function () {
        $.merge(fas[1], this.fas);
        $.merge(twoLoopEdges, this.twoLoops);
        $.merge(selfLoopEdges, this.selfLoops);
    });

    for (var i = 0; i < fas[1].length; i++) {
        var fasEdge = fas[1][i];
        for (var j = 0; j < longPartialInClusterEdges.length; j++) {
            if (fasEdge.from === longPartialInClusterEdges[j].from && fasEdge.to === longPartialInClusterEdges[j].to) {
                fas[1].splice(i, 1);
                i--;
            }
                
        }
    }

    

    for (var i = 0; i < fas[1].length; i++) {
        if (fas[1][i].dummies !== undefined) {
            $.each(fas[1][i].dummies.dummyEdges, function () {
                graph.edges.push(this);
            });
            fas[1].splice(i, 1);
            i--;
        }
    }



    var tmpTwoLoopEdge = undefined;

    for (var i = 0; i < twoLoopEdges.length; i++) {
        var currentTwoLoopEdge = twoLoopEdges[i];
        $.each(graph.edges, function () {
            if (currentTwoLoopEdge.from === this.to && currentTwoLoopEdge.to === this.from) {
                tmpTwoLoopEdge = $.extend(true, {}, this);
                tmpTwoLoopEdge['index'] = i;
            }
        });
    }

    for (var i = 0; i < twoLoopEdges.length; i++) {
        var currentTwoLoopEdge = twoLoopEdges[i];
        $.each(longPartialInClusterEdges, function () {
            if (currentTwoLoopEdge.from === this.to && currentTwoLoopEdge.to === this.from) {
                tmpTwoLoopEdge = $.extend(true, {}, this);
                tmpTwoLoopEdge['index'] = i;
            }
        });
    }

    if (tmpTwoLoopEdge !== undefined) {
        if (tmpTwoLoopEdge.dummies !== undefined) {
            $.each(tmpTwoLoopEdge.dummies.dummyEdges, function () {
                var tmpFrom = this.from,
                    tmpTo = this.to;

                this.from = tmpTo;
                this.to = tmpFrom;

                graph.edges.push(this);
            })
            twoLoopEdges.splice(tmpTwoLoopEdge.index, 1);
        }
        else {
            graph.edges.push(currentTwoLoopEdge);
            twoLoopEdges.splice(tmpTwoLoopEdge.index, 1);
        }
    }

    

    $.merge(graph.edges, fas[1]);
    var reversedFas = reverseAllEdges(graph.edges);

    //Step 5.4 - Add all two loop, self loop edges and all edges replacing dummy edges back to the edge set    

    $.merge(graph.edges, twoLoopEdges);
    $.merge(graph.edges, selfLoopEdges);
    //removeDuplicateEdges(dummyVerticesAndEdges[2])
    //$.merge(graph.edges, dummyVerticesAndEdges[2]);

    return graph;


};
/************************ CluStic Graph construction end **************************************/

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

        if (from !== undefined && to !== undefined) {
            graph.adjacencyList[from.number].neighborsOut.push([currentEdge.to, to.number,to.cluster]);
            graph.adjacencyList[to.number].neighborsIn.push([currentEdge.from, from.number,from.cluster]);
        }
        else
            currentEdge['falseFasEdge'] = true;
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
                    if (isFurthestFromSource(graph, from, to) && !checksCreatedSourceOrSink(graph, to, from, currentEdge)) {
                        currentEdgeIsPartOfTwoLoop = true;
                        $.each(graph.adjacencyList[from.number].neighborsOut, function (removeIndex) {
                            if (this[0] === to.label)
                                graph.adjacencyList[from.number].neighborsOut.splice(removeIndex, 1);
                        });
                    }
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

//Check if the two loop edge is the one of the two where the from is furthest from the source node, preserving the possible layering of the graph
function isFurthestFromSource(graph, from, to) {
    var source = getSources([], graph);

    if (source[0] !== undefined && graph.distanceMatrix[source[0].label][from.label] > graph.distanceMatrix[source[0].label][to.label])
        return true;
    else{
        var fromNumber = from.label.substring(4, from.label.length),
            toNumber = to.label.substring(4, to.label.length);

        if (fromNumber > toNumber)
            return true;
    }

    return false;
}

//Check if the removal of this edge create a new source or sink 
function checksCreatedSourceOrSink(graph, to, from, currentEdge) {
    if (graph.adjacencyList[from.number].neighborsOut.length < 1 || graph.adjacencyList[to.number].neighborsIn.length < 1)
        return true;
    return false;
};

//Check if a edge already h ad a reversed brother
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

/*********************** Berger and Shor / enhanced greedy cycle removal ***********************
Works by successively removing sources and sinks from the graph and placing
them in separate sets. When no more sinks/ sources can be removed a vertex
with largest degree is chosen. When no more vertices exist in the graph 
the algorithm returns with a toplogical ordering of vertices. 
***************************************************************/
function realBergerAndShor(graph) {
    var fas = [],
        source = getSources([], graph)[0];



    for (var i = 0; i < graph.edges.length; i++) {

        var currentEdge = graph.edges[i];
        if (graph.distanceMatrix[source.label][currentEdge.from] > graph.distanceMatrix[source.label][currentEdge.to]) {
            fas.push(graph.edges[i]);
            graph.edges.splice(i, 1);
            i--;
        }
    }
    return [graph.edges, fas];
};

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

    for (var currentEdge = 0; currentEdge < graph.edges.length; currentEdge++) {
        if (graph.edges[currentEdge].falseFasEdge) {
            var tmpEdge = jQuery.extend(true, {}, graph.edges[currentEdge]);
            graph.edges.splice(currentEdge, 1);
            notFas.push(tmpEdge);
            currentEdge--;
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

function getClusterSinks(existingSinks, graph) {
    var sinks = [];

    $.each(graph.vertices, function () {
        if (graph.adjacencyList[this.number].neighborsIn.length > 0 && graph.adjacencyList[this.number].neighborsOut.length === 0) {
            if (this.cluster === undefined && !alreadyExist(existingSinks, this))
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

function reverseEdgesInFas(edges) {
    $.each(edges, function () {

        if (this.dummies !== undefined) {
            reverseEdgesInFas(this.dummies.dummyEdges);
        }
        //Store original values
        var to = this.to;
        var from = this.from;

        //Override original values with their reverse
        this.to = from;
        this.from = to;

        //Update reverse attribute so we can keep track of reversed edges
        if (this.reversed)
            this.reversed = false;
        else
            this.reversed = true;
    });
}

function reverseAllEdges(edges) {
    $.each(edges, function () {
        
        if (this.reversed) {
            //Store original values
            var to = this.to;
            var from = this.from;

            //Override original values with their reverse
            this.to = from;
            this.from = to;

            this.reversed = false
        }
    });
};

function getHighestVerticeNumber(highestVertexNumber,value) {
    if (value !== undefined)
        highestVertexNumber.highestNumber = value;

    highestVertexNumber.highestNumber++;

    return highestVertexNumber.highestNumber;
};

function getHighestEdgeLabel(graph) {
    return undefined
};

function removeAllNeighbors(graph) {
    $.each(graph.adjacencyList, function () {
        this.neighborsIn = [];
        this.neighborsOut = [];
    });
};
/****************************** Longest-path algrithm ************************************************/
function longestPath(graph,type) {
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

/****************************** Longest-path algrithm ************************************************/
function clusticLongestPath(graph, type) {
    var alreadyPicked = [],
        layering = [],
        currentLayerVertices = [],
        verticesUnderConstraints = [];
    var currentLayer = 1,
        type = 'clustic';
    var previousLayer = getClusterSinks([], graph);

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
        var currentMaxVertex = checkClusticMostEdgesInPreviousLayer(graph, previousLayer);

        //If vertex is found add to current layer being built and add to the already pick list
        if (currentMaxVertex !== undefined) {
            currentMaxVertex['layer'] = currentLayer;
            alreadyPicked.push(currentMaxVertex);
            currentLayerVertices.push(currentMaxVertex);
            removeVertex("source", graph, currentMaxVertex);

            if (type === 'clustic' && currentMaxVertex.cluster !== undefined) {
                currentLayer += assignAllVerticesInClusterToLayer(graph, currentMaxVertex, layering, alreadyPicked);
            }
        }

        //If no vertex is selected add the current layer
        if (currentMaxVertex === undefined || graph.vertices.length === 0) {
            
            if (layering[currentLayer] === undefined)
                layering[currentLayer] = currentLayerVertices;
            else
                $.merge(layering[currentLayer], currentLayerVertices)
            var tmpPrevious = $.merge(previousLayer, layering[currentLayer]);
            currentLayerVertices = [];
            currentLayer++;
        }
    };


    return [alreadyPicked, layering];

}

function assignAllVerticesInClusterToLayer(graph, currentMaxVertex, layering, alreadyPicked) {

    var lowestLayer = 0,
        tmpLayers = {};


    $.each(graph.subgraphs[currentMaxVertex.cluster].vertices, function () {
        if (this.label !== currentMaxVertex.label)
        {
            this.layer = (this.clusterLayer - currentMaxVertex.clusterLayer) + currentMaxVertex.layer;

            alreadyPicked.push(this);

            if (this.layer < lowestLayer) {
                lowestLayer = this.layer;
            }
            if (this.layer < 0)
            {
                if (tmpLayers[this.layer] === undefined)
                {
                    tmpLayers[this.layer] = [this]
                }
                else
                {
                    tmpLayers[this.layer].push(this);
                }
            }
            else
            {
                if (layering[this.layer] === undefined)
                    layering[this.layer] = [this];
                else
                    layering[this.layer].push(this)
            }
            
            removeVertex("source", graph, this);
        }
    });
    var howManyNewLayers = 0 - lowestLayer;
    if (lowestLayer < 0) {
        
        for (var i = lowestLayer; i < 0; i++) {
            layering.splice(0, 0, tmpLayers[i]);
        }
        for (var j = 0; j < layering.length;j++){
            $.each(layering[j],function(){
                this.layer += howManyNewLayers;
            });
        }
        currentMaxVertex.layer += howManyNewLayers;
        
    }
    return howManyNewLayers;
};

function checkMostEdgesInPreviousLayer(graph, previousLayer) {
    var maxVertex = undefined,
        max = 0;

    for (var index = 0; index < graph.vertices.length; index++) {

        var currentVertex = graph.vertices[index],
            currentVertexOutgoingEdges = graph.adjacencyList[currentVertex.number].neighborsOut,
            currentMaxCount = 0;


        //Select vertex with most outgoing edges in the previous layer
        $.each(currentVertexOutgoingEdges, function (){
            var tmpVertex = this;

            $.each(previousLayer, function (){
                if (this.label === tmpVertex[0]) 
                {
                    currentMaxCount++;
                }
            });
        });

        if (currentMaxCount === currentVertexOutgoingEdges.length && currentMaxCount !== 0)
            maxVertex = currentVertex;

    }
    return maxVertex;
}

function checkClusticMostEdgesInPreviousLayer(graph, previousLayer, alreadyPicked, currentLayerVertices) {
    var maxVertex = undefined,
        max = 0;

    for (var index = 0; index < graph.vertices.length; index++) {

        var currentVertex = graph.vertices[index],
            currentVertexOutgoingEdges = graph.adjacencyList[currentVertex.number].neighborsOut,
            currentMaxCount = 0,
            hasAtLeastOneInPreviousLayer = false;


        //Select vertex with most outgoing edges in the previous layer
        $.each(currentVertexOutgoingEdges, function () {
            var tmpVertex = this;

            $.each(previousLayer, function () {
                if (this.label === tmpVertex[0]) {
                    currentMaxCount++;
                    hasAtLeastOneInPreviousLayer = true;
                }
            });

            if (tmpVertex[2] !== undefined) {
                if (tmpVertex[2] === currentVertex.cluster) {
                    currentMaxCount++;
                }
            }

        });

        if (hasAtLeastOneInPreviousLayer && currentMaxCount === currentVertexOutgoingEdges.length && currentMaxCount !== 0)
            maxVertex = currentVertex;

    }
    return maxVertex;
}

//Removes one of the two vertices under constraints with each other
function removeAndStoreVerticesUnderConstraints(graph, type) {
    var verticesUnderConstraints = [];

    for (var i = 0; i < graph.vertices.length; i++) {
        var currentVertex = graph.vertices[i];
        if (currentVertex.staticToVertex !== undefined) {
            var tmpVertex = {};

            if (type === 'x' && currentVertex.staticToVertex.xAxis !== undefined) {
                tmpVertex['vertex'] = jQuery.extend(true, {}, currentVertex);
                for (var j = 0; j < graph.layering[currentVertex.layer].length; j++) {
                    if (graph.layering[currentVertex.layer][j].label === currentVertex.label)
                        graph.layering[currentVertex.layer].splice(j, 1);
                };
            }

            else if (type === 'y' && currentVertex.staticToVertex.yAxis !== undefined) {
                tmpVertex['vertex'] = jQuery.extend(true, {}, currentVertex);
            }

            if (!$.isEmptyObject(tmpVertex)) {
                tmpVertex['neighborsIn'] = graph.adjacencyList[tmpVertex.vertex.number].neighborsIn;
                tmpVertex['neighborsOut'] = graph.adjacencyList[tmpVertex.vertex.number].neighborsOut;
                verticesUnderConstraints.push(tmpVertex);
                removeVertex("largestDegree", graph, currentVertex);
            }
        }
    };
    return verticesUnderConstraints;
}

//Re introduces the removed vertices back into the set
function reIntroduceStaticConstraintsVertices(graph, verticesUnderConstraint, type) {
    $.each(verticesUnderConstraint, function () {

        if (type === 'y') {
            placeVertexInLayer(graph, this);
        }
        else if (type === 'x') {
            placeVertexInOrderInLayer(graph, this)
        }

        graph.vertices.push(this.vertex);
        graph.adjacencyList[this.vertex.number].neighborsIn = this.neighborsIn;
        graph.adjacencyList[this.vertex.number].neighborsOut = this.neighborsOut;
    });
};

function placeVertexInLayer(graph, currentVertex) {
    $.each(graph.vertices, function () {
        if (this.label === currentVertex.vertex.staticToVertex.to) {
            if (currentVertex.vertex.staticToVertex.yAxis === 'below') {
                if (this.layer === 0) {
                    currentVertex.vertex['layer'] = 0;
                    graph.layering.splice(0, 0, []);
                } else {
                    currentVertex.vertex['layer'] = this.layer - 1;
                }
            }
            else if (currentVertex.vertex.staticToVertex.yAxis === 'above') {
                currentVertex.vertex['layer'] = this.layer + 1;
            }
            graph.layering[currentVertex.vertex.layer].push(currentVertex.vertex);
        }
    });
};

function placeVertexInOrderInLayer(graph, currentVertex) {
    $.each(graph.vertices, function () {
        if (this.label === currentVertex.vertex.staticToVertex.to) {
            var fromIndex,
                toIndex,
                positionWithinLayer = getPositionWithinLayer(graph, this);

            if (currentVertex.vertex.staticToVertex.xAxis === 'left') {
                currentVertex.vertex['layerX'] = positionWithinLayer;
                fromIndex = positionWithinLayer;
            }
            else if (currentVertex.vertex.staticToVertex.xAxis === 'right') {
                currentVertex.vertex['layerX'] = positionWithinLayer + 1;
                fromIndex = positionWithinLayer + 1;
            }
            graph.layering[currentVertex.vertex.layer].splice(fromIndex, 0, currentVertex.vertex)
        }
    });
};

function getPositionWithinLayer(graph, searchVertex) {
    for (var i = 0; i < graph.layering[searchVertex.layer].length; i++) {
        if (graph.layering[searchVertex.layer][i].label == searchVertex.label)
            return i
    }
};
/****************************** End of longest path   ************************************************/

/****************************** Proper layering *****************************************************/
function makeProperLayering(graph, type, highestNumberVertex) {
    var oldEdges = [];

    for (var index = 0; index < graph.edges.length; index++) {
        var to, from;
        var currentEdge = graph.edges[index];
        var dummyVertices = [],
            dummyEdges = [];

        //Get vertices in edge
        $.each(graph.vertices, function () {
            if (currentEdge.from === this.label) from = this;
            else if (currentEdge.to === this.label) to = this;
        });

        if (currentEdge.dummies)
            delete currentEdge.dummies;

        var direction;
        if ((from.layer - to.layer) > 0)
            direction = 'down';
        else if (from.layer - to.layer < 0)
            direction = 'up';

        var span = Math.abs(from.layer - to.layer);

        if (span > 1) {
            for (var index1 = 0; index1 < span - 1; index1++) {
                if (index1 === 0)
                    dummyVertices.push(createDummyVertex(graph, from,type,graph.numberOfOriginalVertices,direction));
                else
                    dummyVertices.push(createDummyVertex(graph, dummyVertices[index1 - 1], type, graph.numberOfOriginalVertices,direction));
            };

            for (var index2 = 0; index2 < span; index2++) {

                var tmpEdge;
                if (index2 === 0) {
                    tmpEdge = createDummyEdge(graph, from, dummyVertices[index2]);
                    //updateAdjacencyList(graph, from, tmpDummies[index2]);
                }

                else if (index2 < span - 1) {
                    tmpEdge = createDummyEdge(graph, dummyVertices[index2 - 1], dummyVertices[index2]);
                    //updateAdjacencyList(graph, tmpDummies[index2 - 1], tmpDummies[index2]);
                }

                else {
                    tmpEdge = createDummyEdge(graph, dummyVertices[index2 - 1], to);
                    if (currentEdge.originalEdge !== undefined)
                        tmpEdge['originalEndVertex'] = currentEdge.originalEdge.to;
                    //updateAdjacencyList(graph, tmpDummies[index2-1], to);
                }
                if (currentEdge.partiallyInCluster)
                    tmpEdge['partiallyInCluster'] = true;
                tmpEdge['reversed'] = currentEdge.reversed;
                dummyEdges.push(tmpEdge);
            };
            currentEdge['dummies'] = { dummyVertices: dummyVertices, dummyEdges: dummyEdges };
            var originalEdge = jQuery.extend(true, {}, graph.edges[index]);
            oldEdges.push(originalEdge);
            graph.edges.splice(index, 1);
            index--;

        }
        else if(currentEdge.partiallyInCluster && !to.dummy && !from.dummy)
            delete currentEdge.partiallyInCluster;

    };
    return oldEdges;
};

function createDummyVertex(graph, fromParent, type,highestNumberVertex,direction) {
    var newDummyVertex = {};
    var highestVertexNumberTmp = getHighestVerticeNumber(highestNumberVertex);
    newDummyVertex['label'] = 'node' + highestVertexNumberTmp;
    newDummyVertex['number'] = highestVertexNumberTmp;
    if (direction === 'down' && fromParent.layer === 0)
    {
        newDummyVertex['layer'] = 0;
        graph.layering.splice(0, 0, []);
        $.each(graph.vertices, function () {
            this.layer++;
        });
    }
    else if (direction === 'down')
    {
        newDummyVertex['layer'] = fromParent.layer - 1;
    }
    else if (direction === 'up')
    {
        newDummyVertex['layer'] = fromParent.layer + 1;
    }


    if (fromParent.cluster !== undefined && type !== 'clustic')
        newDummyVertex['cluster'] = fromParent.cluster;
    newDummyVertex['dummy'] = true;
    graph.vertices.push(newDummyVertex);
    graph.layering[newDummyVertex.layer].push(newDummyVertex);
    graph.adjacencyList[newDummyVertex.number] = { neighborsIn: [], neighborsOut: [] };
    return newDummyVertex;
};

function createDummyEdge(graph, from, to) {
    var newDummyEdge = {};
    newDummyEdge['to'] = to.label;
    newDummyEdge['from'] = from.label;
    newDummyEdge['dummy'] = true;
    graph.edges.push(newDummyEdge);
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
    setWithinLayerXCoordinate(graph);

    //Until convergence to some value
    var convergenceValue = 100;
    for (var i = 0; i < convergenceValue; i++) {
        sweepDownUp(graph);
        sweepUpDown(graph);
    };
};

function clusticEdgeCrossingMinimization(graph) {
    setWithinLayerXCoordinate(graph);

    //Until convergence to some value
    var convergenceValue = 100;
    for (var i = 0; i < convergenceValue; i++) {
        clusticSweepDownUp(graph);
        clusticSweepUpDown(graph);
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
        if (colValue === 0)
            graph.layering[currentLayer][row]['barycenter'] = graph.layering[currentLayer][row]['xCoordinate'];
        else {
            graph.layering[currentLayer][row]['barycenter'] = colValue / numberOfEdges;
            graph.layering[currentLayer][row]['xCoordinate'] = colValue / numberOfEdges;
        }
    }
};

function clusticBarycenter(graph, currentLayer, incidentMatrix) {

    for (var row = 0; row < incidentMatrix.length; row++) {
        var colValue = 0, numberOfEdges = 0;
        for (var col = 0; col < incidentMatrix[row].length; col++) {
            if (incidentMatrix[row][col] === 1) {
                colValue += (col + 1);
                numberOfEdges++;
            }
        }

        //Prevent NaN
        if (colValue === 0)
            graph.layering[currentLayer][row]['barycenter'] = graph.layering[currentLayer][row]['xCoordinate'];
        else {
            graph.layering[currentLayer][row]['barycenter'] = colValue / numberOfEdges;
            graph.layering[currentLayer][row]['xCoordinate'] = colValue / numberOfEdges;
        }

        if (graph.layering[currentLayer][row].cluster !== undefined) {
            $.each(graph.subgraphs[graph.layering[currentLayer][row].cluster].vertices, function () {
                this['barycenter'] = graph.layering[currentLayer][row]['barycenter'];
                this['xCoordinate'] = this.barycenter;
            });
        }


    }
};

function removeBarycenter(graph, currentLayer) {
    for (var row = 0; row < graph.layering[currentLayer].length; row++) {
        delete graph.layering[currentLayer][row]['barycenter'];
    };
}

function clusticRemoveBarycenter(graph, currentLayer) {
    for (var row = 0; row < graph.layering[currentLayer].length; row++) {
        if (graph.layering[currentLayer][row] === undefined)
            delete graph.layering[currentLayer][row]['barycenter'];
    };
}

function removeBarycenterAllLayers(graph) {
    $.each(graph.layering, function () {
        for (var row = 0; row < this.length; row++) {
            delete this[row]['barycenter'];
        };
    });
    
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
function clusticSweepDownUp(graph) {
    //Sweep down -> up
    for (var currentLayer = 1; currentLayer < graph.layering.length; currentLayer++) {
        var incidentMatrix = fillIncidentMatrix(graph, graph.layering[currentLayer], graph.layering[currentLayer - 1]);
        clusticBarycenter(graph, currentLayer, incidentMatrix);
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

function clusticSweepUpDown(graph) {
    //Sweep up -> down
    for (var currentLayer = graph.layering.length - 2; currentLayer > -1; currentLayer--) {
        var incidentMatrix = fillIncidentMatrix(graph, graph.layering[currentLayer], graph.layering[currentLayer + 1]);
        clusticBarycenter(graph, currentLayer, incidentMatrix);
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

function clusticEdgeStraightening(graph) {
    //Set x-coordinate of all vertices in the graph
    setWithinLayerXCoordinate(graph);

    //Until convergence to some value
    clusticSweepXCoordinateDownUp(graph);
    removeBarycenterAllLayers(graph);
    clusticSweepXCoordinateUpDown(graph);
    removeBarycenterAllLayers(graph);
    clusticSweepXCoordinateDownUp(graph);
    removeBarycenterAllLayers(graph);
    clusticSweepXCoordinateUpDown(graph);

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
            (currentVertex.cluster !== undefined ? currentVertex['priority'] = 40000 : currentVertex.priority);
        }
        else if (type === 'upToDown') {
            (currentVertex.dummy) ? currentVertex['priority'] = 20000 : currentVertex['priority'] = graph.adjacencyList[currentVertex.number].neighborsIn.length;
            (currentVertex.cluster !== undefined ? currentVertex['priority'] = 40000 : currentVertex.priority);
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
        xCoordinateBarycenter(graph, currentLayer, incidentMatrix, graph.layering[currentLayer - 1], 'downToUp');

        //Copy the current layer into a new set for temporary removal
        var tmpCurrentLayer = jQuery.extend(true, [], graph.layering[currentLayer]);

        //Assign x-coordinates to vertices in current layer
        setXCoordinate(graph, tmpCurrentLayer, graph.layering[currentLayer]);

        //Remove Barycenter value from current layer
        removeBarycenter(graph, currentLayer);
    };
};

function clusticSweepXCoordinateDownUp(graph) {
    //Sweep down -> up
    for (var currentLayer = 1; currentLayer < graph.layering.length; currentLayer++) {

        //Get incident matrix for barycenter calculation
        var incidentMatrix = fillIncidentMatrix(graph, graph.layering[currentLayer], graph.layering[currentLayer - 1]);

        //Set priorities of the current layer
        setPriority(graph, currentLayer, 'downToUp');

        //Set the Barycenters of the current layer
        clusticXCoordinateBarycenter(graph, currentLayer, incidentMatrix, graph.layering[currentLayer - 1], 'downToUp');

        //Copy the current layer into a new set for temporary removal
        var tmpCurrentLayer = jQuery.extend(true, [], graph.layering[currentLayer]);

        //Assign x-coordinates to vertices in current layer
        clusticSetXCoordinate(graph, tmpCurrentLayer, graph.layering[currentLayer]);

        //Remove Barycenter value from current layer
        clusticRemoveBarycenter(graph, currentLayer);
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
        xCoordinateBarycenter(graph, currentLayer, incidentMatrix, graph.layering[currentLayer + 1], 'upToDown');

        //Copy the current layer into a new set for temporary removal
        var tmpCurrentLayer = jQuery.extend(true, [], graph.layering[currentLayer]);

        //Assign x-coordinates to vertices in current layer
        setXCoordinate(graph, tmpCurrentLayer, graph.layering[currentLayer]);

        //Remove Barycenter value from current layer
        removeBarycenter(graph, currentLayer);
    };
};


function clusticSweepXCoordinateUpDown(graph) {
    //Sweep up -> down
    for (var currentLayer = graph.layering.length - 2; currentLayer > -1; currentLayer--) {
        //Get incident matrix for barycenter calculation
        var incidentMatrix = fillIncidentMatrix(graph, graph.layering[currentLayer], graph.layering[currentLayer + 1]);

        //Set priorities of the current layer
        setPriority(graph, currentLayer, 'upToDown');

        //Set the Barycenters of the current layer
        clusticXCoordinateBarycenter(graph, currentLayer, incidentMatrix, graph.layering[currentLayer + 1], 'upToDown');

        //Copy the current layer into a new set for temporary removal
        var tmpCurrentLayer = jQuery.extend(true, [], graph.layering[currentLayer]);

        //Assign x-coordinates to vertices in current layer
        clusticSetXCoordinate(graph, tmpCurrentLayer, graph.layering[currentLayer]);

        //Remove Barycenter value from current layer
        clusticRemoveBarycenter(graph, currentLayer);
    };
};

function xCoordinateBarycenter(graph, currentLayer, incidentMatrix, fixedLayer, type) {

    for (var row = 0; row < incidentMatrix.length; row++) {
        var colValue = 0, numberOfEdges = 0;
        for (var col = 0; col < incidentMatrix[row].length; col++) {
            if (incidentMatrix[row][col] === 1) {
                colValue += fixedLayer[col].xCoordinate;
                numberOfEdges++;
            }
        }

        //Prevent NaN
        if (colValue === 0 && numberOfEdges === 0)
            graph.layering[currentLayer][row]['barycenter'] = graph.layering[currentLayer][row].xCoordinate;
        else if ((colValue / numberOfEdges) % 1 !== 0 && checkDummyNeighbors(graph, graph.layering[currentLayer][row], type, (colValue / numberOfEdges)))
            graph.layering[currentLayer][row]['barycenter'] = Math.floor(colValue / numberOfEdges);
        else
            graph.layering[currentLayer][row]['barycenter'] = Math.round(colValue / numberOfEdges);
    }
};

function clusticXCoordinateBarycenter(graph, currentLayer, incidentMatrix, fixedLayer, type) {

    for (var row = 0; row < incidentMatrix.length; row++) {
        var colValue = 0, numberOfEdges = 0;
        for (var col = 0; col < incidentMatrix[row].length; col++) {
            if (incidentMatrix[row][col] === 1) {
                colValue += fixedLayer[col].xCoordinate;
                numberOfEdges++;
            }
        }

        var currentVertices = graph.layering[currentLayer][row];
        //Prevent NaN
        if (colValue === 0 && numberOfEdges === 0 && currentVertices['barycenter'] === undefined)
            currentVertices['barycenter'] = currentVertices.xCoordinate;
        else if ((colValue / numberOfEdges) % 1 !== 0 && checkDummyNeighbors(graph, currentVertices, type, (colValue / numberOfEdges)) && currentVertices['barycenter'] === undefined)
            currentVertices['barycenter'] = Math.floor(colValue / numberOfEdges);
        else if(currentVertices['barycenter'] === undefined)
            currentVertices['barycenter'] = Math.round(colValue / numberOfEdges);

        if (currentVertices.cluster !== undefined) {
            $.each(graph.subgraphs[currentVertices.cluster].vertices, function () {
                this['barycenter'] = currentVertices['barycenter'];
            });
        }
    }


};

function checkDummyNeighbors(graph, currentVertex, type, barycenter) {
    var neighborList;

    if (type === 'downToUp')
        neighborList = graph.adjacencyList[currentVertex.number].neighborsOut;
    else
        neighborList = graph.adjacencyList[currentVertex.number].neighborsIn;


    var closestDummy = 100000,
        closestLeftDummy = 10000;

    $.each(neighborList, function () {
        for (var i = 0; i < graph.vertices.length; i++) {
            if (this[0] === graph.vertices[i].label && graph.vertices[i].dummy && Math.abs(graph.vertices[i].layerX - barycenter) < closestDummy) {
                if (graph.vertices[i].xCoordinate < barycenter)
                    closestLeftDummy = i;
                closestDummy = Math.abs(graph.vertices[i].layerX - barycenter);
            }

        };
    });

    if (closestLeftDummy !== 10000)
        return true;
    else
        return false;
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

function clusticSetXCoordinate(graph, tmpCurrentLayer, currentLayer) {

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

        if (currentVertex.cluster !== undefined && currentLayer[currentVertex.layerX].barycenter !== currentLayer[currentVertex.layerX].xCoordinate) {
            $.each(graph.subgraphs[currentVertex.cluster].vertices, function () {
                if(currentVertex.label !== this.label)
                    this.barycenter = currentLayer[currentVertex.layerX].xCoordinate;
            });
        }
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
        var k = -1,
            closestIndex = 10000;

        for (var prioVertex = 0; prioVertex < current; prioVertex++) {
            if (currentLayer[prioVertex].priority >= currentVertex.priority && currentLayer[prioVertex].label !== currentVertex.label
                && Math.abs(currentVertex.barycenter - prioVertex) < closestIndex) {
                k = prioVertex;
                closestIndex = Math.abs(currentVertex.barycenter - prioVertex);
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

            if (mk[current - l] === undefined || currentVertex.barycenter - l >= (mk[current - l])) {
                return;
            } else {
                mk[current - l] = currentVertex.barycenter - l;
                if (l > current - 1) {
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

        //Get vertex closest to the right x-coordinate from currenVertex with equal or lager priority
        var k = -1,
            closestIndex = 10000;


        for (var prioVertex = current; prioVertex < currentLayer.length; prioVertex++) {
            if (currentLayer[prioVertex].priority >= currentVertex.priority && currentLayer[prioVertex].label !== currentVertex.label
                && Math.abs(currentVertex.barycenter - prioVertex) < closestIndex) {
                k = prioVertex;
                closestIndex = Math.abs(currentVertex.barycenter - prioVertex);
            }
        }

        //If there is a vertex on the right of currentVertex with higher or equal priority
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