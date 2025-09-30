import { Component, AfterViewInit } from '@angular/core';
import SwaggerUI from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';

@Component({
  selector: 'app-swagger',
  templateUrl: './swagger.component.html',
  styleUrls: ['./swagger.component.css'] // fixed typo
})
export class SwaggerComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    SwaggerUI({
      dom_id: '#swaggerContainer',
      url: 'assets/swagger.json', // your swagger json file path
      presets: [
        SwaggerUI.presets.apis,
      ],
      layout: "BaseLayout",
    });
  }
}
