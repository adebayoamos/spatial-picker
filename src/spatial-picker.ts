/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import * as L from "leaflet";

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('spatial-picker')
export class SpatialPicker extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }

    #map {
      height: 200px;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = 'World';

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0;

  /**
   * The map instance
   */
  @property()
  map: any

  /**
   * The map element
   */
  @query('#map')
  mapElement!: HTMLDivElement

  /**
   * The map initialization function
   */
  initializeMap() {
    // this.map = L.map(this.mapElement).setView([51.505, -0.09], 13)
  }

  override firstUpdated() {
    console.log(this.mapElement)
    //@ts-ignore
    console.log(JSON.stringify(L))
    this.initializeMap()
  }



  override render() {
    // return html`
    //   <h1>${this.sayHello(this.name)}!</h1>
    //   <button @click=${this._onClick} part="button">
    //     Click Count: ${this.count}
    //   </button>
    //   <slot></slot>
    // `;

    return html`
      <div class="spatial-picker">
        <div class="spatial-picker__input_fields">
        </div>
        <div class="spatial-picker__map">
          <div class="spatial-picker__map__container">
            <div id="map" class="spatial-picker__map__container__map">
              "Map goes here"
            </div>
          </div>
        </div>
      </div>
      `
  }

  /**
   * Formats a greeting
   * @param name The name to say "Hello" to
   */
  sayHello(name: string): string {
    return `Hello, ${name}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'spatial-picker': SpatialPicker;
  }
}
