const { join } = require('path');
const JestSimpleSummary = require('./index');

describe('index init', () => {
  it('sets the clover path on init', () => {
    const globalConfig = { coverageDirectory: 'test/directory' };
    const expectedPath = join(globalConfig.coverageDirectory, 'clover.xml');

    const instance = new JestSimpleSummary(globalConfig);

    expect(instance.cloverPath).toEqual(expectedPath);
  });
});

describe('index', () => {
  const globalConfig = { coverageDirectory: 'test/directory' };
  let instance;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.genMockFromModule('fs');

    instance = new JestSimpleSummary(globalConfig);
  });

  it('calls onReadFile when onRunComplete is called', () => {
    const returnFn = jest.fn();
    instance.onReadFile = jest.fn(() => returnFn);

    instance.onRunComplete();

    setTimeout(() => expect(returnFn).toHaveBeenCalled(), 200);
  });

  it('sends an error and does not call reader when file read fails', () => {
    const errorMessage = 'TEST_ERROR';
    const parseCallback = jest.fn();
    console.error = jest.fn();

    instance.onReadFile(parseCallback)(errorMessage, undefined);

    expect(console.error).toHaveBeenCalledWith(errorMessage);
    expect(parseCallback).not.toHaveBeenCalled();
  });

  it('calls XML parse callback when no error', () => {
    const parseCallback = jest.fn();

    instance.onReadFile(parseCallback)(undefined, '<test></test>');

    expect(parseCallback).toHaveBeenCalled();
  });

  it('sends an error when there is an XML parsing error', () => {
    const parseError = 'TEST_ERROR';
    console.error = jest.fn();

    instance.cloverReader(parseError, undefined);

    expect(console.error).toHaveBeenCalledWith(parseError);
  });

  it('outputs coverage when xml read is successful', () => {
    const data = {
      coverage: {
        project: [{
          metrics: [{
            '$': {
              statements: 10,
              coveredstatements: 5,
              conditionals: 10,
              coveredconditionals: 5,
              methods: 10,
              coveredmethods: 5,
              elements: 10,
              coveredelements: 5
            }
          }]
        }]
      }
    };
    console.log = jest.fn();

    instance.cloverReader(undefined, data);

    expect(console.log).toHaveBeenCalledWith(`Total Coverage: 50.00%`);
  });
});
