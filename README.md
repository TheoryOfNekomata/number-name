# number-name

Converts a number into its name.

## Why?

Inspired by [number-to-words](https://www.npmjs.com/package/number-to-words). Thinking I could improve on the code to include
[big integers](https://www.npmjs.com/package/big-integer), I looked for some info and found [Landon Curt Noll's Web page describing
the reconstructed English naming system of numbers](http://www.isthe.com/chongo/tech/math/number/howhigh.html). I decided to port
his [Perl script](http://www.isthe.com/chongo/tech/math/number/number) into JavaScript.

## Installation

Via NPM:

    $ npm install --save @theoryofnekomata/number-name

## Usage

```javascript
var NumberName = require('@theoryofnekomata/number-name'),
    
    // see https://github.com/Temoto-kun/number-name/tree/master/src/lang for systems
    converter = new NumberName({ system: systemObj, fractionType: 'lazy' });

var smallerNumber = -6.9e-42; // Number is OK. Can convert negative numbers just fine.
var largeNumber = '5.0e+303'; // note this is too large for a normal Number, so it is represented as string
var name1 = numberName(smallerNumber); // returns the long fractional name with six nine in the end
var name2 = numberName(largeNumber); // returns five centillion
```

## Notes

`number-name` is powered by [`big-integer`](https://www.npmjs.com/package/big-integer). With this, it can convert:
- `Number`s
- number-like strings

It can convert as high as `1.0e+3006003`. Optimization for much larger numbers is in progress.

## TODO

- [ ] Fully localizable number systems (e.g. custom rules for combining fragments of number words)
- [ ] Implement other `fractionType`s, (only `lazy` (digits) is supported as of 0.2.0, e.g. `0.05` => `zero point zero five`,
      will implement `ratio` (`zero and five over one hundred`) and `part` (`zero and five hundredths`))
- [ ] Upon adding more features, update the unit tests as well.

## Contribution

Sure thing! Just clone the repo.

`number-name` uses [Jasmine](https://jasmine.github.io) for unit tests, and
[ESLint](http://eslint.org) to make sure code is written consistently (and implied it will
run consistently as well).

- Run `npm install` upon initial clone.
- Run `npm test` and make sure all the tests pass and properly written.
- Run `npm run lint` to ensure consistency of your code (make sure to install ESLint first).
- Create PRs so that I can confirm and merge your contributions.

Please star the repo if you find it useful in your projects.

## License

MIT. See [LICENSE file](https://raw.githubusercontent.com/Temoto-kun/number-name/master/LICENSE) for details.
