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
