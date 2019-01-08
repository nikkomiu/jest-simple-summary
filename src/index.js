#!/usr/bin/env node
const { readFile } = require('fs');
const { join } = require('path');
const { parseString } = require('xml2js');

class JestSimpleSummary {
  constructor(globalConfig) {
    this.globalConfig = globalConfig;

    this.cloverPath = join(this.globalConfig.coverageDirectory, 'clover.xml');
  }

  static cloverReader(err, data) {
    if (err) {
      console.error('Could not process XML!\n');
      console.error(err.toString());
      return;
    }

    const {
      statements,
      coveredstatements,
      conditionals,
      coveredconditionals,
      methods,
      coveredmethods,
      elements,
      coveredelements,
    } = data.coverage.project[0].metrics[0].$;

    const statementPercent = +coveredstatements / +statements;
    const conditionalPercent = +conditionals > 0 ? (+coveredconditionals / +conditionals) : 1;
    const methodPercent = +coveredmethods / +methods;
    const elementPercent = +coveredelements / +elements;

    const sum = statementPercent + conditionalPercent + methodPercent + elementPercent;

    // Total is (sum / 4) * 100 which simplifies to sum * 25
    console.log();
    console.log('=== Simple Coverage ===');
    console.log(`Total Coverage: ${(sum * 25).toFixed(2)}%`);
    console.log('=======================');
  }

  static onReadFile(reader) {
    return (err, data) => {
      if (err) {
        console.error('Could not process coverage results.');
        console.error('Make sure the "clover" reporter is enabled and the file has been written.\n');
        console.error(err.toString());
        return;
      }

      parseString(data, reader);
    };
  }

  onRunComplete() {
    readFile(this.cloverPath, 'utf8', JestSimpleSummary.onReadFile(JestSimpleSummary.cloverReader));
  }
}

module.exports = JestSimpleSummary;
