import React from "react";
import { mixClass, SemanticUI } from "react-atomic-molecule";
import getWindowOffset, { alignUI, getPositionString } from "get-window-offset";
import { toInt } from "to-percent-js";

import PopupOverlay from "../molecules/PopupOverlay";

class PopupFloatEl extends PopupOverlay {
  _mount = false;

  static defaultProps = {
    style: {
      position: "absolute",
      right: "auto",
    },
    name: "float",
    className: "popup",
  };

  /**
   * For monitor window resize
   */
  handleResize = () => {
    this.handleMoveTo();
  };

  handleMoveTo = () => {
    if (!this.floatEl || !this._mount) {
      return;
    }
    const { targetEl } = this.props;
    if (!document.body.contains(targetEl)) {
      return;
    }
    const pos = this.calPos();
    const diffTop = Math.abs(pos.top - toInt(this.floatTop));
    const diffLeft = Math.abs(pos.left - toInt(this.floatLeft));
    if (
      1 >= diffTop &&
      1 >= diffLeft &&
      pos.width === this.floatWidth &&
      pos.height === this.floatHeight &&
      pos.className === this.floatClassName
    ) {
      return;
    }
    this.floatTop = pos.top;
    this.floatLeft = pos.left;
    this.floatWidth = pos.width;
    this.floatHeight = pos.height;
    this.floatClassName = pos.className;
    this.setState(pos);
  };

  calPos = () => {
    const faultPos = {
      top: -9999,
      left: -9999,
    };
    const { targetEl, alignParams } = this.props;
    if (!this.floatEl || !targetEl) {
      return faultPos;
    }
    const winInfo = getWindowOffset(targetEl);
    if (!winInfo) {
      return faultPos;
    }
    const info = alignUI(targetEl, this.floatEl, alignParams, winInfo);
    if (!info) {
      console.error("can not get alignUI info");
      return faultPos;
    }
    const { move, loc } = info;
    const result = {
      top: move[1],
      left: move[0],
      className: getPositionString(loc),
    };
    return result;
  };

  setFloatEl = (el) => {
    if (el) {
      this.floatEl = el;
    }
    this.handleMoveTo();
  };

  /**
   * For extend class
   */
  getFloatEl() {
    return this.floatEl;
  }

  constructor(props) {
    super(props);
    // Need exted state form parent class (PopupOverlay)
    this.state = {
      ...this.state,
      refCb: this.setFloatEl,
    };
  }

  componentDidMount() {
    this._mount = true;
    window.addEventListener("resize", this.handleResize);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.handleMoveTo();
  }

  componentWillUnmount() {
    this._mount = false;
    window.removeEventListener("resize", this.handleResize);
  }
}

export default PopupFloatEl;
