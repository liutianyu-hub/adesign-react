import React, { useState, useContext, PropsWithChildren, useEffect } from 'react';
import classNames from 'classnames';
import { RadioContext } from './RadioContext';
import './index.less';
import { RadioProps } from './interface';

const InternalRadio: React.FC<RadioProps> = (props) => {
  const {
    className,
    value,
    children,
    style,
    onMouseLeave,
    onChange = () => {},
    ...restProps
  } = props;

  const [radioCheckbox, setRadioCheckBox] = useState(false);
  const Context = useContext(RadioContext);
  const prefixCls = 'apipost-radio';
  const radioProps = { ...restProps };
  const wrapperClassString = classNames(
    `${prefixCls}-wrapper`,
    {
      [`${prefixCls}-wrapper-checked`]: radioProps.checked || radioCheckbox,
      [`${prefixCls}-wrapper-disabled`]: radioProps.disabled || Context.disabled,
    },
    className
  );
  if (Context) {
    radioProps.checked = Context.value === value;
    radioProps.disabled = Context.disabled;
    radioProps.onClick = Context.onChange;
  }

  const innerClass = classNames(`${prefixCls}-inner`, {
    [`${prefixCls}-inner-checked`]: radioProps.checked || radioCheckbox,
  });
  const handleOnChange = (e: any) => {
    if (Context?.onChange) {
      Context.onChange(value);
    } else {
      setRadioCheckBox(e.target.checked);
      onChange && onChange(e.target.checked);
    }
  };
  return (
    <label className={wrapperClassString} style={style}>
      <span className="apipost-Radio" onClick={onChange}>
        <input
          type="radio"
          value={value}
          onChange={() => {}}
          checked={radioCheckbox}
          onClick={handleOnChange}
          {...restProps}
        />
        <span className={innerClass}></span>
      </span>
      {children !== undefined ? <span className="apipost-radio-children">{children}</span> : null}
    </label>
  );
};

const Radio = InternalRadio;
// const Radio = React.forwardRef<unknown, RadioProps>(InternalRadio);

Radio.displayName = 'Radio';
Radio.defaultProps = {
  checked: false,
};

export default Radio;
