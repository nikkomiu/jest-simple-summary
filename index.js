#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { parseString } = require('xml2js');

class JestSimpleSummary {
  constructor(globalConfig, opts) {
    this.opts = opts;
    this.globalConfig = globalConfig;

    this.cloverPath = path.join(this.globalConfig.coverageDirectory, 'clover.xml');
  }

  cloverReader(err, { coverage }) {
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
      coveredelements
    } = coverage.project[0].metrics[0]['$'];

    const statementPercent = +coveredstatements / +statements;
    const conditionalPercent = +coveredconditionals / +conditionals;
    const methodPercent = +coveredmethods / +methods;
    const elementPercent = +coveredelements / +elements;

    const sum = statementPercent + conditionalPercent + methodPercent + elementPercent;

    // Total is (sum / 4) * 100 which simplifies to sum * 25
    console.log('=== Simple Coverage ===');
    console.log(`Total Coverage: ${(sum * 25).toFixed(2)}%`)
    console.log('=======================');
  };

  onRunComplete(contexts, results) {
    fs.readFile(this.cloverPath, 'utf8', async (err, data) => {
      if (err) {
        console.error('Could not process coverage results.');
        console.error('Make sure the "clover" reporter is enabled and the file has been written.\n');
        console.error(err.toString());
        return;
      }

      parseString(data, this.cloverReader);
    });
  }
}

module.exports = JestSimpleSummary;
