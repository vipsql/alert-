/**
 * Name: ruleEditor container
 * Create: 2017-04-13
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import RuleEditor from '../components/ruleEditor';

let defaultRule = {}

function ruleEditor({alertAssociationRules, rule, ...other}) {
  let ruleProps = {
    alertAssociationRules,
    ...other
  }
  if (other.route.path.indexOf('edit') > -1 && Object.keys(alertAssociationRules.currentEditRule).length) {
    ruleProps = {
      ...ruleProps,
      ...alertAssociationRules.currentEditRule,
      ...rule
    }
    delete ruleProps.rule;
  }

  return (
    <RuleEditor { ...ruleProps } />
  );
}

ruleEditor.propTypes = {
  dispatch: PropTypes.func
};

export default connect( state => {
  return {
    alertAssociationRules: state.alertAssociationRules,
    rule: Object.keys(state.alertAssociationRules.currentEditRule).length ? state.alertAssociationRules.currentEditRule.rule : defaultRule,
  }
})(ruleEditor);
