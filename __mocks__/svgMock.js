const React = require('react');

module.exports = {
  __esModule: true,
  default: 'test-file-stub',
  ReactComponent: React.forwardRef(function SvgMock(props, ref) {
    return React.createElement('svg', { ref, ...props });
  }),
};
