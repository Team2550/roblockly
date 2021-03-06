/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating RoboRio for procedure blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.RoboRio.procedures');

goog.require('Blockly.RoboRio');


Blockly.RoboRio['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.RoboRio.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.RoboRio.statementToCode(block, 'STACK');
  if (Blockly.RoboRio.STATEMENT_PREFIX) {
    branch = Blockly.RoboRio.prefixLines(
        Blockly.RoboRio.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.RoboRio.INDENT) + branch;
  }
  if (Blockly.RoboRio.INFINITE_LOOP_TRAP) {
    branch = Blockly.RoboRio.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var returnValue = Blockly.RoboRio.valueToCode(block, 'RETURN',
      Blockly.RoboRio.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.RoboRio.variableDB_.getName(block.arguments_[x],
        Blockly.Variables.NAME_TYPE);
  }
  var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
      branch + returnValue + '}';
  code = Blockly.RoboRio.scrub_(block, code);
  Blockly.RoboRio.definitions_[funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.RoboRio['procedures_defnoreturn'] =
    Blockly.RoboRio['procedures_defreturn'];

Blockly.RoboRio['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.RoboRio.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.RoboRio.valueToCode(block, 'ARG' + x,
        Blockly.RoboRio.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.RoboRio.ORDER_FUNCTION_CALL];
};

Blockly.RoboRio['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  var funcName = Blockly.RoboRio.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.RoboRio.valueToCode(block, 'ARG' + x,
        Blockly.RoboRio.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

Blockly.RoboRio['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.RoboRio.valueToCode(block, 'CONDITION',
      Blockly.RoboRio.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (block.hasReturnValue_) {
    var value = Blockly.RoboRio.valueToCode(block, 'VALUE',
        Blockly.RoboRio.ORDER_NONE) || 'null';
    code += '  return ' + value + ';\n';
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};
