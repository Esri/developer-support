import { type AllWidgetProps } from 'jimu-core'
import type { IMConfig } from '../config'
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-editor";

const Widget = (props: AllWidgetProps<IMConfig>) => {
  return (
    <arcgis-map item-id="4793230052ed498ebf1c7bed9966bd35">
      <arcgis-editor slot="top-right"></arcgis-editor>
    </arcgis-map>
  )
}

export default Widget
