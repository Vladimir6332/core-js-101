/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  selector: {
    element: '',
    classList: [],
    id: '',
    attrList: [],
    pseudoElement: '',
    pseudoClassList: [],
  },

  errors: {
    uniqueElementsError:
      'Element, id and pseudo-element should not occur more then one time inside the selector',
    orderSettingElementsError:
      'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
  },

  combinedSelectorStr: '',

  element(value) {
    const newSelectorBuilder = { ...this };
    newSelectorBuilder.selector = JSON.parse(JSON.stringify(this.selector));

    if (newSelectorBuilder.selector.element) {
      throw newSelectorBuilder.errors.uniqueElementsError;
    }
    if (
      newSelectorBuilder.selector.id
      || newSelectorBuilder.selector.classList.length > 0
      || newSelectorBuilder.selector.attrList.length > 0
      || newSelectorBuilder.selector.pseudoClassList.length > 0
      || newSelectorBuilder.selector.pseudoElement
    ) {
      throw newSelectorBuilder.errors.orderSettingElementsError;
    }
    newSelectorBuilder.selector.element = value;
    return newSelectorBuilder;
  },

  id(value) {
    const newSelectorBuilder = { ...this };
    newSelectorBuilder.selector = JSON.parse(JSON.stringify(this.selector));
    const errorMessage = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    if (newSelectorBuilder.selector.id) {
      throw errorMessage;
    }
    if (
      newSelectorBuilder.selector.classList.length > 0
      || newSelectorBuilder.selector.attrList.length > 0
      || newSelectorBuilder.selector.pseudoClassList.length > 0
      || newSelectorBuilder.selector.pseudoElement
    ) {
      throw newSelectorBuilder.errors.orderSettingElementsError;
    }
    newSelectorBuilder.selector.id = value;
    return newSelectorBuilder;
  },

  class(value) {
    const newSelectorBuilder = { ...this };
    newSelectorBuilder.selector = JSON.parse(JSON.stringify(this.selector));
    if (
      newSelectorBuilder.selector.attrList.length > 0
      || newSelectorBuilder.selector.pseudoClassList.length > 0
      || newSelectorBuilder.selector.pseudoElement
    ) {
      throw newSelectorBuilder.errors.orderSettingElementsError;
    }
    newSelectorBuilder.selector.classList.push(value);
    return newSelectorBuilder;
  },

  attr(value) {
    const newSelectorBuilder = { ...this };
    newSelectorBuilder.selector = JSON.parse(JSON.stringify(this.selector));
    if (
      newSelectorBuilder.selector.pseudoClassList.length > 0
      || newSelectorBuilder.selector.pseudoElement
    ) {
      throw newSelectorBuilder.errors.orderSettingElementsError;
    }
    newSelectorBuilder.selector.attrList.push(value);
    return newSelectorBuilder;
  },

  pseudoClass(value) {
    const newSelectorBuilder = { ...this };
    newSelectorBuilder.selector = JSON.parse(JSON.stringify(this.selector));
    if (newSelectorBuilder.selector.pseudoElement) {
      throw newSelectorBuilder.errors.orderSettingElementsError;
    }
    newSelectorBuilder.selector.pseudoClassList.push(value);
    return newSelectorBuilder;
  },

  pseudoElement(value) {
    const newSelectorBuilder = { ...this };
    newSelectorBuilder.selector = JSON.parse(JSON.stringify(this.selector));
    const errorMessage = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    if (newSelectorBuilder.selector.pseudoElement) {
      throw errorMessage;
    }
    newSelectorBuilder.selector.pseudoElement = value;
    return newSelectorBuilder;
  },

  combine(selector1, combinator, selector2) {
    const newSelectorBuilder = { ...this };
    newSelectorBuilder.selector = JSON.parse(JSON.stringify(this.selector));
    newSelectorBuilder.combinedSelectorStr = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;

    return newSelectorBuilder;
  },

  stringify() {
    if (this.combinedSelectorStr) {
      const str = this.combinedSelectorStr;
      this.combinedSelectorStr = '';
      return str;
    }
    const { element, id, pseudoElement } = this.selector;
    let strClasses = '';
    let strAttr = '';
    let strPseudoClasses = '';
    const strID = id ? `#${id}` : '';
    const strPseudoElement = pseudoElement ? `::${pseudoElement}` : '';
    if (this.selector.classList.length > 0) {
      strClasses = `.${this.selector.classList.join('.')}`;
    }
    if (this.selector.attrList.length > 0) {
      strAttr = `[${this.selector.attrList.join('][')}]`;
    }
    if (this.selector.pseudoClassList.length > 0) {
      strPseudoClasses = `:${this.selector.pseudoClassList.join(':')}`;
    }
    return `${element}${strID}${strClasses}${strAttr}${strPseudoClasses}${strPseudoElement}`;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
