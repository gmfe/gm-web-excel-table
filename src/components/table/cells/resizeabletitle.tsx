
import * as React from 'react';
import { Resizable } from 'react-resizable';


export const ResizeableTitle = (props: any) => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return props.children;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize}>
      {props.children}
    </Resizable>
  );
};

// export ResizeableTitle