import styles from '../css/layout.scss';

class WxSelect extends HTMLElement {

  constructor() 
  {
    super();

    this.rows = this.attributes.rows ? this.attributes.rows.value : 5;

    this._options = [];

    this.querySelectorAll('option').forEach(t => {
      this._options.push(t);
    });

    // Add a shadow DOM
    const shadowDOM = this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');

    template.innerHTML = `
<style>${styles.toString()}</style>
<div class="wx-select">
  <div class="wx-select__panel">
    <select rows="${this.rows}" multiple class="wx-select__unset">
    ${this._options.filter(t => !t.selected).map(t => { return `<option value="${t.value}">${t.innerText}</option>`; }).join('')}
    </select>
  </div>
  <div class="wx-select__actions">
    <button type="add">&gt;&gt;</button>
    <button type="remove">&lt;&lt;</button>
  </div>
  <div class="wx-select__panel">
    <select rows="${this.rows}" multiple class="wx-select__set">
    ${this._options.filter(t => t.selected).map(t => { return `<option value="${t.value}">${t.innerText}</option>`; }).join('')}
    </select>
  </div>
</div>`;

    // Render the template
    shadowDOM.appendChild(template.content.cloneNode(true));

    this._unset   = shadowDOM.querySelector('select.wx-select__unset');
    this._set     = shadowDOM.querySelector('select.wx-select__set');

    this._element = this.createExternalElement();
  }

  connectedCallback() 
  {
    // add::click
    const add = this.shadowRoot.querySelector('button[type="add"]');
    add.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      this._unset.querySelectorAll(':checked').forEach(t => {
        this._set.appendChild(t);
      });

      this.selectionChanged.call(this);

      this.dispatchEvent(new CustomEvent(
        'change',
      ));
    });

    // remove::click
    const remove = this.shadowRoot.querySelector('button[type="remove"]');
    remove.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      this._set.querySelectorAll(':checked').forEach(t => {
        this._unset.appendChild(t);
      });

      this.selectionChanged.call(this);

      this.dispatchEvent(new CustomEvent(
        'change',
      ));
    });

    this.selectionChanged.call(this);
  }

  selectionChanged()
  {
    this._element.innerHTML = '';

    this._set.querySelectorAll('option').forEach(t => {

      const e = t.cloneNode(true);
      e.selected = true;
      this._element.appendChild( e );

    });
  }

  createExternalElement()
  {
    const form      = this.closest("form") || this.parentNode;

    const empty = document.createElement('template');
    empty.innerHTML = `<input style="display: none;" type="hidden" name="${this.attributes.name ? this.attributes.name.value : 'select'}" value="">`;
    form.appendChild( empty.content.cloneNode(true) );

    const template  = document.createElement('template');
    template.innerHTML = `<select style="display: none;" multiple name="${this.attributes.name ? this.attributes.name.value : 'select'}[]"></select>`;
    form.appendChild( template.content.cloneNode(true) );

    return form.childNodes[ form.childNodes.length - 1 ];
  }
}

export default WxSelect;
