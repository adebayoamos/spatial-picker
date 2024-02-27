/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, css, html} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
// import * as L from "leaflet";
import 'leaflet-draw/dist/leaflet.draw-src.js';
//@ts-expect-error
import * as L from 'leaflet/dist/leaflet-src.esm.js';
// import 'leaflet/dist/leaflet.css';

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
      max-width: 600px;
    }

    .leaflet-pane,
    .leaflet-tile,
    .leaflet-marker-icon,
    .leaflet-marker-shadow,
    .leaflet-tile-container,
    .leaflet-pane > svg,
    .leaflet-pane > canvas,
    .leaflet-zoom-box,
    .leaflet-image-layer,
    .leaflet-layer {
      position: absolute;
      left: 0;
      top: 0;
    }
    .leaflet-container {
      overflow: hidden;
    }
    .leaflet-tile,
    .leaflet-marker-icon,
    .leaflet-marker-shadow {
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      -webkit-user-drag: none;
    }
    /* Prevents IE11 from highlighting tiles in blue */
    .leaflet-tile::selection {
      background: transparent;
    }
    /* Safari renders non-retina tile on retina better with this, but Chrome is worse */
    .leaflet-safari .leaflet-tile {
      image-rendering: -webkit-optimize-contrast;
    }
    /* hack that prevents hw layers "stretching" when loading new tiles */
    .leaflet-safari .leaflet-tile-container {
      width: 1600px;
      height: 1600px;
      -webkit-transform-origin: 0 0;
    }
    .leaflet-marker-icon,
    .leaflet-marker-shadow {
      display: block;
    }
    /* .leaflet-container svg: reset svg max-width decleration shipped in Joomla! (joomla.org) 3.x */
    /* .leaflet-container img: map is broken in FF if you have max-width: 100% on tiles */
    .leaflet-container .leaflet-overlay-pane svg {
      max-width: none !important;
      max-height: none !important;
    }
    .leaflet-container .leaflet-marker-pane img,
    .leaflet-container .leaflet-shadow-pane img,
    .leaflet-container .leaflet-tile-pane img,
    .leaflet-container img.leaflet-image-layer,
    .leaflet-container .leaflet-tile {
      max-width: none !important;
      max-height: none !important;
      width: auto;
      padding: 0;
    }

    .leaflet-container img.leaflet-tile {
      /* See: https://bugs.chromium.org/p/chromium/issues/detail?id=600120 */
      mix-blend-mode: plus-lighter;
    }

    .leaflet-container.leaflet-touch-zoom {
      -ms-touch-action: pan-x pan-y;
      touch-action: pan-x pan-y;
    }
    .leaflet-container.leaflet-touch-drag {
      -ms-touch-action: pinch-zoom;
      /* Fallback for FF which doesn't support pinch-zoom */
      touch-action: none;
      touch-action: pinch-zoom;
    }
    .leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {
      -ms-touch-action: none;
      touch-action: none;
    }
    .leaflet-container {
      -webkit-tap-highlight-color: transparent;
    }
    .leaflet-container a {
      -webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);
    }
    .leaflet-tile {
      filter: inherit;
      visibility: hidden;
    }
    .leaflet-tile-loaded {
      visibility: inherit;
    }
    .leaflet-zoom-box {
      width: 0;
      height: 0;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      z-index: 800;
    }
    /* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */
    .leaflet-overlay-pane svg {
      -moz-user-select: none;
    }

    .leaflet-pane {
      z-index: 400;
    }

    .leaflet-tile-pane {
      z-index: 200;
    }
    .leaflet-overlay-pane {
      z-index: 400;
    }
    .leaflet-shadow-pane {
      z-index: 500;
    }
    .leaflet-marker-pane {
      z-index: 600;
    }
    .leaflet-tooltip-pane {
      z-index: 650;
    }
    .leaflet-popup-pane {
      z-index: 700;
    }

    .leaflet-map-pane canvas {
      z-index: 100;
    }
    .leaflet-map-pane svg {
      z-index: 200;
    }

    .leaflet-vml-shape {
      width: 1px;
      height: 1px;
    }
    .lvml {
      behavior: url(#default#VML);
      display: inline-block;
      position: absolute;
    }

    /* control positioning */

    .leaflet-control {
      position: relative;
      z-index: 800;
      pointer-events: visiblePainted; /* IE 9-10 doesn't have auto */
      pointer-events: auto;
    }
    .leaflet-top,
    .leaflet-bottom {
      position: absolute;
      z-index: 1000;
      pointer-events: none;
    }
    .leaflet-top {
      top: 0;
    }
    .leaflet-right {
      right: 0;
    }
    .leaflet-bottom {
      bottom: 0;
    }
    .leaflet-left {
      left: 0;
    }
    .leaflet-control {
      float: left;
      clear: both;
    }
    .leaflet-right .leaflet-control {
      float: right;
    }
    .leaflet-top .leaflet-control {
      margin-top: 10px;
    }
    .leaflet-bottom .leaflet-control {
      margin-bottom: 10px;
    }
    .leaflet-left .leaflet-control {
      margin-left: 10px;
    }
    .leaflet-right .leaflet-control {
      margin-right: 10px;
    }

    /* zoom and fade animations */

    .leaflet-fade-anim .leaflet-popup {
      opacity: 0;
      -webkit-transition: opacity 0.2s linear;
      -moz-transition: opacity 0.2s linear;
      transition: opacity 0.2s linear;
    }
    .leaflet-fade-anim .leaflet-map-pane .leaflet-popup {
      opacity: 1;
    }
    .leaflet-zoom-animated {
      -webkit-transform-origin: 0 0;
      -ms-transform-origin: 0 0;
      transform-origin: 0 0;
    }
    svg.leaflet-zoom-animated {
      will-change: transform;
    }

    .leaflet-zoom-anim .leaflet-zoom-animated {
      -webkit-transition: -webkit-transform 0.25s cubic-bezier(0, 0, 0.25, 1);
      -moz-transition: -moz-transform 0.25s cubic-bezier(0, 0, 0.25, 1);
      transition: transform 0.25s cubic-bezier(0, 0, 0.25, 1);
    }
    .leaflet-zoom-anim .leaflet-tile,
    .leaflet-pan-anim .leaflet-tile {
      -webkit-transition: none;
      -moz-transition: none;
      transition: none;
    }

    .leaflet-zoom-anim .leaflet-zoom-hide {
      visibility: hidden;
    }

    /* cursors */

    .leaflet-interactive {
      cursor: pointer;
    }
    .leaflet-grab {
      cursor: -webkit-grab;
      cursor: -moz-grab;
      cursor: grab;
    }
    .leaflet-crosshair,
    .leaflet-crosshair .leaflet-interactive {
      cursor: crosshair;
    }
    .leaflet-popup-pane,
    .leaflet-control {
      cursor: auto;
    }
    .leaflet-dragging .leaflet-grab,
    .leaflet-dragging .leaflet-grab .leaflet-interactive,
    .leaflet-dragging .leaflet-marker-draggable {
      cursor: move;
      cursor: -webkit-grabbing;
      cursor: -moz-grabbing;
      cursor: grabbing;
    }

    /* marker & overlays interactivity */
    .leaflet-marker-icon,
    .leaflet-marker-shadow,
    .leaflet-image-layer,
    .leaflet-pane > svg path,
    .leaflet-tile-container {
      pointer-events: none;
    }

    .leaflet-marker-icon.leaflet-interactive,
    .leaflet-image-layer.leaflet-interactive,
    .leaflet-pane > svg path.leaflet-interactive,
    svg.leaflet-image-layer.leaflet-interactive path {
      pointer-events: visiblePainted; /* IE 9-10 doesn't have auto */
      pointer-events: auto;
    }

    /* visual tweaks */

    .leaflet-container {
      background: #ddd;
      outline-offset: 1px;
    }
    .leaflet-container a {
      color: #0078a8;
    }
    .leaflet-zoom-box {
      border: 2px dotted #38f;
      background: rgba(255, 255, 255, 0.5);
    }

    /* general typography */
    .leaflet-container {
      font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif;
      font-size: 12px;
      font-size: 0.75rem;
      line-height: 1.5;
    }

    /* general toolbar styles */

    .leaflet-bar {
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
      border-radius: 4px;
    }
    .leaflet-bar a {
      background-color: #fff;
      border-bottom: 1px solid #ccc;
      width: 26px;
      height: 26px;
      line-height: 26px;
      display: block;
      text-align: center;
      text-decoration: none;
      color: black;
    }
    .leaflet-bar a,
    .leaflet-control-layers-toggle {
      background-position: 50% 50%;
      background-repeat: no-repeat;
      display: block;
    }
    .leaflet-bar a:hover,
    .leaflet-bar a:focus {
      background-color: #f4f4f4;
    }
    .leaflet-bar a:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    .leaflet-bar a:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border-bottom: none;
    }
    .leaflet-bar a.leaflet-disabled {
      cursor: default;
      background-color: #f4f4f4;
      color: #bbb;
    }

    .leaflet-touch .leaflet-bar a {
      width: 30px;
      height: 30px;
      line-height: 30px;
    }
    .leaflet-touch .leaflet-bar a:first-child {
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
    }
    .leaflet-touch .leaflet-bar a:last-child {
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
    }

    /* zoom control */

    .leaflet-control-zoom-in,
    .leaflet-control-zoom-out {
      font: bold 18px 'Lucida Console', Monaco, monospace;
      text-indent: 1px;
    }

    .leaflet-touch .leaflet-control-zoom-in,
    .leaflet-touch .leaflet-control-zoom-out {
      font-size: 22px;
    }

    /* layers control */

    .leaflet-control-layers {
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
      background: #fff;
      border-radius: 5px;
    }
    .leaflet-control-layers-toggle {
      background-image: url(images/layers.png);
      width: 36px;
      height: 36px;
    }
    .leaflet-retina .leaflet-control-layers-toggle {
      background-image: url(images/layers-2x.png);
      background-size: 26px 26px;
    }
    .leaflet-touch .leaflet-control-layers-toggle {
      width: 44px;
      height: 44px;
    }
    .leaflet-control-layers .leaflet-control-layers-list,
    .leaflet-control-layers-expanded .leaflet-control-layers-toggle {
      display: none;
    }
    .leaflet-control-layers-expanded .leaflet-control-layers-list {
      display: block;
      position: relative;
    }
    .leaflet-control-layers-expanded {
      padding: 6px 10px 6px 6px;
      color: #333;
      background: #fff;
    }
    .leaflet-control-layers-scrollbar {
      overflow-y: scroll;
      overflow-x: hidden;
      padding-right: 5px;
    }
    .leaflet-control-layers-selector {
      margin-top: 2px;
      position: relative;
      top: 1px;
    }
    .leaflet-control-layers label {
      display: block;
      font-size: 13px;
      font-size: 1.08333em;
    }
    .leaflet-control-layers-separator {
      height: 0;
      border-top: 1px solid #ddd;
      margin: 5px -10px 5px -6px;
    }

    /* Default icon URLs */
    .leaflet-default-icon-path {
      /* used only in path-guessing heuristic, see L.Icon.Default */
      background-image: url(images/marker-icon.png);
    }

    /* attribution and scale controls */

    .leaflet-container .leaflet-control-attribution {
      background: #fff;
      background: rgba(255, 255, 255, 0.8);
      margin: 0;
    }
    .leaflet-control-attribution,
    .leaflet-control-scale-line {
      padding: 0 5px;
      color: #333;
      line-height: 1.4;
    }
    .leaflet-control-attribution a {
      text-decoration: none;
    }
    .leaflet-control-attribution a:hover,
    .leaflet-control-attribution a:focus {
      text-decoration: underline;
    }
    .leaflet-attribution-flag {
      display: inline !important;
      vertical-align: baseline !important;
      width: 1em;
      height: 0.6669em;
    }
    .leaflet-left .leaflet-control-scale {
      margin-left: 5px;
    }
    .leaflet-bottom .leaflet-control-scale {
      margin-bottom: 5px;
    }
    .leaflet-control-scale-line {
      border: 2px solid #777;
      border-top: none;
      line-height: 1.1;
      padding: 2px 5px 1px;
      white-space: nowrap;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.8);
      text-shadow: 1px 1px #fff;
    }
    .leaflet-control-scale-line:not(:first-child) {
      border-top: 2px solid #777;
      border-bottom: none;
      margin-top: -2px;
    }
    .leaflet-control-scale-line:not(:first-child):not(:last-child) {
      border-bottom: 2px solid #777;
    }

    .leaflet-touch .leaflet-control-attribution,
    .leaflet-touch .leaflet-control-layers,
    .leaflet-touch .leaflet-bar {
      box-shadow: none;
    }
    .leaflet-touch .leaflet-control-layers,
    .leaflet-touch .leaflet-bar {
      border: 2px solid rgba(0, 0, 0, 0.2);
      background-clip: padding-box;
    }

    /* popup */

    .leaflet-popup {
      position: absolute;
      text-align: center;
      margin-bottom: 20px;
    }
    .leaflet-popup-content-wrapper {
      padding: 1px;
      text-align: left;
      border-radius: 12px;
    }
    .leaflet-popup-content {
      margin: 13px 24px 13px 20px;
      line-height: 1.3;
      font-size: 13px;
      font-size: 1.08333em;
      min-height: 1px;
    }
    .leaflet-popup-content p {
      margin: 17px 0;
      margin: 1.3em 0;
    }
    .leaflet-popup-tip-container {
      width: 40px;
      height: 20px;
      position: absolute;
      left: 50%;
      margin-top: -1px;
      margin-left: -20px;
      overflow: hidden;
      pointer-events: none;
    }
    .leaflet-popup-tip {
      width: 17px;
      height: 17px;
      padding: 1px;

      margin: -10px auto 0;
      pointer-events: auto;

      -webkit-transform: rotate(45deg);
      -moz-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
    .leaflet-popup-content-wrapper,
    .leaflet-popup-tip {
      background: white;
      color: #333;
      box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
    }
    .leaflet-container a.leaflet-popup-close-button {
      position: absolute;
      top: 0;
      right: 0;
      border: none;
      text-align: center;
      width: 24px;
      height: 24px;
      font: 16px/24px Tahoma, Verdana, sans-serif;
      color: #757575;
      text-decoration: none;
      background: transparent;
    }
    .leaflet-container a.leaflet-popup-close-button:hover,
    .leaflet-container a.leaflet-popup-close-button:focus {
      color: #585858;
    }
    .leaflet-popup-scrolled {
      overflow: auto;
    }

    .leaflet-oldie .leaflet-popup-content-wrapper {
      -ms-zoom: 1;
    }
    .leaflet-oldie .leaflet-popup-tip {
      width: 24px;
      margin: 0 auto;

      -ms-filter: 'progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)';
      filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);
    }

    .leaflet-oldie .leaflet-control-zoom,
    .leaflet-oldie .leaflet-control-layers,
    .leaflet-oldie .leaflet-popup-content-wrapper,
    .leaflet-oldie .leaflet-popup-tip {
      border: 1px solid #999;
    }

    /* div icon */

    .leaflet-div-icon {
      background: #fff;
      border: 1px solid #666;
    }

    /* Tooltip */
    /* Base styles for the element that has a tooltip */
    .leaflet-tooltip {
      position: absolute;
      padding: 6px;
      background-color: #fff;
      border: 1px solid #fff;
      border-radius: 3px;
      color: #222;
      white-space: nowrap;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      pointer-events: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }
    .leaflet-tooltip.leaflet-interactive {
      cursor: pointer;
      pointer-events: auto;
    }
    .leaflet-tooltip-top:before,
    .leaflet-tooltip-bottom:before,
    .leaflet-tooltip-left:before,
    .leaflet-tooltip-right:before {
      position: absolute;
      pointer-events: none;
      border: 6px solid transparent;
      background: transparent;
      content: '';
    }

    /* Directions */

    .leaflet-tooltip-bottom {
      margin-top: 6px;
    }
    .leaflet-tooltip-top {
      margin-top: -6px;
    }
    .leaflet-tooltip-bottom:before,
    .leaflet-tooltip-top:before {
      left: 50%;
      margin-left: -6px;
    }
    .leaflet-tooltip-top:before {
      bottom: 0;
      margin-bottom: -12px;
      border-top-color: #fff;
    }
    .leaflet-tooltip-bottom:before {
      top: 0;
      margin-top: -12px;
      margin-left: -6px;
      border-bottom-color: #fff;
    }
    .leaflet-tooltip-left {
      margin-left: -6px;
    }
    .leaflet-tooltip-right {
      margin-left: 6px;
    }
    .leaflet-tooltip-left:before,
    .leaflet-tooltip-right:before {
      top: 50%;
      margin-top: -6px;
    }
    .leaflet-tooltip-left:before {
      right: 0;
      margin-right: -12px;
      border-left-color: #fff;
    }
    .leaflet-tooltip-right:before {
      left: 0;
      margin-left: -12px;
      border-right-color: #fff;
    }

    /* Printing */

    @media print {
      /* Prevent printers from removing background-images of controls. */
      .leaflet-control {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    #map {
      height: 300px;
    }

    .leaflet-draw-section {
      position: relative;
    }
    .leaflet-draw-toolbar {
      margin-top: 12px;
    }
    .leaflet-draw-toolbar-top {
      margin-top: 0;
    }
    .leaflet-draw-toolbar-notop a:first-child {
      border-top-right-radius: 0;
    }
    .leaflet-draw-toolbar-nobottom a:last-child {
      border-bottom-right-radius: 0;
    }
    .leaflet-draw-toolbar a {
      background-image: url('images/spritesheet.png');
      background-image: linear-gradient(transparent, transparent),
        url('images/spritesheet.svg');
      background-repeat: no-repeat;
      background-size: 300px 30px;
      background-clip: padding-box;
    }
    .leaflet-retina .leaflet-draw-toolbar a {
      background-image: url('images/spritesheet-2x.png');
      background-image: linear-gradient(transparent, transparent),
        url('images/spritesheet.svg');
    }
    .leaflet-draw a {
      display: block;
      text-align: center;
      text-decoration: none;
    }
    .leaflet-draw a .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }
    .leaflet-draw-actions {
      display: none;
      list-style: none;
      margin: 0;
      padding: 0;
      position: absolute;
      left: 26px;
      top: 0;
      white-space: nowrap;
    }
    .leaflet-touch .leaflet-draw-actions {
      left: 32px;
    }
    .leaflet-right .leaflet-draw-actions {
      right: 26px;
      left: auto;
    }
    .leaflet-touch .leaflet-right .leaflet-draw-actions {
      right: 32px;
      left: auto;
    }
    .leaflet-draw-actions li {
      display: inline-block;
    }
    .leaflet-draw-actions li:first-child a {
      border-left: 0;
    }
    .leaflet-draw-actions li:last-child a {
      -webkit-border-radius: 0 4px 4px 0;
      border-radius: 0 4px 4px 0;
    }
    .leaflet-right .leaflet-draw-actions li:last-child a {
      -webkit-border-radius: 0;
      border-radius: 0;
    }
    .leaflet-right .leaflet-draw-actions li:first-child a {
      -webkit-border-radius: 4px 0 0 4px;
      border-radius: 4px 0 0 4px;
    }
    .leaflet-draw-actions a {
      background-color: #919187;
      border-left: 1px solid #aaa;
      color: #fff;
      font: 11px/19px 'Helvetica Neue', Arial, Helvetica, sans-serif;
      line-height: 28px;
      text-decoration: none;
      padding-left: 10px;
      padding-right: 10px;
      height: 28px;
    }
    .leaflet-touch .leaflet-draw-actions a {
      font-size: 12px;
      line-height: 30px;
      height: 30px;
    }
    .leaflet-draw-actions-bottom {
      margin-top: 0;
    }
    .leaflet-draw-actions-top {
      margin-top: 1px;
    }
    .leaflet-draw-actions-top a,
    .leaflet-draw-actions-bottom a {
      height: 27px;
      line-height: 27px;
    }
    .leaflet-draw-actions a:hover {
      background-color: #a0a098;
    }
    .leaflet-draw-actions-top.leaflet-draw-actions-bottom a {
      height: 26px;
      line-height: 26px;
    }
    .leaflet-draw-toolbar .leaflet-draw-draw-polyline {
      background-position: -2px -2px;
    }
    .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-polyline {
      background-position: 0 -1px;
    }
    .leaflet-draw-toolbar .leaflet-draw-draw-polygon {
      background-position: -31px -2px;
    }
    .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-polygon {
      background-position: -29px -1px;
    }
    .leaflet-draw-toolbar .leaflet-draw-draw-rectangle {
      background-position: -62px -2px;
    }
    .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-rectangle {
      background-position: -60px -1px;
    }
    .leaflet-draw-toolbar .leaflet-draw-draw-circle {
      background-position: -92px -2px;
    }
    .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-circle {
      background-position: -90px -1px;
    }
    .leaflet-draw-toolbar .leaflet-draw-draw-marker {
      background-position: -122px -2px;
    }
    .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-marker {
      background-position: -120px -1px;
    }
    .leaflet-draw-toolbar .leaflet-draw-draw-circlemarker {
      background-position: -273px -2px;
    }
    .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-circlemarker {
      background-position: -271px -1px;
    }
    .leaflet-draw-toolbar .leaflet-draw-edit-edit {
      background-position: -152px -2px;
    }
    .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-edit-edit {
      background-position: -150px -1px;
    }
    .leaflet-draw-toolbar .leaflet-draw-edit-remove {
      background-position: -182px -2px;
    }
    .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-edit-remove {
      background-position: -180px -1px;
    }
    .leaflet-draw-toolbar .leaflet-draw-edit-edit.leaflet-disabled {
      background-position: -212px -2px;
    }
    .leaflet-touch
      .leaflet-draw-toolbar
      .leaflet-draw-edit-edit.leaflet-disabled {
      background-position: -210px -1px;
    }
    .leaflet-draw-toolbar .leaflet-draw-edit-remove.leaflet-disabled {
      background-position: -242px -2px;
    }
    .leaflet-touch
      .leaflet-draw-toolbar
      .leaflet-draw-edit-remove.leaflet-disabled {
      background-position: -240px -2px;
    }
    .leaflet-mouse-marker {
      background-color: #fff;
      cursor: crosshair;
    }
    .leaflet-draw-tooltip {
      background: #363636;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid transparent;
      -webkit-border-radius: 4px;
      border-radius: 4px;
      color: #fff;
      font: 12px/18px 'Helvetica Neue', Arial, Helvetica, sans-serif;
      margin-left: 20px;
      margin-top: -21px;
      padding: 4px 8px;
      position: absolute;
      visibility: hidden;
      white-space: nowrap;
      z-index: 6;
    }
    .leaflet-draw-tooltip:before {
      border-right: 6px solid black;
      border-right-color: rgba(0, 0, 0, 0.5);
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      content: '';
      position: absolute;
      top: 7px;
      left: -7px;
    }
    .leaflet-error-draw-tooltip {
      background-color: #f2dede;
      border: 1px solid #e6b6bd;
      color: #b94a48;
    }
    .leaflet-error-draw-tooltip:before {
      border-right-color: #e6b6bd;
    }
    .leaflet-draw-tooltip-single {
      margin-top: -12px;
    }
    .leaflet-draw-tooltip-subtext {
      color: #f8d5e4;
    }
    .leaflet-draw-guide-dash {
      font-size: 1%;
      opacity: 0.6;
      position: absolute;
      width: 5px;
      height: 5px;
    }
    .leaflet-edit-marker-selected {
      background-color: rgba(254, 87, 161, 0.1);
      border: 4px dashed rgba(254, 87, 161, 0.6);
      -webkit-border-radius: 4px;
      border-radius: 4px;
      box-sizing: content-box;
    }
    .leaflet-edit-move {
      cursor: move;
    }
    .leaflet-edit-resize {
      cursor: pointer;
    }
    .leaflet-oldie .leaflet-draw-toolbar {
      border: 1px solid #999;
    }

    /* required styles */
  `;

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = 'World';

  /**
   * The number of times the button has been clicked.
   */
  @property({type: Number})
  count = 0;

  /**
   * The map instance
   */
  @property()
  map: any;

  /**
   * The map element
   */
  @query('#map')
  mapElement!: HTMLDivElement;

  /**
   * The map initialization function
   */
  initializeMap() {
    const initMap = L.map(this.mapElement, {drawControl: true}).setView(
      [51.505, -0.09],
      13
    );
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(initMap);

    // FeatureGroup is to store editable layers
    var drawnItems = new L.FeatureGroup();

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
    });

    initMap.addControl(drawControl);

    this.map = initMap;
  }

  override firstUpdated() {
    console.log(this.mapElement);
    //@ts-ignore
    console.log(L);
    this.initializeMap();
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
        <div class="spatial-picker__input_fields"></div>
        <div class="spatial-picker__map">
          <div class="spatial-picker__map__container">
            <!-- "Map goes here" -->
            <div id="map" class="spatial-picker__map__container__map"></div>
          </div>
        </div>
      </div>
    `;
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
