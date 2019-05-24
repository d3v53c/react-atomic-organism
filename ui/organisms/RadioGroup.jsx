import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {mixClass, Field, SemanticUI} from 'react-atomic-molecule';
import get from 'get-object-value';
import callfunc from 'call-func';
import {FUNCTION} from 'reshow-constant';

import Radio from '../organisms/Checkbox';

const Label = ({children, ...props}) => {
  if (!children) {
    return null;
  } else {
    return (
      <SemanticUI {...props} atom="label">
        {children}
      </SemanticUI>
    );
  }
};

class RadioGroup extends PureComponent {
  state = {value: null};

  static propTypes = {
    options: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
  };

  static defaultProps = {
    labelLocator: d => d.label,
    valueLocator: d => d.value,
    // not an event base so naming it with callback
    checkedCallback: null,
  };

  getChecked(item, nextValue, current) {
    const {checkedCallback, valueLocator} = this.props;
    if (FUNCTION === typeof checkedCallback) {
      return checkedCallback(item, nextValue, current);
    } else {
      return nextValue === valueLocator(item); 
    }
  }

  handleClick = (e, before, after, ref) => {
    const {onChange} = this.props;
    let current = null;
    if (ref) {
      if (ref.props.disabled) {
        return;
      }
      current = ref;
    }
    const value = current.getValue();
    this.setState({current, value}, () => {
      callfunc(onChange, [value, current]);
    });
  };

  getValue() {
    const current = get(this, ['state', 'current']);
    return current ? current.getValue() : null;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {value, options} = nextProps;
    const nextState = {};
    if (options !== prevState.options) {

    } else if (value !== prevState.prePropsValue) {
      nextState.value = value; 
      nextState.propsValue = value;
    }
    return nextState;
  }

  render() {
    const {
      radioFieldStyle,
      radioFieldStyles,
      inline,
      fieldClassName,
      label,
      options,
      name,
      value: propsValue,
      onChange,
      valueLocator,
      labelLocator,
      checkedCallback,
      ...others
    } = this.props;
    const {current, value} = this.state;
    const classes = mixClass(fieldClassName, {
      grouped: !inline,
    });

    return (
      <Field inline={inline} fieldClassName={classes} {...others}>
        <Label>{label}</Label>
        {options.map((item, key) => (
          <Radio
            type="radio"
            fieldStyle={radioFieldStyle}
            fieldStyles={radioFieldStyles}
            name={name}
            key={key}
            {...item.props}
            label={labelLocator(item)}
            value={valueLocator(item)}
            afterClick={this.handleClick}
            checked={this.getChecked(item, value, current)}
          />
        ))}
      </Field>
    );
  }
}

export default RadioGroup;
