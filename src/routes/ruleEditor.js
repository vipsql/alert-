/**
 * Name: ruleEditor container
 * Create: 2017-04-13
 */

import React, {
  PropTypes,
  Component
} from 'react';
import {
  connect
} from 'dva';
import {
  BaseInfo,
  AlertSource,
  DefineConditions,
  SetActions
} from '../components/ruleEditor';

import styles from './ruleEditor.less';

function RuleEditor(dispatch) {
  return (
    <div id="ruleEditor">
      <BaseInfo />
      <AlertSource />
      <DefineConditions />
      <SetActions />
      <span className="submit">保存</span>
    </div>
  );
}

RuleEditor.propTypes = {
  dispatch: PropTypes.func
};

export default connect()(RuleEditor);
