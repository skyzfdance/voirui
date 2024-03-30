import { expect, test } from "vitest"
import * as tree from "../treeHelper"

test("treeHelper => filter", () => {
  const testData = [
    { id: 1, children: [], pid: null },
    { id: 2, children: [], pid: 1 },
    { id: 3, children: [], pid: 1 },
    { id: 4, children: [], pid: 2 },
    { id: 5, children: [], pid: 2 },
    { id: 6, children: [], pid: 3 },
  ]

  const result = tree.filter(testData, (node) => node.pid === 1)

  expect(result).toEqual([
    { id: 2, children: [], pid: 1 },
    { id: 3, children: [], pid: 1 },
  ])
})

test("treeHelper => treeMap", () => {
  const testData = [
    { id: 1, children: [], pid: null },
    { id: 2, children: [], pid: 1 },
    { id: 3, children: [], pid: 1 },
    { id: 4, children: [], pid: 2 },
    { id: 5, children: [], pid: 2 },
    { id: 6, children: [], pid: 3 },
  ]

  const result = tree.treeMap(testData, {
    children: "children",
    childrenKey: "childNodes",
    conversion: (node) => ({ ...node, name: `Node ${node.id}` }),
  })

  expect(result).toEqual([
    {
      id: 1,
      children: [],
      pid: null,
      name: "Node 1",
      childNodes: [
        { id: 2, children: [], pid: 1, name: "Node 2", childNodes: [] },
        { id: 3, children: [], pid: 1, name: "Node 3", childNodes: [] },
      ],
    },
    { id: 4, children: [], pid: 2, name: "Node 4", childNodes: [] },
    { id: 5, children: [], pid: 2, name: "Node 5", childNodes: [] },
    { id: 6, children: [], pid: 3, name: "Node 6", childNodes: [] },
  ])
})

test("treeHelper => findPath", () => {
  const testData = [
    { id: 1, children: [], pid: null },
    { id: 2, children: [], pid: 1 },
    { id: 3, children: [], pid: 1 },
    { id: 4, children: [], pid: 2 },
    { id: 5, children: [], pid: 2 },
    { id: 6, children: [], pid: 3 },
  ]

  const result = tree.findPath(testData, (node) => node.id === 4)

  expect(result).toEqual({ id: 4, children: [], pid: 2 })
})
