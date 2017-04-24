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
import RuleEditor from '../components/ruleEditor';

function ruleEditor(props) {
  
  if (props.route.path.indexOf('add') > -1) {
    console.log(props);
  }
  if (props.route.path.indexOf('edit') > -1) {
    console.log(props);
  }
  return (
    <RuleEditor />
  );
}

ruleEditor.propTypes = {
  dispatch: PropTypes.func
};

export default connect(({alertAssociationRules}) => ({alertAssociationRules}))(ruleEditor);
