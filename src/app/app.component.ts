import { AfterViewInit, Component } from '@angular/core';

declare function initScript(): void;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'earth-test';
  currentView = '3d'; // 3d || plan


  countryData: {
    name: string;
    ISOCode: string;
    lat: string;
    lon: string;
  };

  ngAfterViewInit(): void {
    this.getCountryName();
    initScript();

    document.addEventListener("country-select", (e: any) => {
      this.countryData = JSON.parse(e.detail);
      console.log('detail2: ' + this.countryData.name);
      console.log('detail2: ' + this.countryData.ISOCode);
    });
  }

  changeView(): void {
    this.currentView = this.currentView === '3d' ? 'plan' : '3d';
    console.log(this.currentView);
  }

  getCountryName() {
    const countryName = document.getElementById('countryName');
    console.log('country name', countryName);
    // countryName?.addEventListener('onchange', function (event) {
    //   console.log(event);
    // })

    var observables = document.querySelector('.observable');

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        console.log(mutation);
      });
    });

    var config = { characterData: true, subtree: true };
    if (observables) {
      observer.observe(observables, config);
    }
  }

}
