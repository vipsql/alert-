/**
 * Name: ruleEditor container
 * Create: 2017-04-13
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import RuleEditor from '../components/ruleEditor';

function ruleEditor(props) {
  let ruleProps = {
    ...props,
  }
  
  if (props.route.path.indexOf('edit') > -1 && Object.keys(props.alertAssociationRules.currentEditRule).length !== 0) {
    ruleProps = {
      ...props,
      ...props.alertAssociationRules.currentEditRule,
      ...props.alertAssociationRules.currentEditRule.rule
    }
    delete ruleProps.rule;
    console.log(ruleProps);
  }

  return (
    <RuleEditor { ...ruleProps } />
  );
}

ruleEditor.propTypes = {
  dispatch: PropTypes.func
};

export default connect((state) => {
  return {
    alertAssociationRules: state.alertAssociationRules,
  }
})(ruleEditor);
