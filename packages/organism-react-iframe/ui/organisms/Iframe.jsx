import 'setimmediate';
import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import get from 'get-object-value';
import getOffset from 'getoffset';
import smoothScrollTo from 'smooth-scroll-to';
import exec from 'exec-script';
import {SemanticUI, Unsafe} from 'react-atomic-molecule';
import {js} from 'create-el';
import {queryFrom} from 'css-query-selector';
import callfunc from 'call-func';

import IframeContainer from '../organisms/IframeContainer';

const keys = Object.keys;

class Iframe extends PureComponent {
  static defaultProps = {
    keepTargetInIframe: false,
    initialContent: '',
  };

  html = null;

  appendHtml = html => {
    let div = document.createElement('div');
    div.innerHTML = html;
    const root = get(this.root, ['childNodes', 0, 'childNodes', 0], this.root);
    root.appendChild(div);
    this.handleScript(div);
  };

  postHeight = win => this.iframe.postHeight(this.getWindow());

  getBody = () => get(this.getDoc(), ['body']);

  getDoc = () => get(this.getWindow(), ['document']);

  getWindow = () => get(this.el, ['contentWindow', 'window']);

  handleClickLink() {
    const {keepTargetInIframe} = this.props;
    const body = this.getBody();
    if (!body) {
      return;
    }
    const query = queryFrom(() => body);
    body.addEventListener('click', e => {
      const evTarget = e.target;
      const link =
        evTarget.nodeName === 'A' ? evTarget : query.ancestor(evTarget, 'a');
      if (!link) {
        return;
      }
      if (link.target && '_blank' === link.target.toLowerCase()) {
        return;
      }
      if (link.hash) {
        e.preventDefault();
        const tarDom = query.one(link.hash);
        if (tarDom) {
          smoothScrollTo(getOffset(tarDom).top);
          return;
        }
      }
      if (keepTargetInIframe) {
        return;
      } else {
        e.preventDefault();
        if (link.href) {
          location.href = link.href;
        }
      }
    });
  }

  handleScript = el => {
    const win = this.getWindow();
    if (win) {
      exec(el, win, this.root.parentNode);
    }
  };

  renderIframe(props, root) {
    const {children} = props;

    // setTimeout for https://gist.github.com/HillLiu/013d94ce76cfb7e8c46dd935164e4d72
    setImmediate(() => {
      this.html = root.innerHTML;
      ReactDOM.render(
        <SemanticUI>
          <Unsafe atom="style">{() => 'body {padding:0; margin:0;}'}</Unsafe>
          {children}
        </SemanticUI>,
        root,
        () => {
          const html = root.innerHTML;
          if (html !== this.html) {
            this.handleScript(root);
            this.handleClickLink();
          }
        },
      );
    });
  }

  componentDidMount() {
    this.root = document.createElement('div');
    const doc = this.getDoc();
    if (doc) {
      // fixed firfox innerHTML suddenly disappear.
      doc.open('text/html', 'replace');
      doc.write(this.props.initialContent);
      doc.close();

      const body = this.getBody();
      body.appendChild(this.root);
    }
    this.renderIframe(this.props, this.root);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.renderIframe(this.props, this.root);
  }

  componentWillUnmount() {
    // https://facebook.github.io/react/docs/react-dom.html#unmountcomponentatnode
    ReactDOM.unmountComponentAtNode(this.root);
  }

  render() {
    const {
      initialContent,
      children,
      keepTargetInIframe,
      refCb,
      ...others
    } = this.props;
    return (
      <IframeContainer
        {...others}
        ref={el => (this.iframe = el)}
        refCb={el => {
          if (el) {
            this.el = el;
            callfunc(refCb, [el]);
          }
        }}
      />
    );
  }
}

export default Iframe;
