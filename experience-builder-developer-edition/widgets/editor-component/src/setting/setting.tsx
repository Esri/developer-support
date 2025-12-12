import type { AllWidgetSettingProps } from 'jimu-for-builder'
import "@esri/calcite-components";

export default function Setting(props: AllWidgetSettingProps<unknown>) {
  return <div>
    <calcite-text-area placeholder="This is a sample widget that utilizes Map components from the ArcGIS Maps SDK for JavaScript to edit features in a web map." resize="vertical" wrap="hard" rows="5" read-only>
    </calcite-text-area>
  </div>
}