import React, {Component} from 'react';
import callfunc from 'call-func';
import get from 'get-object-value';

import GrapesJsEdm from './GrapesJsEdm';
import GrapesJsMjml from './GrapesJsMjml';

let grapesId = 0;

class GrapesJsController extends Component {
  static defaultProps = {
    i18nMergeTags: 'Merge Tags'
  };

  getType() {
    const {type} = this.props;
    return type === 'html' ? 'html' : 'mjml';
  }

  getPanel() {
    return get(this.editor, ['Panels']);
  }

  getHtml() {
    return this.el && this.el.getHtml && this.el.getHtml();
  }

  getDesign() {
    return this.el && this.el.getDesign && this.el.getDesign();
  }

  disableImport() {
    const type = this.getType();
    if ('html' === type) {
      return;
    }
    const panelManager = this.getPanel();
    const btnName = this.el.getImportButtonName();
    return panelManager.removeButton('options', btnName);
  }

  disableExport() {
    const type = this.getType();
    if ('html' === type) {
      return;
    }
    const panelManager = this.getPanel();
    return panelManager.removeButton('options', 'export-template');
  }

  handleMergeTags(mergeTags, CKEDITOR, extraPlugins, toolbar) {
    const {i18nMergeTags} = this.props;
    let isRun = 0;
    const buildList = function() {
      // !!important!! should not use arrow function
      this.startGroup(i18nMergeTags);
      const tags = callfunc(mergeTags);
      if (tags && tags.forEach) {
        // https://docs-old.ckeditor.com/ckeditor_api/symbols/src/plugins_richcombo_plugin.js.html
        // add : function( value, html, text )
        tags.forEach(m => this.add(m[0], m[1], m[2]));
      }
      if (isRun) {
        this._.committed = 0;
        this.commit();
      }
    };
    CKEDITOR.plugins.add('strinsert', {
      requires: ['richcombo'],
      init: editor => {
        editor.ui.addRichCombo('strinsert', {
          label: i18nMergeTags,
          title: i18nMergeTags,
          voiceLabel: i18nMergeTags,
          className: 'cke_format',
          multiSelect: false,
          panel: {
            css: [editor.config.contentsCss, CKEDITOR.skin.getPath('editor')],
            voiceLabel: editor.lang.panelVoiceLabel,
          },

          init: function() {
            isRun = 1;
            editor.on('panelHide', () => {
              this._.list.element.$.innerHTML = '';
              this._.list._.items = {};
            });
            buildList.call(this);
          },

          onOpen: function() {
            buildList.call(this);
          },

          onClick: value => {
            editor.focus();
            editor.fire('saveSnapshot');
            editor.insertHtml(value);
            editor.fire('saveSnapshot');
          },
        });
      },
    });
    extraPlugins += ',strinsert';
    toolbar.push({name: i18nMergeTags, items: ['strinsert']});
    return extraPlugins;
  }

  handleEditorInit = e => {
    const {onEditorInit} = this.props;
    this.editor = e.editor;
    callfunc(onEditorInit, [e]);
  };

  handleEl = el => (this.el = el);

  componentDidMount() {
    const {id, debug} = this.props;
    if (id) {
      this.id = id;
    } else {
      if (!this.id) {
        this.id = 'grapejs-' + grapesId;
        grapesId++;
      }
    }
    if (debug) {
      console.log(`$("#${this.id}").contentWindow.window.debug`);
    }
  }

  render() {
    const {debug, type, ...otherProps} = this.props;
    otherProps.id = this.id;
    otherProps.onEditorInit = this.handleEditorInit;
    otherProps.host = this;
    return this.getType() === 'html' ? (
      <GrapesJsEdm ref={this.handleEl} {...otherProps} />
    ) : (
      <GrapesJsMjml ref={this.handleEl} {...otherProps} />
    );
  }
}

export default GrapesJsController;
