const { join } = require('path');
const JestSimpleSummary = require('./index');

describe('index', () => {
  const globalConfig = { coverageDirectory: 'test/directory' };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.genMockFromModule('fs');
  });

  it('sets the clover path on init', () => {
    const expectedPath = join(globalConfig.coverageDirectory, 'clover.xml');

    const instance = new JestSimpleSummary(globalConfig);

    expect(instance.cloverPath).toEqual(expectedPath);
  });

  it('calls onReadFile when onRunComplete is called', () => {
    const returnFn = jest.fn();
    const instance = new JestSimpleSummary(globalConfig);
    instance.onReadFile = jest.fn(() => returnFn);

    instance.onRunComplete();

    setTimeout(() => expect(returnFn).toHaveBeenCalled(), 200);
  });

  it('sends an error and does not call reader when file read fails', () => {
    const errorMessage = 'TEST_ERROR';
    const parseCallback = jest.fn();
    console.error = jest.fn();

    JestSimpleSummary.onReadFile(parseCallback)(errorMessage, undefined);

    expect(console.error).toHaveBeenCalledWith(errorMessage);
    expect(parseCallback).not.toHaveBeenCalled();
  });

  it('calls XML parse callback when no error', () => {
    const parseCallback = jest.fn();

    JestSimpleSummary.onReadFile(parseCallback)(undefined, '<test></test>');

    expect(parseCallback).toHaveBeenCalled();
  });

  it('sends an error when there is an XML parsing error', () => {
    const parseError = 'TEST_ERROR';
    console.error = jest.fn();

    JestSimpleSummary.cloverReader(parseError, undefined);

    expect(console.error).toHaveBeenCalledWith(parseError);
  });

  it('outputs coverage when xml read is successful', () => {
    const data = {
      coverage: {
        project: [{
          metrics: [{
            $: {
              statements: 10,
              coveredstatements: 5,
              conditionals: 10,
              coveredconditionals: 5,
              methods: 10,
              coveredmethods: 5,
              elements: 10,
              coveredelements: 5,
            },
          }],
        }],
      },
    };
    console.log = jest.fn();

    JestSimpleSummary.cloverReader(undefined, data);

    expect(console.log).toHaveBeenCalledWith('Total Coverage: 50.00%');
  });
});
