import React, {
  PropTypes,
  Component
} from 'react';
import { default as cls } from 'classnames';
import Condition from './condition';

import styles from './defineConditions.less';

const DefineConditions = (props) => {
  return (
    <div className="defineConditions">
      <h2>定义条件</h2>
      <Condition />
    </div>
  );
}

export default DefineConditions;
