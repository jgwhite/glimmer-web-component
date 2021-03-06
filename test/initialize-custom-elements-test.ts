import Application from '@glimmer/application';
import initializeCustomElements from '../src/initialize-custom-elements';
import { Option } from "@glimmer/util";

const { module, test } = QUnit;

let containerElement: HTMLDivElement;

module('initializeCustomElements', {
  before() {
    let app = setupApp();
    initializeCustomElements(app as Application, ['hello-world']);
  },

  beforeEach() {
    containerElement = document.createElement('div');
    containerElement.setAttribute('id', 'container');
    document.body.appendChild(containerElement);
  },

  afterEach() {
    containerElement.remove();
    containerElement = null;
  }
});

test('renders glimmer component in place of a custom element', function(assert) {
  assert.expect(3);

  assert.equal(document.getElementsByTagName('aside').length, 0, 'glimmer component not inserted yet');

  appendElements('article', 'hello-world', 'section');

  let helloWorldElements = document.getElementsByTagName('hello-world');
  let glimmerComponentElements = document.getElementsByTagName('aside');

  assert.equal(helloWorldElements.length, 0, 'custom element connected and removed');
  assert.equal(glimmerComponentElements.length, 1, 'glimmer component rendered in place of custom element');
});

test('leaves surrouding content intact', function(assert) {
  assert.expect(2);

  appendElements('article', 'hello-world', 'section');

  let glimmerComponentElement = document.getElementsByTagName('aside').item(0);
  let precedingElement = document.getElementsByTagName('article').item(0);

  assert.equal(glimmerComponentElement.nextElementSibling.tagName, 'SECTION', 'following content is left untouched');
  assert.equal(precedingElement.nextElementSibling.tagName, 'ASIDE', 'preceding content is left untouched');
});

function setupApp(): object {
  return {
    renderComponent(name, parent, placeholder) {
      let glimmerComponentElement = document.createElement('aside');

      parent.insertBefore(glimmerComponentElement, placeholder);
    }
  };
}

function appendElements(...tagNames): void {
  tagNames.forEach(tagName => {
    let tag = document.createElement(tagName);
    containerElement.appendChild(tag);
  });
}
