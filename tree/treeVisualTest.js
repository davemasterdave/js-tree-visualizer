/*
 ****************************** DEBUGGING/DEV CODE *****************************
 */

var BOUNDINGS;
function renderLayoutBounding(visualizer) {
    if(isNotNull(BOUNDINGS)) {
        BOUNDINGS.forEach(function (o){ o.remove() });
    } else {
        BOUNDINGS = [];
    }
    var r = visualizer.r;
    const screen = visualizer.s;
    const screenX = screen.size.x;
    const screenY = screen.size.y;

    const offsetX = screenX / 2;
    const offsetY = screenY / 2;

    // Bounding ellipse
    BOUNDINGS.push(r.ellipse(offsetX, offsetY, offsetX, offsetY).attr({"stroke": "#FFF"}));
}

Tree.prototype.debugPrintNodes = function () {
    console.log("Tree Height: " + this.height);
    function printer(root, space) {
        var toPrint = space || "";
        console.log(toPrint + root.id + " -> Level " + root.level);
        for (var i = 0; i < root.children.length; i++) {
            printer(root.children[i], toPrint + "    ");
        }
    }
    printer(this.root);
};

function simpleTreeData() {
    return generateTreeData([
        {"id" : 1, "bodyText" : "Simple Tree"},
        {"id" : 2, "parentId" : 1},
        {"id" : 3, "parentId" : 1},
        {"id" : 4, "parentId" : 1},
        {"id" : 5, "parentId" : 1},
        {"id" : 6, "parentId" : 5}
    ]);
}

function denseTreeData() {
    return generateTreeData([
        {"id" : 1, "bodyText": "THE ROOT ELEMENT", "headerImg": "http://placehold.it/350x50.jpg/444/FFF"},
        {"id" : 3, "parentId" : 1},
        {"id" : 4, "parentId" : 1},
        {"id" : 5, "parentId" : 2},
        {"id" : 10, "parentId" : 2},
        {"id" : 7, "parentId" : 2},
        {"id" : 9, "parentId" : 2},
        {"id" : 8, "parentId" : 3},
        {"id" : 11, "parentId" : 3},
        {"id" : 19, "parentId" : 3},
        {"id" : 20, "parentId" : 3},
        {"id" : 12, "parentId" : 3},
        {"id" : 21, "parentId" : 3},
        {"id" : 22, "parentId" : 3},
        {"id" : 6, "parentId" : 4},
        {"id" : 2, "parentId" : 4},
        {"id" : 23, "parentId" : 4},
        {"id" : 24, "parentId" : 4, "bodyText": "Lorem ipsum dolor 22222222"},
        {"id" : 13, "parentId" : 12},
        {"id" : 14, "parentId" : 12},
        {"id" : 15, "parentId" : 12},
        {"id" : 16, "parentId" : 12},
        {"id" : 17, "parentId" : 12},
        {"id" : 18, "parentId" : 12, "bodyText": "Lorem ipsum dolor 22222222"},
        {"id" : 27, "parentId" : 6},
        {"id" : 28, "parentId" : 6},
        {"id" : 29, "parentId" : 6},
        {"id" : 30, "parentId" : 6},
        {"id" : 26, "parentId" : 24, "headerImg": "http://placehold.it/250x50.jpg/444/FFF", "bodyText": "Lorem ipsum dolor"},
        {"id" : 25, "parentId" : 24, "bodyText": "Lorem ipsum dolor 22222222"}
    ]);
}

function fullTreeData() {
    return generateTreeData([
        {"id" : 1, "bodyText": "Full Root"},
        {"id" : 2, "parentId" : 1},
        {"id" : 3, "parentId" : 1},
        {"id" : 4, "parentId" : 2},
        {"id" : 5, "parentId" : 2},
        {"id" : 6, "parentId" : 3},
        {"id" : 7, "parentId" : 3},
        {"id" : 8, "parentId" : 4},
        {"id" : 9, "parentId" : 4},
        {"id" : 10, "parentId" : 5},
        {"id" : 11, "parentId" : 5},
        {"id" : 12, "parentId" : 6},
        {"id" : 13, "parentId" : 6},
        {"id" : 14, "parentId" : 7},
        {"id" : 15, "parentId" : 7},
        {"id" : 16, "parentId" : 8},
        {"id" : 17, "parentId" : 8},
        {"id" : 18, "parentId" : 9},
        {"id" : 19, "parentId" : 9},
        {"id" : 20, "parentId" : 10},
        {"id" : 21, "parentId" : 10},
        {"id" : 22, "parentId" : 11},
        {"id" : 23, "parentId" : 11},
        {"id" : 24, "parentId" : 12},
        {"id" : 25, "parentId" : 12},
        {"id" : 26, "parentId" : 13},
        {"id" : 27, "parentId" : 13},
        {"id" : 28, "parentId" : 14},
        {"id" : 29, "parentId" : 14},
        {"id" : 30, "parentId" : 15},
        {"id" : 31, "parentId" : 15}
    ]);
}

function generateTreeData(nodes) {
    for(var i = 0; i < nodes.length; i++) {
        nodes[i]["titleText"] = "T" + nodes[i]["id"];
    }
    return nodes;
}
