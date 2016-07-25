# js-tree-visualizer
Render a visualization of an aesthetically pleasing tree from a list of nodes with connecting edges. The layout algorithm is a variation on existing ["radial tree" techniques](https://en.wikipedia.org/wiki/Radial_tree) in which the tree structure expands in an ellipse that matches the aspect ratio of the browser window. Each node can contain a header image, title text and/or body text.

# Project Structure
* ```tree_visualization.html``` : Demo that shows how to use js-tree-visualizer
* ```tree/treeVisual.js``` : Javascript implementation
* ```tree/treeVisualTest.js``` : Utilized for debugging and the demo. Not needed in production.
* ```vendor/...``` : Implementation dependencies

# Demo Instructions
1. Visit the ```tree_visualization.html``` file in a supported modern web browser (Chrome, Firefox, Safari, Microsoft Edge) [here](https://htmlpreview.github.io/?https://github.com/davemasterdave/js-tree-visualizer/blob/master/tree_visualization.html).
2. Click the links in the top nav bar to see how different tree structures and data are presented.

# Implementation Notes
js-tree-visualizer is expecting node data in the following JSON structure:
```json
{
    "id": 26,
    "parentId": 24,
    "headerImg": "http://placehold.it/250x50.jpg/444/FFF",
    "titleText": "Title lorem ipsum",
    "bodyText": "Lorem ipsum dolor"
}
```
