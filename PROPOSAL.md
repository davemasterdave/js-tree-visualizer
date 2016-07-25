Project Overview
================

I will implement of a tree visualization algorithm in Javascript that will render an aesthetically pleasing 2-D tree on a webpage. This component will be utilized in a production, closed-source, web application. The implementation will be released under the Apache 2.0 Open Source Software License in this Git Repository. The only inputs to the algorithm will be a list of nodes, each with the following information:
* Node ID
* Parent Node ID (null if node is root)
* Title Text
* Body Text (optional)
* Header Image (optional)

The algorithm will be responsible for rendering and laying out the node's data in a panel, then laying out all of these panels/nodes and the corresponding edges to fit within a given 2-D canvas. This algorithm should come from the field of non-Application-Specific Graph Drawing. More specifically, an area of interest for this implementation is force-directed graph drawing.

Criteria for Aesthetically Pleasing Layout
------------------------------------------
* Edges should have approximately equivalent lengths
* Intersecting edges should be minimal/non-existent
* Spacing between nodes should take into account the relative areas of the node's content sizes (ex: A node with a large amount of content should have more of a margin than another node with less content & size)

Other Criteria
--------------
* Target inputs will be small trees with <50 nodes
* Should handle full trees as well as very deep & narrow trees
* Max execution time of 10ms/node (ex: Tree with 10 nodes will need to be rendered <100ms)
* Modern cross-browser compatibility with Firefox, Safari, Google Chrome, & Opera
* Utilize vector graphics for rendering the node's panel to ensure crisp visual presentation across a variety of screen resolutions
* Responsive layout of tree across Desktop, Tablet and Mobile Screens

Grading Criteria
================
1) Weight: 5%
-------------
Constructs a tree data structure from a flat list of nodes with parent pointers. Example raw node:
```json
{
    "id": 26,
    "parentId": 24,
    "headerImg": "http://placehold.it/250x50.jpg/444/FFF",
    "titleText": "Title lorem ipsum",
    "bodyText": "Lorem ipsum dolor"
}
```
2) Weight: 5%
------------
Breadth first iteration through tree data structure.
```javascript
Tree.prototype.breadthFirstIterate = function (callback) {}
```
3) Weight: 5%
-------------
Render the contents of a node on the screen at a specified coordinate in a vertical layout, from top to bottom. The content should be left aligned. The node's content will have a maximum width, so content that cannot fit on a single line will be wrapped. More details on this criteria is provided below. A box will be rendered to enclose the contents of the node and provide a colored background. Layout example:
```
||||||||||||||||
| HEADER IMAGE |
| TITLE        |
| BODY TEXT    |
||||||||||||||||
```
4) Weight: 5%
-------------
If a url for a header image is provided, calculate the aspect ratio to scale the image to ensure it fits horizontally at the top of the node.
5) Weight: 5%
-------------
If a url for a header image is provided, render the image at a specified coordinate. The image should be scaled according to the aspect ratio calculate in ``` 4) ```.
6) Weight: 5%
-------------
If a title and/or body text is provided, render it at a given coordinate. Ensure text in a node's content wraps when the text is too long to fit on one line.
7) Weight: 5%
-------------
Implement a method to calculate the dimensions of the wrapped title and body text in pixels.
8) Weight: 5%
-------------
Render an edge connecting parent and child nodes.
9) Weight: 5%
--------------
Ensure rendered edge between nodes doesn't cut into node content.
10) Weight: 5%
-------------
Ensure rendered edge is directed, such that an arrowhead points to the child node from its parent node.
11) Weight: 5%
---------------
Implement a method to un-render a node from the screen. All of the node's associated content and inbound edge should be removed from the screen.
12) Weight: 5%
-------------
The layout of the tree should adapt to browser window resizes.
13) Weight: 5%
-------------
The layout of the tree should be responsive ready. This means that the same code base will properly render the tree across desktop, tablet and mobile device screens. The layout algorithm should take advantage of the extra screen space of desktop and larger tablet screens to display more tree nodes at once.
14) Weight: 5%
-------------
The maximum render time per node is 10 milliseconds. The render time is defined as the total time taken to determine the layout of all the nodes, the bounding dimensions of all the nodes, the position of each node according to the visualizer algorithm and the display of each node on the screen.
15) Weight: 5%
-------------
Implement the ability to pan the layout when the tree doesn't fit entirely onto the display.
16) Weight: 5%
-------------
Ensure the nodes are laid out such that there are no intersections between nodes' edges.
17) Weight: 5%
-------------
In regards to the layout/spacing of the tree, the larger the node is, the more of a margin the node should have in regards to its neighboring nodes.
18) Weight: 5%
-------------
Demo a tree that has 30 nodes, a height of 3, and some nodes that have a header image and/or body text. Called "denseTreeData". The result of this demo must meet all of the criteria established above.
19) Weight: 5%
-------------
Demo a tree that has 6 nodes and a depth of 2. Called "simpleTreeData". The result of this demo must meet all of the criteria established above.
20) Weight: 5%
-------------
Demo a full binary tree of height 4. Called "fullTreeData". The result of this demo must meet all of the criteria established above.
