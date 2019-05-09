import React, {PureComponent, Children, cloneElement} from 'react';
import {build} from 'react-atomic-molecule';
import {DragAndDrop} from 'organism-react-graph';
import get from 'get-object-value';
import getOffset from 'getoffset';

const keys = Object.keys;
let boxGroupId = 1;

class BoxGroup extends PureComponent {
  state = {
    absX: 0,
    absY: 0,
  };

  boxNameInvertMap = {};
  boxs = {};

  move = (x, y) => {
    this.setState({absX: x, absY: y});
  };

  handleDrag = ({absX, absY}) => this.move(absX, absY);

  handleEdit = e => {
    e.preventDefault();
    const {onEdit, name} = this.props;
    onEdit(name, this);
  };

  handleDel = e => {
    const {onDel, name} = this.props;
    onDel(name);
  };

  getBoxIdByName(name) {
    const boxId = get(this.boxNameInvertMap, [name]);
    return boxId;
  }

  setBoxNameInvertMap(id, name) {
    this.boxNameInvertMap[name] = id;
  }

  addBox(obj) {
    if (obj) {
      this.boxs[obj.getId()] = obj;
    }
  }

  getBox(id) {
    return get(this.boxs, [id]);
  }

  getWH() {
    const offset = getOffset(this.getEl());
    const {w, h} = offset;
    return {width: w, height: h};
  }

  getName() {
    return this.props.name;
  }

  getId() {
    return this.id;
  }

  getEl = () => {
    return this.el.getEl();
  };

  constructor(props) {
    super(props);
    this.id = boxGroupId;
    boxGroupId++;
  }

  componentDidMount() {
    const {name, host} = this.props;
    const {x, y} = host.getLazyMoveByName(name) || {};
    if (x || y) {
      this.move(x, y);
    }
  }

  render() {
    const {name, text, host, data, onEdit, onDel, children, ...props} = this.props;
    const {rectW, rectH, boxsPos, absX, absY} = this.state;
    const component = build(host.getBoxGroupComponent(name));
    const thisChildren = Children.map(children, c =>
      cloneElement(c, {
          boxGroupId: this.id,
          boxGroupAbsX: absX,
          boxGroupAbsY: absY,
      })    
    );
    return (
      <DragAndDrop
        ref={el => this.el = el}
        absX={absX}
        absY={absY}
        onDrag={this.handleDrag}
        zoom={host.getTransform}
        onGetEl={this.getEl}
        component={component({
          ...props,
          id: this.id,
          isInsideVector: host.insideVector,
          onEdit: this.handleEdit,
          onDel: this.handleDel,
          className: 'box-group',
          boxGroupAbsX: absX,
          boxGroupAbsY: absY,
          text: text || name,
        }, thisChildren)}
      />
    );
  }
}

export default BoxGroup;
