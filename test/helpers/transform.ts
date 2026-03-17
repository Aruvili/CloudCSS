import { convert } from '../../src/helpers';

describe('transform', () => {
  it('convert code', () => {
    expect(convert('const plugin = require(\'tailwindcss/plugin\')')).toEqual('const plugin = require(\'cloudcss/plugin\')');
    expect(convert('const colors = require(\'tailwindcss/colors\')')).toEqual('const colors = require(\'cloudcss/colors\')');
    expect(convert(`
      const resolveConfig = require('tailwindcss/resolveConfig');
      const defaultTheme = require('tailwindcss/defaultTheme');
      const typography = require('@tailwindcss/typography');
    `)).toEqual(`
      const resolveConfig = require('cloudcss/resolveConfig');
      const defaultTheme = require('cloudcss/defaultTheme');
      const typography = require('cloudcss/plugin/typography');
    `);
  });
});
