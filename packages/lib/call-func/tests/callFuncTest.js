import {expect} from 'chai';

import callfunc from '../cjs/src/index.js';


describe('Test call func', () => {
  it('test call', () => {
    let check = false;
    const a = () => {
      check = true;
    }
    callfunc(a);
    expect(check).to.be.true;
  });

  it('test call with params', () => {
    let check = false;
    const a = p => {
      check = p;
    }
    callfunc(a, ['foo']);
    expect(check).to.equal('foo');
  });

  it('test call with scope', () => {
    let check = false;
    class uObj {
      a(p, hasThis) {
        check = p;
        if (hasThis) {
          expect(this).to.deep.equal({});
        } else {
          expect(this).to.be.undefined;
        }
      }
    }
    const o = new uObj();
    callfunc(o.a, ['foo', true], {});
    callfunc(o.a, ['foo', false]);
  });
});