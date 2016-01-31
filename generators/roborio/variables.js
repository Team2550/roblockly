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
 * @fileoverview Generating JavaScript for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.RoboRio.variables');

goog.require('Blockly.RoboRio');


Blockly.RoboRio['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.RoboRio.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.RoboRio.ORDER_ATOMIC];
};

Blockly.RoboRio['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.RoboRio.valueToCode(block, 'VALUE',
      Blockly.RoboRio.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.RoboRio.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};

Blockly.RoboRio['variables_def'] = function(block) {
  // Variable definition.
  var types = {INT: "int", STR: "string"};
  var initial = Blockly.RoboRio.valueToCode(block, 'INITIAL',
      Blockly.RoboRio.ORDER_ASSIGNMENT) || '0';
  var type = types[block.getFieldValue('TYPE')];
  var varName = Blockly.RoboRio.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return type + ' ' + varName + ' = ' + initial + ';\n';
};