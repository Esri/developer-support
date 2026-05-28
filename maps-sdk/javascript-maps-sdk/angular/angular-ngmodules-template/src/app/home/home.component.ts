import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-zoom';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent {

  arcgisViewReadyChange(event: CustomEvent) {
    console.log('Map view ready:', event);

    // Access the map/view here if needed
    // const view = event.target.view;
  }

}