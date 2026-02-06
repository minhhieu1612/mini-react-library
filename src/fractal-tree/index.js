import { useCallback, useEffect, useRef, useState } from "lib/hooks";
import styles from "./index.module.css";
import { jsx } from "lib/jsx";

const treeConfig = {
  ROOT_LENGTH: 160,
  ANGLE: 30,
  BRANCH_RATIO: 3 / 4,
  BRANCH_TRANSLATE_X: 12,
  BRANCH_TRANSLATE_Y: 40,
};

const branchTypeEnum = {
  ROOT: "root",
  LEFT: "left",
  RIGHT: "right",
};

const treeStateEnum = {
  GROWING: "growing",
  SHRINKING: "shrinking",
};

const treeStageEnum = {
  YOUNG: "young",
  MIDDLE_AGED: "middle aged",
  OLD: "old",
};

const baseLevel = 1;
const maximumLevel = 10;

export default function FractalTree() {
  const [level, setLevel] = useState(baseLevel);
  const [stage, setStage] = useState(treeStageEnum.YOUNG);
  const intervalId = useRef();
  const treeState = useRef(treeStateEnum.GROWING);

  const levelUp = useCallback(() => setLevel((prev) => prev + 1), []);
  const downgrade = useCallback(
    () => setLevel((prev) => (prev > 0 ? prev - 1 : 0)),
    [],
  );

  const renderTree = (loopLevel = 0, branchType = branchTypeEnum.ROOT) => {
    for (let i = 0; i < 1e6; i++) {}

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

  useEffect(() => {
    function automateGrowAndShrink() {
      intervalId.current = setInterval(() => {
        setLevel((prev) => {
          if (treeState.current === treeStateEnum.GROWING) {
            if (prev < maximumLevel) {
              return prev + 1;
            }
            treeState.current = treeStateEnum.SHRINKING;
            return prev - 1;
          }
          if (prev > baseLevel) return prev - 1;
          treeState.current = treeStateEnum.GROWING;
          return prev + 1;
        });
      }, 0);
    }

    automateGrowAndShrink();

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, []);

  useEffect(() => {
    const average = Math.floor((baseLevel + maximumLevel) / 2);
    let newStage = treeStageEnum.YOUNG;

    if (average - 1 <= level && level <= average + 1) {
      newStage = treeStageEnum.MIDDLE_AGED;
    } else if (level > average + 1) {
      newStage = treeStageEnum.OLD;
    }

    setStage(newStage);
  }, [level]);

  return jsx("div", { className: styles.container }, [
    jsx("h3", { className: "heading" }, "Fractal Tree"),
    jsx("div", { className: styles.controlWrapper }, [
      jsx("button", { onClick: downgrade }, "Downgrade"),
      jsx("button", { onClick: levelUp }, "Level up"),
      jsx("span", null, "Current level: " + level),
      jsx(
        "span",
        null,
        "Number of rendered nodes: " + (Math.pow(2, level + 1) - 1),
      ),
      jsx(
        "span",
        { style: { textTransform: "capitalize" } },
        "Stage: " + stage,
      ),
    ]),
    jsx("div", { className: styles.tree }, renderTree()),
  ]);
}
