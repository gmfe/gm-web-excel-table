
import * as React from 'react';
import { Resizable } from 'react-resizable';


export const ResizeableTitle = (props: any) => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
};

// export ResizeableTitle