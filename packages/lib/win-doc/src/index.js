/**
 * !!Important!! do not use reshow-constant here
 * Bable will transpile it to double undefined
 */

const doc = w => {
  w = w || win();
  return 'undefined' !== typeof w.document ? w.document : {};
}

const win = () => ('undefined' !== typeof window ? window : {});

export {doc, win};
