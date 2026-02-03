import { useCallback, useState } from "lib/hooks";
import styles from "./index.module.css";
import { jsx } from "lib/jsx";

const treeConfig = {
  ROOT_LENGTH: 320,
  ANGLE: 45,
  BRANCH_RATIO: 3 / 5,
  BRANCH_TRANSLATE_X: 42,
  BRANCH_TRANSLATE_Y: 116,
};

const branchTypeEnum = {
  ROOT: "root",
  LEFT: "left",
  RIGHT: "right",
};

export default function FractalTree() {
  const [level, setLevel] = useState(2);

  const levelUp = useCallback(() => setLevel((prev) => prev + 1), []);
  const downgrade = useCallback(
    () => setLevel((prev) => (prev > 0 ? prev - 1 : 0)),
    [],
  );

  const renderTree = (loopLevel = 0, branchType = branchTypeEnum.ROOT) => {
    if (loopLevel === level)
      return jsx(
        "div",
        {
          className: styles.branch,
          style: {
            "--level": level,
            width: `${treeConfig.ROOT_LENGTH * Math.pow(treeConfig.BRANCH_RATIO, loopLevel)}px`,
            transform:
              branchType !== branchTypeEnum.ROOT
                ? `rotate(${(branchType === branchTypeEnum.LEFT ? -1 : 1) * treeConfig.ANGLE}deg)
                translate(${treeConfig.BRANCH_TRANSLATE_X * Math.pow(treeConfig.BRANCH_RATIO, loopLevel)}px, 
                ${
                  (branchType === branchTypeEnum.LEFT ? -1 : 1) *
                  treeConfig.BRANCH_TRANSLATE_Y *
                  Math.pow(treeConfig.BRANCH_RATIO, loopLevel)
                }px)`
                : null,
          },
        },
        null,
      );

    if (loopLevel < level)
      return jsx(
        "div",
        {
          className: styles.branch,
          style: {
            "--level": loopLevel,
            width: `${treeConfig.ROOT_LENGTH * Math.pow(treeConfig.BRANCH_RATIO, loopLevel)}px`,
            transform:
              branchType !== branchTypeEnum.ROOT
                ? `rotate(${(branchType === branchTypeEnum.LEFT ? -1 : 1) * treeConfig.ANGLE}deg)
                translate(${treeConfig.BRANCH_TRANSLATE_X * Math.pow(treeConfig.BRANCH_RATIO, loopLevel)}px, 
                ${
                  (branchType === branchTypeEnum.LEFT ? -1 : 1) *
                  treeConfig.BRANCH_TRANSLATE_Y *
                  Math.pow(treeConfig.BRANCH_RATIO, loopLevel)
                }px)`
                : null,
          },
        },
        [
          renderTree(loopLevel + 1, branchTypeEnum.LEFT),
          renderTree(loopLevel + 1, branchTypeEnum.RIGHT),
        ],
      );
  };

  return jsx("div", { className: styles.container }, [
    jsx("h3", { className: "heading" }, "Fractal Tree"),
    jsx("div", { className: styles.controlWrapper }, [
      jsx("button", { onClick: downgrade }, "Downgrade"),
      jsx("button", { onClick: levelUp }, "Level up"),
      jsx("span", null, "Current level: " + level),
      jsx("span", null, "Number of rendered nodes: " + (Math.pow(2, level + 1) - 1)),
    ]),
    jsx("div", { className: styles.tree }, renderTree()),
  ]);
}
