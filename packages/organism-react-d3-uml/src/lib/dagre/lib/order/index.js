import buildLayerGraph from "./build-layer-graph";
import sortSubgraph from "./sort-subgraph";
import addSubgraphConstraints from "./add-subgraph-constraints";
import initOrder from "./init-order";
import crossCount from "./cross-count";
import { range, rangeStep } from "../../../lodash-lite";
import * as util from "../util";
import { Graph } from "../graphlib";

const keys = Object.keys;

export default order;

/*
 * Applies heuristics to minimize edge crossings in the graph and sets the best
 * order solution as an order attribute on each node.
 *
 * Pre-conditions:
 *
 *    1. Graph must be DAG
 *    2. Graph nodes must be objects with a "rank" attribute
 *    3. Graph edges must have the "weight" attribute
 *
 * Post-conditions:
 *
 *    1. Graph nodes will have an "order" attribute based on the results of the
 *       algorithm.
 */
function order(g) {
  var maxRank = util.maxRank(g);
  var downLayerGraphs = buildLayerGraphs(
    g,
    range(maxRank + 1).slice(1),
    "inEdges"
  );
  var upLayerGraphs = buildLayerGraphs(
    g,
    rangeStep(maxRank - 1, -1, -1),
    "outEdges"
  );

  var layering = initOrder(g);
  assignOrder(g, layering);

  var bestCC = Number.POSITIVE_INFINITY,
    best;

  for (var i = 0, lastBest = 0; lastBest < 4; ++i, ++lastBest) {
    sweepLayerGraphs(i % 2 ? downLayerGraphs : upLayerGraphs, i % 4 >= 2);

    layering = util.buildLayerMatrix(g);
    var cc = crossCount(g, layering);
    if (cc < bestCC) {
      lastBest = 0;
      best = { ...layering };
      bestCC = cc;
    }
  }

  assignOrder(g, best);
}

function buildLayerGraphs(g, ranks, relationship) {
  return ranks.map(function (rank) {
    return buildLayerGraph(g, rank, relationship);
  });
}

function sweepLayerGraphs(layerGraphs, biasRight) {
  var cg = new Graph();
  layerGraphs.forEach(function (lg) {
    var root = lg.graph().root;
    var sorted = sortSubgraph(lg, root, cg, biasRight);
    sorted.vs.forEach(function (v, i) {
      lg.node(v).order = i;
    });
    addSubgraphConstraints(lg, cg, sorted.vs);
  });
}

function assignOrder(g, layering) {
  keys(layering || {}).forEach((key) => {
    layering[key].forEach((v, i) => (g.node(v).order = i));
  });
}
