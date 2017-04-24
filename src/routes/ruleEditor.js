/**
 * Name: ruleEditor container
 * Create: 2017-04-13
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import RuleEditor from '../components/ruleEditor';

function ruleEditor(props) {
  return (
    <RuleEditor { ...props } />
  );
}

ruleEditor.propTypes = {
  dispatch: PropTypes.func
};

export default connect(({ruleEditor}) => ({ruleEditor}))(ruleEditor);
