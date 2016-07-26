/**
 * Created by David Master on 7/11/16.
 */
var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
};

Coordinate.prototype.equals = function (o) {
    return o.x == this.x && o.y == this.y;
};

Coordinate.prototype.area = function () {
  return this.x * this.y;
};

Coordinate.prototype.add = function (o) {
    return new Coordinate(this.x + o.x, this.y + o.y);
};

Coordinate.prototype.subtract = function (o) {
    return new Coordinate(this.x - o.x, this.y - o.y);
};

Coordinate.prototype.scalarProduct = function (s) {
    return new Coordinate(this.x *s, this.y *s);
};

Coordinate.prototype.crossProduct = function (w) {
    return (this.x *w.y) - (this.y * w.x);
};

Coordinate.prototype.toString = function () {
  return '(' + this.x + ',' + this.y  + ")";
};

var Segment = function (beg, end) {
    this.beg = beg;
    this.end = end;
    this.calcLen();
};

Segment.prototype.calcLen = function () {
    this.len = this.end.subtract(this.beg);
    return this.len;
};

var FontInfo = function (name, size, color, type) {
    this.name = name;
    this.size = size;
    this.color = color;
    this.type = type || null;
};

var ScreenInfo = function (root) {
    this.rootElement = root;
    this.recalculate();
};

/**
 * @return {boolean} true if the screen size has changed or has never been measured before
 */
ScreenInfo.prototype.recalculate = function() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementById(this.rootElement);
    var x = w.innerWidth || e.clientWidth || g.clientWidth;
    var y = w.innerHeight|| e.clientHeight || g.clientHeight;
    if(isNotNull(g)) {
        x -= g.offsetLeft;
        y -= g.offsetTop;
    }
    const oldSize = this.size;
    this.size = new Coordinate(x, y);
    return isNotNull(oldSize) ? !this.size.equals(oldSize) : true;
};

var Node = function(data) {
    this.id = data["id"];
    this.parentId = data["parentId"] || null;
    this.titleText = data["titleText"] || null;
    this.bodyText = data["bodyText"] || null;
    this.headerImg = data["headerImg"] || null;
    this.level = 0;
    this.parentNode = null;
    this.children = [];
    this.resetRenderInfo();

    // Data Validation
    if(isNull(this.id)) {
        throw new Error("Node must have an ID.");
    }

    if(this.id == this.parentId) {
        throw new Error("Node cannot be a parent to itself.");
    }

    function isInvalid(v) { return isNull(v) || v.length == 0; }
    if(isInvalid(this.titleText) && isInvalid(this.bodyText) && isInvalid(this.headerImg)) {
        throw new Error("Node cannot have no content at all!");
    }
};

Node.prototype.isRoot = function () {
    return this.parentId == null;
};

Node.prototype.addChild = function (node) {
    this.children.push(node);
    node.parentNode = this;
};

Node.prototype.resetRenderInfo = function() {
    var existingInfo = this.renderInfo;
    var newInfo = new NodeRenderInfo();

    if(isNotNull(existingInfo) && isNotNull(existingInfo.rHeaderImg)) {
        newInfo.rHeaderImg = existingInfo.rHeaderImg;
        newInfo.rHeaderImg.reset();
    }
    this.renderInfo = newInfo;
};

Node.prototype.preLoadImage = function () {
    const p = jQuery.Deferred();
    const imgUrl = this.headerImg;

    if(isNotNull(imgUrl)) {
        const rI = this.renderInfo;
        var img = new Image();
           img.addEventListener("load", function () {
               rI.rHeaderImg = new RImage(imgUrl, new Coordinate(this.naturalWidth, this.naturalHeight));
               rI.attemptedToLoadImages = true;
               p.resolve();
           });
           img.addEventListener("error", function () {
               rI.attemptedToLoadImages = true;
               p.reject();
           });
           img.src = imgUrl;
    } else {
        p.resolve();
    }

    return p.promise();
};

/**
 * Iterate through this node and its children in a breadth first
 * manner, applying the callback to each node.
 * @param {Function} callback
 * @param {boolean} shouldSkipRoot true if the root/current node should be skipped
 */
Node.prototype.breadthFirstIterate = function (callback, shouldSkipRoot) {
    if (typeof callback !== "function") {
        console.error("Callback passed to breadth first iterate is not valid");
        return;
    }
    shouldSkipRoot = shouldSkipRoot || false;
    var toVisit = [], n = null;

    if(shouldSkipRoot) {
        toVisit = toVisit.concat(this.children);
    } else {
        toVisit.push(this);
    }

    while(toVisit.length > 0) {
        n = toVisit.shift();
        callback(n);
        toVisit = toVisit.concat(n.children);
    }
};

var Tree = function(rootNode, height) {
    this.root = rootNode;
    this.height = height;
};

Tree.prototype.breadthFirstIterate = function (callback) {
    if(isNotNull(this.root)) {
        this.root.breadthFirstIterate(callback);
    } else {
        console.log("Nothing to iterate, this tree is empty");
    }
};

//*************************** IMAGE RENDERER AND FITTER *****************************************

var RImage = function (url, nativeDimensions, maxDimensions) {
    this.url = url;
    this.nativeDim = nativeDimensions;
    this.maxDim = maxDimensions || new Coordinate();
    this.reset();
};

RImage.prototype.reset = function () {
    this.boundingDim = null;
};

RImage.prototype.calculateDimensions = function () {
    var srcWidth = this.nativeDim.x, srcHeight = this.nativeDim.y;
    var maxWidth = this.maxDim.x, maxHeight = this.maxDim.y;
    var ratio = 1;

    if (isNotNull(maxWidth)) {
        ratio = maxWidth / srcWidth;
    }
    if (isNotNull(maxHeight)) {
        var heightRatio = maxHeight / srcHeight;
        if (isNull(maxWidth)) {
            ratio = heightRatio;
        } else {
            ratio = Math.min(ratio, heightRatio);
        }
    }
    this.boundingDim = new Coordinate(srcWidth * ratio, srcHeight * ratio);
    return this.boundingDim;
};

RImage.prototype.render = function (r, location) {
    if (isNull(this.boundingDim)) {
        this.calculateDimensions();
    }
    return r.image(this.url, location.x, location.y, this.boundingDim.x, this.boundingDim.y);
};

//*************************** TEXT RENDERER AND FITTER *****************************************

var RText = function (rawText, fontInfo, maxWidth) {
    this.rawText = rawText;
    this.fontInfo = fontInfo;
    this.maxWidth = maxWidth;
    this.wrappedText = null;
    this.boundingDim = null;
};

RText.prototype.calculateDimensions = function () {
    const rText = this;
    const fontSize = rText.fontInfo.size;
    const fontType = rText.fontInfo.type || "";
    const canvasFont = fontType + " " + fontSize + "px " + rText.fontInfo.name;
    const spaceSize = getTextWidth(" ");

    function getTextWidth(text) {
        // re-use canvas object for better performance
        var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = canvasFont;
        var metrics = context.measureText(text);
        return metrics.width;
    }

    var words = rText.rawText.split(/\s+/);

    var totalLines = 0;
    var result = "";

    var currentWidth = 0;
    var currentLine = "";

    function incrementLine() {
        if (currentLine.length == 0) {
            return;
        }
        if (result.length > 0) {
            result += "\n" + currentLine;
        } else {
            result = currentLine;
        }
        currentLine = "";
        if(totalLines > 0) {
            currentWidth = 0;
        }
        totalLines++;
    }

    words.forEach(function (word) {
        if (isNotNull(word) && word.length > 0) {
            var textWidth = getTextWidth(word);

            if (textWidth > rText.maxWidth) { // If word is too big to fit on one line, replace with ellipse
                word = "...";
                textWidth = getTextWidth(word);
            }

            if (currentWidth + textWidth > rText.maxWidth) { // Check if word fits on current line
                incrementLine();
            }

            currentLine += word + " ";
            currentWidth += textWidth + spaceSize;
        }
    });

    incrementLine();

    rText.wrappedText = result;
    this.boundingDim = new Coordinate(totalLines > 1 ? rText.maxWidth : currentWidth,
        totalLines * fontSize + (Math.max(0, totalLines)) * 0.2 * fontSize);
    return this.boundingDim;
};

RText.prototype.render = function (r, location) {
    if (isNull(this.wrappedText)) {
        this.calculateDimensions();
    }
    return r.text(location.x, location.y + this.boundingDim.y / 2, this.wrappedText)
        .attr({
            fill: this.fontInfo.color, "font-size": this.fontInfo.size,
            "font-family": this.fontInfo.name, "text-anchor": "start", "font-weight": this.fontInfo.type
        });
};

//************************** SEGMENT INTERSECTION CALCULATION ******************************

/**
 * Calculate the intersection with a segment and
 * a bounding box around its beginning segment
 *
 * @param {Segment} p
 * @param {Coordinate} b
 * @return {Coordinate} result
 */
function calcIntersectingWithBounds(p, b) {
    var segPoints = [], i;
    [-1, 1].forEach(function (xSign) {
        [-1, 1].forEach(function (ySign) {
            ySign = ySign * xSign;
            segPoints.push(new Coordinate((xSign * b.x / 2) + p.beg.x, (ySign * b.y / 2) + p.beg.y));
        });
    });

    var boundingSegs = [];
    for(i = 0; i < segPoints.length; i++) {
        var nextI = i + 1;
        if(nextI >= segPoints.length) {
            nextI = 0;
        }
        boundingSegs.push(new Segment(segPoints[i], segPoints[nextI]));
    }

    for(i = 0; i < boundingSegs.length; i++) {
        const intersec = calcIntersecting(p, boundingSegs[i]);
        if(isNotNull(intersec)) {
            return intersec;
        }
    }

    return null;
}

/**
 * Calculate the intersection, if any, between two segments.
 *
 * @param {Segment} pSeg
 * @param {Segment} qSeg
 * @return {Coordinate} result
 */
function calcIntersecting(pSeg, qSeg) {
    const p = pSeg.beg, q = qSeg.beg;
    const r = pSeg.calcLen(), s = qSeg.calcLen();
    const rCrossS = r.crossProduct(s);

    if(rCrossS !== 0) {
        const qSubP = q.subtract(p);
        const t = qSubP.crossProduct(s) / rCrossS;
        const u = qSubP.crossProduct(r) / rCrossS;
        if(t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return p.add(r.scalarProduct(t));
        }
    }

    return null;
}

//**************************************** TREE VISUALIZATION ******************************

var NodeRenderInfo = function() {
    this.hasBoundsCalculated = false;
    this.boundingDim = null;
    this.centerCoordinate = null;
    this.sectorTheta = null;
    this.offsetTheta = null;
    this.panelObjs = [];
    this.edgeObjs = [];
    this.rHeaderImg = null;
    this.attemptedToLoadImages = false;
    this.rTitleText = null;
    this.rBodyText = null;
};

/**
 * Global display settings for a renderer
 * @param {string} rootDomElementId
 * @param {int} maxNodeWidth
 * @param {int} nodePanelCornerRadius
 * @param {int} nodeContentMargins
 * @param {FontInfo} titleTextFontInfo
 * @param {FontInfo} bodyTextFontInfo
 * @constructor
 */
var NodeRendererSettings = function(rootDomElementId, maxNodeWidth, nodePanelCornerRadius, nodeContentMargins, titleTextFontInfo, bodyTextFontInfo) {
    this.rootDomElementId = rootDomElementId;
    this.maxNodeWidth = maxNodeWidth;
    this.nodePanelCornerRadius = nodePanelCornerRadius;
    this.nodeContentMargins = nodeContentMargins;
    this.titleTextFontInfo = titleTextFontInfo;
    this.bodyTextFontInfo = bodyTextFontInfo;
};

/**
 * Constructs a new renderer
 * @param {NodeRendererSettings} settings
 * @param {Raphael} r
 * @param {ScreenInfo} screen
 * @constructor
 */
var NodeRenderer = function (settings, r, screen) {
    this.r = r;
    this.screen = screen;
    this.settings = settings;
};

/**
 * Calculates the minimum dimensions it would take to
 * render the node on the screen
 * @param {Node} node
 * @return {Coordinate} bounding dimensions of node
 */
NodeRenderer.prototype.calculateDimensions = function (node) {
    const margin = this.settings.nodeContentMargins, maxContentWidth = this.settings.maxNodeWidth - (2 * margin);
    var currentX = 0, currentY = 0;

    function addContentDimensions(tDim) {
        currentY += (2 * margin) + tDim.y;
        currentX = Math.max(currentX, tDim.x);
    }

    function setText(rawText, fontInfo) {
        if(isNotNull(rawText)) {
            const t = new RText(rawText, fontInfo, maxContentWidth);
            addContentDimensions(t.calculateDimensions());
            return t;
        } else {
            return null;
        }
    }

    // Attempt to render the header image
    if(isNotNull(node.headerImg) && isNull(node.renderInfo.rHeaderImg) && !node.renderInfo.attemptedToLoadImages) {
        console.error("Must call Node.preload() and wait for its asynchronous result before calling this method! " +
            "The native dimensions must be determined by loading the remote image first!")
    } else if (isNotNull(node.headerImg) && isNull(node.renderInfo.rHeaderImg)) {
        console.error("Unable to load image. Skipping the display of it...");
    } else if (isNotNull(node.headerImg)) {
        node.renderInfo.rHeaderImg.maxDim = new Coordinate(maxContentWidth, maxContentWidth);
        addContentDimensions(node.renderInfo.rHeaderImg.calculateDimensions());
    }

    // Build the node texts and add the bounding dimensions
    node.renderInfo.rTitleText = setText(node.titleText, this.settings.titleTextFontInfo);
    node.renderInfo.rBodyText = setText(node.bodyText, this.settings.bodyTextFontInfo);

    // Set the total bounding area
    node.renderInfo.boundingDim = new Coordinate(currentX + (2 * margin), currentY);
    node.renderInfo.hasBoundsCalculated = true;

    return node.renderInfo.boundingDim;
};

/**
 * Displays a node and its edge to its parent on screen
 * @param {Node} node
 */
NodeRenderer.prototype.renderNodePanel = function(node) {
    if(!node.renderInfo.hasBoundsCalculated) {
        this.calculateDimensions(node);
    }
    const nR = this, nRI = node.renderInfo, contentMargin = this.settings.nodeContentMargins;
    const w = nRI.boundingDim.x, h = nRI.boundingDim.y;
    const centerX = nRI.centerCoordinate.x, centerY = nRI.centerCoordinate.y;

    if(!node.isRoot()) { // Renders connecting edge
        var thisCoor = nRI.centerCoordinate, pCoor = node.parentNode.renderInfo.centerCoordinate;
        const thisBoundingDim = nRI.boundingDim, pBoundingDim = node.parentNode.renderInfo.boundingDim;

        const thisIntersect = calcIntersectingWithBounds(new Segment(thisCoor, pCoor), thisBoundingDim);
        if(isNotNull(thisIntersect)) {
            thisCoor = thisIntersect;
        }

        const pIntersect = calcIntersectingWithBounds(new Segment(pCoor, thisCoor), pBoundingDim);
        if(isNotNull(pIntersect)) {
            pCoor = pIntersect;
        }

        const pathStr = "M " + Math.floor(thisCoor.x)  + " " + Math.floor(thisCoor.y) + " L "
            + Math.floor(pCoor.x) + " " + Math.floor(pCoor.y) + " z";
        const edge = this.r.path(pathStr)
            .attr({"stroke" : "#FFF", "arrow-end" : "block-wide-long", "stroke-width" : 2});
        nRI.edgeObjs.push(edge);
    }

    // Renders node background panel
    const panel = this.r.rect(centerX - w/2, centerY - h/2, w, h, this.settings.nodePanelCornerRadius)
        .attr({fill: "#aaa"}).click(function () {
            console.log("clicked on panel for node " + node.id);
        });
    nRI.panelObjs.push(panel);

    var leftX = centerX - (w/2) + contentMargin;
    var currentY = centerY - (h/2) + contentMargin;

    [nRI.rHeaderImg, nRI.rTitleText, nRI.rBodyText].forEach(function (obj) {
        if(isNotNull(obj)) {
            const img = obj.render(nR.r, new Coordinate(leftX, currentY));
            nRI.panelObjs.push(img);
            currentY += obj.boundingDim.y + contentMargin;
        }
    });
};

/**
 * Removes node and edge to parent from screen from screen
 * @param {Node} node
 */
NodeRenderer.prototype.unRenderNodePanel = function (node) {
    node.renderInfo.panelObjs.concat(node.renderInfo.edgeObjs).forEach(function (obj) {
        obj.remove();
    });
    node.resetRenderInfo();
};

/**
 * Construct a the layout calculator. Implements the layout
 * through a mapping of the nodes in the hyperbolic space
 * to a Euclidean plane.
 * @param {ScreenInfo} screen
 * @constructor
 */
var TreeLayoutCalculator = function(screen) {
    this.s = screen;
    this.a = this.s.size.x / 2;
    this.b = this.s.size.y / 2;
};


/**
 * Calculate the positions of each node in the tree.
 * @param {Tree} tree
 */
TreeLayoutCalculator.prototype.calcTreeLayout = function (tree) {
    const tLC = this;
    const d = tree.height > 0 ? 1 / (tree.height + 0.5) : 0;

    tree.breadthFirstIterate(function (node) {
        var x = tLC.a, y = tLC.b;
        const parent = node.parentNode;
        if (!node.isRoot()) {
            const currentOffset = parent.renderInfo.offsetTheta;
            const sectorTheta = tLC.calcWedgeTheta(node, parent.renderInfo.sectorTheta, currentOffset);
            node.renderInfo.sectorTheta = sectorTheta;

            parent.renderInfo.offsetTheta = currentOffset + sectorTheta;
            node.renderInfo.offsetTheta = currentOffset;

            const theta = (currentOffset + (sectorTheta / 2)) * (Math.PI / 180);

            const aL = node.level * tLC.a * d, bL = node.level * tLC.b * d;
            const r = aL * bL / Math.sqrt(Math.pow(bL * Math.cos(theta), 2) + Math.pow(aL * Math.sin(theta), 2));

            x = x + r * Math.cos(theta);
            y = y - r * Math.sin(theta);
        } else {
            node.renderInfo.sectorTheta = tLC.calcWedgeTheta(node);
            node.renderInfo.offsetTheta = 90;
        }
        node.renderInfo.centerCoordinate = new Coordinate(x, y);
    });
};


TreeLayoutCalculator.prototype.calcWedgeTheta = function (node, totalTheta, offsetTheta) {
    const parent = node.parentNode;
    if (isNull(parent)) {
        return 360;
    } else {
        var parentBranchTotal = 0;
        var nodeBranchTotal = 0;

        function calcNodeWeight(n) {
            return n.renderInfo.boundingDim.area() / (Math.pow(n.level, 2));
        }

        parent.breadthFirstIterate(function (n) {
            parentBranchTotal += calcNodeWeight(n)
        }, true);
        node.breadthFirstIterate(function (n) {
            nodeBranchTotal += calcNodeWeight(n)
        }, false);

        const result = totalTheta * (nodeBranchTotal / parentBranchTotal);
        console.log("Node " + node.titleText + " has theta " + result + " starting from " + offsetTheta);

        return result;
    }
};

var TreeVisualizer = function(nodeRendererSettings) {
    this.nodeRendererSettings = nodeRendererSettings ||
        new NodeRendererSettings("holder", 200, 3, 7, new FontInfo("Open Sans", 20, "#222", "bold"), new FontInfo("Open Sans", 13, "#111"));
    this.tree = null;
    this.s = new ScreenInfo(this.nodeRendererSettings.rootDomElementId);
    this.r = Raphael(this.nodeRendererSettings.rootDomElementId, this.s.size.x, this.s.size.y);
    this.rZPD = new RaphaelZPD(this.r, { zoom: false, pan: true, drag: false });
    this.constructRendererAndLayoutCalc();
};

TreeVisualizer.prototype.constructRendererAndLayoutCalc = function () {
    this.nodeRenderer = new NodeRenderer(this.nodeRendererSettings, this.r, this.s);
    this.treeLayoutCalc = new TreeLayoutCalculator(this.s);
};

TreeVisualizer.prototype.updateScreenInfo = function () {
    const t = this;

    if(!t.s.recalculate()) {
        return;
    }

    t.constructRendererAndLayoutCalc();

    t.unRenderTree();
    t.r.setSize(t.s.size.x, t.s.size.y);
    t.render();
};

TreeVisualizer.prototype.unRenderTree = function () {
    const t = this;

    if(isNotNull(this.tree)) {
        this.tree.breadthFirstIterate(function (node) {
            t.nodeRenderer.unRenderNodePanel(node);
        });
    }
};

/**
 * Parse the list of raw nodes into a tree;
 * @param {Array} rawNodes
 * @returns {jQuery.promise} promise of when all the images have loaded
 */
TreeVisualizer.prototype.buildTree = function(rawNodes) {
    var nodes = {}, root = null, n = null, imageLoadings = [];

    for(var i = 0; i < rawNodes.length; i++) {
        n = new Node(rawNodes[i]);
        imageLoadings.push(n.preLoadImage());
        nodes[n.id] = n;
        if(n.isRoot()) {
            root = n;
        }
    }

    if(isNull(root)) { // Check if there is no root
        return null;
    }

    // Form edges between connected nodes
    Object.keys(nodes).forEach(function(nodeId) {
        var n = nodes[nodeId];
        if(!n.isRoot()) {
            var parentNode = nodes[n.parentId];
            if(isNotNull(parentNode)) {
                parentNode.addChild(n);
            }
        }
    });

    // Calculates tree height and node heights
    var treeHeight = 0;
    root.breadthFirstIterate(function (n) {
        if (!n.isRoot()) {
            n.level = n.parentNode.level + 1;
        } else {
            n.level = 0;
        }
        treeHeight = Math.max(treeHeight, n.level);
    });

    this.tree = new Tree(root, treeHeight);

    return waitFor(imageLoadings);
};

TreeVisualizer.prototype.render = function() {
    if(isNull(this.tree)) {
        console.error("No tree to render");
        return false;
    }
    const v = this;

    // Calculate the bounding dimension of each node
    v.tree.breadthFirstIterate(function (node) {
        v.nodeRenderer.calculateDimensions(node);
    });

    // Calculate the position of each node
    v.treeLayoutCalc.calcTreeLayout(v.tree);

    // Draw node with edge on screen
    v.tree.breadthFirstIterate(function (node) {
       v.nodeRenderer.renderNodePanel(node);
    });
};

function isNotNull(o) {
    return typeof o !== "undefined" && o !== null;
}

function isNull(o) {
    return o == null;
}

function waitFor(promises) {
    const finalP = jQuery.Deferred();
    // just wrap deferred
    promises = jQuery.map(promises, function(p) {
        var dfd = jQuery.Deferred();
        p.always(function() { dfd.resolve(); });
        return dfd.promise();
    });

    jQuery.when.apply(window, promises).done(function() {

        finalP.resolve();
    });
    return finalP.promise();
}

// Debounce resize window event
const RESIZE_EVENT_TIMEOUT = 200,
    RESIZE_DONE_EVENT_KEY = 'resizeend';
var timer;

window.addEventListener('resize', function () {
    clearTimeout(timer);

    timer = setTimeout(function () {
        jQuery(window).trigger(RESIZE_DONE_EVENT_KEY);
    }, RESIZE_EVENT_TIMEOUT);
});
