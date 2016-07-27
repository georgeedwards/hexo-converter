//<reference path='../typings/index.d.ts' />

var Greeter = require('../src/greeter');

describe('greeter', function () {
  it('should greet with message', function () {
    var greeter = new Greeter('friend');
    expect(greeter.greet()).toBe('Bonjour, friend!');
  });
});

//var mdProcessing = require('../lib/mdProcessing');
