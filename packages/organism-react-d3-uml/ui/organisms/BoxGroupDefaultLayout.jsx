import React, {Children, cloneElement} from 'react';
import getOffset from 'getoffset';
import get from 'get-object-value';
import {Graph, Group, Rect, Text} from 'organism-react-graph';

import CancelButton from '../organisms/CancelButton';
import BaseBoxComponent from '../organisms/BaseBoxComponent';
const keys = Object.keys;

const BoxGroupHeader = ({children, x, y, width}) => (
  <Group transform="translate(0, 20)" style={Styles.boxGroupHeader}>
    <Rect x="0" y="-20" rx="5" width={width} height="20" fill="#aaa" />
    <Text y="-5" alignCenter parentWidth={width} fill="#fff">
      {children}
    </Text>
  </Group>
);

class BoxGroupDefaultLayout extends BaseBoxComponent {
  state = {
    rectW: 0,
    rectH: 0,
    boxsPos: {},
  };
  childrenEl = {};

  getEl() {
    return this.rect;
  }

  handleEdit = e => {
    e.preventDefault();
    const {onEdit, name} = this.props;
    onEdit(name, this);
  };

  componentDidMount() {
    let startY = 20;
    const boxsPos = {};
    const arrW = [];
    keys(this.childrenEl).forEach(cKey => {
      const cEl = this.childrenEl[cKey].getEl();
      const {w, h} = getOffset(cEl);
      startY += h;
      arrW.push(w);
      boxsPos[cKey] = {
        y: startY,
        w,
        h,
      };
    });
    const maxW = Math.max(...arrW);
    this.setState({
      rectW: maxW + 10,
      rectH: startY + 5,
      boxsPos,
    });
  }

  render() {
    const {
      svg,
      className,
      onMouseEnter,
      onMouseLeave,
      onDel,
      onEdit,
      showConnectPoint,
      name,
      text,
      children,
      boxGroupId,
      host,
      data,
      boxGroupAbsX,
      boxGroupAbsY,
    } = this.props;
    const {rectW, rectH, boxsPos} = this.state;
    const translate = `translate(${boxGroupAbsX}px, ${boxGroupAbsY}px)`;
    const graphStyle = {...Styles.container};
    const groupStyle = {...Styles.group};
    let cancelButton = (
      <CancelButton
        x={-10}
        y={-10}
        onClick={e => {
          e.preventDefault();
          onDel(name);
        }}
      />
    );
    if (host.insideVector(this.el)) {
      groupStyle.transform = translate;
    } else {
      graphStyle.transform = translate;
    }
    if (onEdit) {
      graphStyle.cursor = 'pointer';
    }
    const atom = svg ? 'g' : 'svg';
    return (
      <Graph
        className={className}
        atom={atom}
        style={graphStyle}
        refCb={el => (this.el = el)}>
        <Group style={groupStyle}>
          <Rect
            style={Styles.rect}
            rx="5"
            ry="5"
            width={rectW}
            height={rectH}
            refCb={el => (this.rect = el)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={this.handleEdit}
          />
          <BoxGroupHeader width={rectW}>{text}</BoxGroupHeader>
          {cancelButton}
          {Children.map(children, (c, ck) =>
            cloneElement(c, {
              boxGroupId,
              boxGroupAbsX,
              boxGroupAbsY,
              key: ck,
              host,
              x: 5,
              y: get(boxsPos, [ck, 'y'], 0),
              width: get(boxsPos, [ck, 'w'], 0),
              height: get(boxsPos, [ck, 'h'], 0),
              ref: el => (this.childrenEl[ck] = el),
              onClick: this.handleEdit,
            }),
          )}
        </Group>
      </Graph>
    );
  }
}

export default BoxGroupDefaultLayout;

const Styles = {
  container: {
    width: 1,
    height: 1,
    position: 'absolute',
    overflow: 'visible',
  },
  group: {
    pointerEvents: 'all',
  },
  rect: {
    stroke: '#999',
    fill: '#fff',
  },
  boxGroupHeader: {
    pointerEvents: 'none',
  },
};
