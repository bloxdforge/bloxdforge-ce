/**
 *  Copyright (c) 2026 khrotu. Apache License 2.0.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { ModuleValue } from "@/stores/useRemixStore";
export interface ModuleInput {
  label: string;
  type: 'text' | 'number' | 'color' | 'range';
  cssProp: string;
  key: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  format?: string;
  placeholder?: string;
  defaultValue?: string | number;
  extraCss?: string;
  gradientPart?: 'angle' | 'startColor' | 'endColor';
  shadowPart?: 'h' | 'v' | 'blur' | 'color' | 'alpha';
}
export interface ModuleDefinition {
  name: string;
  description: string;
  selector: string;
  baseCss?: string;
  inputs: ModuleInput[];
  extraSelectors?: string[];
}
export const REMIX_MODULES: Record<string, ModuleDefinition> = {
  adblock: {
    name: "AdBlock",
    description: "Hide ads and banners in the game interface.",
    selector: ".AdBannerContainer, .LoadingOverlayRightAdBannerContainer, .SuperRankAdContainer, [id^='bloxd-io_'], [id^='bloxd-io_'] iframe, [id^='google_ads'], [id^='div-gpt-ad']",
    baseCss: "display: none !important;",
    inputs: []
  },
  crosshair: {
    name: "Custom Crosshair",
    description: "Replace the default crosshair with a custom image.",
    selector: ".Crosshair",
    baseCss: "font-size: 0rem !important; background-repeat: no-repeat !important; background-size: contain !important;",
    inputs: [
      { key: "url", label: "Image URL", type: "text", cssProp: "background-image", format: "url('{val}')" },
      { key: "size", label: "Size (rem)", type: "number", step: 0.1, cssProp: "width", suffix: "rem", extraCss: "height: {val}rem !important;" }
    ]
  },
  chat: {
    name: "Chat Styling",
    description: "Modify chat box transparency and corners.",
    selector: ".Chat",
    baseCss: "border-radius: 1rem !important;",
    inputs: [
      { key: "bg", label: "Background Color", type: "color", cssProp: "background-color", defaultValue: "#00000080" },
      { key: "height", label: "Max Height (rem)", type: "number", step: 0.1, cssProp: "max-height", suffix: "rem" },
      { key: "radius", label: "Border Radius (rem)", type: "number", step: 0.1, cssProp: "border-radius", suffix: "rem" }
    ]
  },
  health: {
    name: "Health Bar",
    description: "Style the main health bar with gradients.",
    selector: ".HealthBar",
    baseCss: "background-color: transparent !important; box-shadow: inset 0 .4rem 0 0 #ffffff10 !important;",
    inputs: [
      { key: "angle", label: "Gradient Angle", type: "range", min: 0, max: 360, cssProp: "background-image", gradientPart: "angle", defaultValue: 180 },
      { key: "start", label: "Start Color", type: "color", cssProp: "background-image", gradientPart: "startColor", defaultValue: "#ff0000" },
      { key: "end", label: "End Color", type: "color", cssProp: "background-image", gradientPart: "endColor", defaultValue: "#8b0000" }
    ]
  },
  inventory: {
    name: "Inventory Theme",
    description: "Customize the backpack and chest UI panels.",
    selector: ".InventoryWrapper .Inventory .InvenBody .InvenBodyRight, .InventoryWrapper .Inventory .InvenBody .InvenLeftSide",
    baseCss: "background-color: #12374d59 !important; border: 1px solid #00ffff82 !important;",
    inputs: [
      { key: "bg", label: "Background Color", type: "color", cssProp: "background-color", defaultValue: "#12374d59" },
      { key: "border", label: "Border Color", type: "color", cssProp: "border-color", defaultValue: "#00ffff82" }
    ]
  },
  hotbar: {
    name: "Hotbar Slots",
    description: "Style the individual item slots in your hotbar.",
    selector: ".HotBarContainer .HotBar .HotBarGameItemsContainer .InvenItem",
    baseCss: "border: 0rem solid transparent !important; image-rendering: pixelated !important;",
    inputs: [
      { key: "url", label: "Custom Frame URL", type: "text", cssProp: "background-image", format: "url('{val}')" },
      { key: "scale", label: "Item Scale", type: "range", min: 0.5, max: 1.5, step: 0.1, cssProp: "transform", format: "scale({val})", defaultValue: 1 }
    ]
  },
  logo: {
    name: "Menu Logo",
    description: "Replace the main menu Bloxd.io logo.",
    selector: ".TitleContainer",
    baseCss: "background-size: contain !important; background-repeat: no-repeat !important;",
    inputs: [
      { key: "url", label: "Logo URL", type: "text", cssProp: "background-image", format: "url('{val}')" }
    ]
  },
  buttons: {
    name: "Button Theme",
    description: "Apply modern styles to all menu buttons.",
    selector: ".NewButton, .BlueButton, .RedButton, .GoldButton",
    baseCss: "border-radius: 0.75rem !important; background-color: transparent !important; overflow: hidden !important;",
    inputs: [
      { key: "border", label: "Border Color", type: "color", cssProp: "border-color", defaultValue: "#24b8c7" },
      { key: "angle", label: "Gradient Angle", type: "range", min: 0, max: 360, cssProp: "background-image", gradientPart: "angle", defaultValue: 174 },
      { key: "start", label: "Start Color", type: "color", cssProp: "background-image", gradientPart: "startColor", defaultValue: "#13b5dd73" },
      { key: "end", label: "End Color", type: "color", cssProp: "background-image", gradientPart: "endColor", defaultValue: "#13347054" }
    ],
    extraSelectors: [
      ".NewButton .ButtonTopBorder, .NewButton .ButtonBottomBorder, .BlueButton .ButtonTopBorder, .BlueButton .ButtonBottomBorder, .RedButton .ButtonTopBorder, .RedButton .ButtonBottomBorder, .GoldButton .ButtonTopBorder, .GoldButton .ButtonBottomBorder",
      ".NewButton .ButtonBody, .BlueButton .ButtonBody, .RedButton .ButtonBody, .GoldButton .ButtonBody"
    ]
  },
  fps: {
    name: "FPS Display",
    description: "Customize the frames-per-second counter.",
    selector: ".FpsWrapperDiv",
    baseCss: "background-color: transparent !important;",
    inputs: [
      { key: "color", label: "Text Color", type: "color", cssProp: "color", defaultValue: "#ffffff" }
    ]
  }
};
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};
export function COMPILE_REMIX_CSS(activeModules: Record<string, ModuleValue>): string {
  let fullCss = "/* Generated by BloxdForge Remix Studio */\n";
  Object.entries(activeModules).forEach(([id, values]) => {
    const config = REMIX_MODULES[id];
    if (!config) return;
    const properties: string[] = [];
    if (config.baseCss) properties.push(config.baseCss);
    const gradients: Record<string, { angle?: number, start?: string, end?: string }> = {};
    const shadows: Record<string, { h?: number, v?: number, blur?: number, color?: string, alpha?: number }> = {};
    config.inputs.forEach((input) => {
      const val = values[input.key] ?? input.defaultValue;
      if (val === undefined || val === '') return;
      if (input.gradientPart) {
        gradients[input.cssProp] = gradients[input.cssProp] || {};
        if (input.gradientPart === 'angle') gradients[input.cssProp].angle = Number(val);
        if (input.gradientPart === 'startColor') gradients[input.cssProp].start = String(val);
        if (input.gradientPart === 'endColor') gradients[input.cssProp].end = String(val);
      } else if (input.shadowPart) {
        shadows[input.cssProp] = shadows[input.cssProp] || {};
        const s = shadows[input.cssProp];
        if (input.shadowPart === 'h') s.h = Number(val);
        if (input.shadowPart === 'v') s.v = Number(val);
        if (input.shadowPart === 'blur') s.blur = Number(val);
        if (input.shadowPart === 'color') s.color = String(val);
        if (input.shadowPart === 'alpha') s.alpha = Number(val);
      } else {
        let finalValue = String(val);
        if (input.format) finalValue = input.format.replace('{val}', String(val));
        else if (input.suffix) finalValue = val + input.suffix;
        if (input.extraCss) properties.push(input.extraCss.replace('{val}', String(val)));
        properties.push(`${input.cssProp}: ${finalValue} !important;`);
      }
    });
    Object.entries(gradients).forEach(([prop, g]) => {
      properties.push(`${prop}: linear-gradient(${g.angle || 0}deg, ${g.start || '#fff'}, ${g.end || '#000'}) !important;`);
    (config.extraSelectors || []).forEach(sel => {
      fullCss += `\n${sel} {\n    ${properties.join('\n    ')}\n}\n`;
    });
    });
    Object.entries(shadows).forEach(([prop, s]) => {
      const rgb = hexToRgb(s.color || '#000');
      properties.push(`${prop}: ${s.h || 0}px ${s.v || 0}px ${s.blur || 0}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${s.alpha ?? 1}) !important;`);
    });
    fullCss += `\n${config.selector} {\n    ${properties.join('\n    ')}\n}\n`;
  });
  return fullCss;
}