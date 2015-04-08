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

    //init some testing vertices
    var node0 = { "label" : "node0", "layer": 0, "layerX": 0, "xCoordinate": 3, "neighbors": ["node1", "node2"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" };
    var node1 = { "label" : "node1" , "layer": 1, "layerX": 0, "xCoordinate": 2, "neighbors": ["node3"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" } ;
    var node2 = { "label" : "node2" , "layer": 1, "layerX": 1, "xCoordinate": 4, "neighbors": ["node4", "node8"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" } ;
    var node3 = { "label" : "node3" , "layer": 2, "layerX": 0, "xCoordinate": 2, "neighbors": ["node5", "node7"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" } ;
    var node4 = { "label" : "node4" , "layer": 2, "layerX": 1, "xCoordinate": 5, "neighbors": ["node6"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" } ;
    var node5 = { "label" : "node5" , "layer": 3, "layerX": 0, "xCoordinate": 1, "neighbors": ["node7"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" } ;
    var node6 = { "label" : "node6" , "layer": 3, "layerX": 1, "xCoordinate": 5, "neighbors": ["node8", "node9"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" } ;
    var node7 = { "label" : "node7" , "layer": 4, "layerX": 0, "xCoordinate": 2, "neighbors": ["node11"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" };
    var node8 = { "label" : "node8" , "layer": 4, "layerX": 1, "xCoordinate": 4, "neighbors": ["node10"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" } ;
    var node9 = { "label" : "node9" , "layer": 4, "layerX": 2, "xCoordinate": 5, "neighbors": ["node6", "node10"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" } ;
    var node10 = { "label" : "node10" , "layer": 5, "layerX": 0, "xCoordinate": 4, "neighbors": ["node11"], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" } ;
    var node11 = { "label" : "node11" , "layer": 6, "layerX": 0, "xCoordinate": 3, "neighbors": [], "freeX": 0, "freeY": 0, "height": 70, "width": 60, "type": "rectangle" } ;
    var init_vertices = [node0,node1,node2,node3,node4,node5,node6,node7,node8,node9,node10,node11];

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
    init_edges = [edge0 ,edge1 ,edge2 ,edge3 ,edge4 ,edge5 ,edge6 ,edge7 ,edge8 ,edge9 ,edge10,edge11,edge12,edge13,edge14,edge15,edge16];

    //draw vertices
    createVertices(init_vertices);

    //draw edges
    createEdges(init_edges);

    //Make all components draggable
    //Make element draggable
    jsPlumb.draggable($('.component'));

});

$(".component").resizable({
    resize: function (event, ui) {
        jsPlumb.repaint(ui.helper);
    },
    handles: "all"
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
        var edge = jsPlumb.connect({
            source: this.from,
            target: this.to,
            anchors: [dynamicAnchors, "Continuous"],
            endpoint: "Blank",
            anchor: ["Perimeter", { shape: "Rectangle" }],
            overlays: [
                    ["Arrow", { width: 12, length: 12, location: 1}]
            ]
        });
    });
};

