# Jest Simple Summary

A library for reporting simple Jest coverage for a project.
This library is mainly used for CI/CD platforms that generally
only support a single number for a coverage reporter. This
reporter also works with Jest when color is enabled!

## Installation

Install Simple Summary using `npm`:

```
npm install --save-dev jest-simple-summary
```

## Basic Jest Usage

To get started using this package you will need to add this reporter to
your list of Jest `reporters`. You will also need to add the `clover`
reporter to the coverage reporters section.

```json
{
  "coverageReporters": ["clover"],
  "reporters": ["default", "jest-simple-summary"]
}
```

## Gitlab CI Setup

Navigate to **Settings** > **CI/CD Settings** > **General pipelines** and
add the following regular expression into the **Test coverage parsing** section:

```
Total Coverage: (\d+\.\d+\%)
```

After saving your changes you should be able to get the proper coverage number
in Gitlab CI for Jest!
