import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() countryData!: any;
  tableData: { threats: string, efficacy: string }[] = []
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.countryData) {
      // call api and bind data
      this.tableData = [
        {
          threats: 'THREATS 1',
          efficacy: 'EFFICACY 1'
        },
        {
          threats: 'THREATS 2',
          efficacy: 'EFFICACY 2'
        },
        {
          threats: 'THREATS 3',
          efficacy: 'EFFICACY 3'
        },
        {
          threats: 'THREATS 4',
          efficacy: 'EFFICACY 4'
        },
        {
          threats: 'THREATS 5',
          efficacy: 'EFFICACY 5'
        },
      ];
    }
  }

  ngOnInit(): void {

  }

}
