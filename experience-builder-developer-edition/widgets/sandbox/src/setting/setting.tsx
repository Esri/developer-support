import type { AllWidgetSettingProps } from 'jimu-for-builder'
import "@esri/calcite-components";

export default function Setting(props: AllWidgetSettingProps<unknown>) {
  return <div>
    <calcite-text-area placeholder="This is a sandbox widget that renders HTML code in an Iframe." resize="vertical" wrap="hard" rows="3" read-only></calcite-text-area>
  </div>
}