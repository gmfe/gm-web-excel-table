
import * as React from 'react';


export const Header = (title: string) => {


  return (
    <div style={{
      width: 25,
      height:12,
      fontSize: 12,
      opacity: 0.9,
      fontWeight:400,
      color: `rgba(51,51,51,1)`,
      fontFamily: 'MicrosoftYaHei',
    }}>
      {title}
    </div>
  )
}