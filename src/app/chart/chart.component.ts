import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() countryData: any;
  data: any[] = []

  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>; // this is line definition

  constructor() {
    // configure margins and width/height of the graph

    this.width = 440 - this.margin.left - this.margin.right;
    this.height = 240 - this.margin.top - this.margin.bottom;
  }

  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.countryData) {
      console.log('data', this.countryData)
      this.data = [
        {
          "value": 20,
          "date": new Date("2020-05-12T12:19:00+00:00")
        },

        {
          "value": 20,
          "date": new Date("2020-05-12T12:19:00+00:00")
        },
        {
          "value": 50,
          "date": new Date("2020-05-14T12:19:00+00:00")
        },
        {
          "value": 30,
          "date": new Date("2020-05-16T12:19:00+00:00")
        },
        {
          "value": 80,
          "date": new Date("2020-05-18T12:19:00+00:00")
        },
        {
          "value": 55,
          "date": new Date("2020-05-20T12:19:00+00:00")
        },
        {
          "value": 60,
          "date": new Date("2020-05-22T12:19:00+00:00")
        },
        {
          "value": 45,
          "date": new Date("2020-05-24T12:19:00+00:00")
        },
        {
          "value": 30,
          "date": new Date("2020-05-26T12:19:00+00:00")
        },
        {
          "value": 40,
          "date": new Date("2020-05-28T12:19:00+00:00")
        },
        {
          "value": 70,
          "date": new Date("2020-05-30T12:19:00+00:00")
        },
        {
          "value": 63,
          "date": new Date("2020-06-01T12:19:00+00:00")
        },
        {
          "value": 40,
          "date": new Date("2020-06-03T12:19:00+00:00")
        },
        {
          "value": 50,
          "date": new Date("2020-06-05T12:19:00+00:00")
        },
        {
          "value": 75,
          "date": new Date("2020-06-07T12:19:00+00:00")
        },
        {
          "value": 20,
          "date": new Date("2020-06-09T12:19:00+00:00")
        },
        {
          "value": 50,
          "date": new Date("2020-06-11T12:19:00+00:00")
        },
        {
          "value": 80,
          "date": new Date("2020-06-13T12:19:00+00:00")
        },
        {
          "value": 75,
          "date": new Date("2020-06-15T12:19:00+00:00")
        },
        {
          "value": 82,
          "date": new Date("2020-06-17T12:19:00+00:00")
        },
        {
          "value": 55,
          "date": new Date("2020-06-19T12:19:00+00:00")
        },
        {
          "value": 35,
          "date": new Date("2020-06-21T12:19:00+00:00")
        },
        {
          "value": 34,
          "date": new Date("2020-06-23T12:19:00+00:00")
        },
        {
          "value": 45,
          "date": new Date("2020-06-25T12:19:00+00:00")
        },
        {
          "value": 58,
          "date": new Date("2020-06-27T12:19:00+00:00")
        },
        {
          "value": 34,
          "date": new Date("2020-06-29T12:19:00+00:00")
        },
        {
          "value": 60,
          "date": new Date("2020-07-01T12:19:00+00:00")
        },
        {
          "value": 75,
          "date": new Date("2020-07-03T12:19:00+00:00")
        },
        {
          "value": 80,
          "date": new Date("2020-07-05T12:19:00+00:00")
        },
        {
          "value": 29,
          "date": new Date("2020-07-07T12:19:00+00:00")
        },
        {
          "value": 40,
          "date": new Date("2020-07-09T12:19:00+00:00")
        },
        {
          "value": 54,
          "date": new Date("2020-07-11T12:19:00+00:00")
        },
        {
          "value": 67,
          "date": new Date("2020-07-13T12:19:00+00:00")
        },
        {
          "value": 90,
          "date": new Date("2020-07-15T12:19:00+00:00")
        },
        {
          "value": 84,
          "date": new Date("2020-07-17T12:19:00+00:00")
        },
        {
          "value": 43,
          "date": new Date("2020-07-19T12:19:00+00:00")
        }

      ];
        this.buildSvg();
        this.addXandYAxis();
        this.drawLineAndPath();
    }
  }

  ngOnInit() {
  }

  private buildSvg() {
    this.svg = d3.select('svg')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }
  private addXandYAxis() {
    // range of data configuring
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(this.data, (d) => d.date));
    this.y.domain(d3Array.extent(this.data, (d) => d.value));

    // Configure the Y Axis
    this.svg.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));
    // Configure the Y Axis
    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y));
  }

  private drawLineAndPath() {
    this.line = d3Shape.line()
      .x((d: any) => this.x(d.date))
      .y((d: any) => this.y(d.value))
    // Configuring line path
    this.svg.append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('d', this.line)
      .style('stroke', 'yellow')
      .style('fill', 'yellow')
      .style('stroke-width', '2px')
      .append('path')
      ;
    ;
  }

}
