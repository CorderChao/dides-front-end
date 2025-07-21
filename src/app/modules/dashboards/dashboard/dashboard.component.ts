import { Component, OnInit, ViewChild } from "@angular/core";
import { tileLayer, latLng, circle } from "leaflet";
import {
  ActiveProjects,
  MyTask,
  Recommendedjob,
  TeamMembers,
  jobcandidate,
  projectstatData,
} from "src/app/core/data";
import { PaginationService } from "src/app/core/services/pagination.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})

/**
 * Ecommerce Component
 */
export class DashboardComponent implements OnInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  statData!: any;
  OverviewChart: any;
  ActiveProjects: any;
  applyjobChart: any;
  MyTask: any;
  TeamMembers: any;
  basicRadialbarChart: any;
  interviewChart: any;

  hiredChart: any;
  rejectedChart: any;
  newjobChart: any;

  status7: any;
  @ViewChild("scrollRef") scrollRef: any;
  Recommendedjobs: any;
  allRecommendedjobs: any;
  candidatelist: any;
  candidatedetail: any;

  searchResults: any;
  searchTerm: any;
  dashedLineChart: any;
  followbtn!: string;
  followtxt!: string;

  constructor(public service: PaginationService) {}

  ngOnInit(): void {
    this._basicRadialbarChart('["--vz-success"]');

    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: "Dashboards" },
      { label: "Dashboard", active: true },
    ];

    /**
     * Fetches the data
     */
    this.fetchData();

    // Chart Color Data Get Function
    this._OverviewChart('["--vz-primary", "--vz-warning", "--vz-success"]');
    this._status7(
      '["--vz-success", "--vz-primary", "--vz-warning", "--vz-danger"]'
    );

    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: "Dashboards" },
      { label: "JOB Dashboard", active: true },
    ];

    // Chart Color Data Get Function
    this._basicRadialbarChart('["--vz-success"]');
    this._ApplyjobChart('["--vz-success"]');
    this._NewjobChart('["--vz-success"]');
    this._InterviewChart('["--vz-danger"]');
    this._HiredChart('["--vz-success"]');
    this._RejectedChart('["--vz-danger"]');
    this._dashedLineChart('["--vz-success", "--vz-info", "--vz-primary"]');

    // Fetch Data
    setTimeout(() => {
      this.Recommendedjobs = Recommendedjob;
      this.allRecommendedjobs = Recommendedjob;
      this.candidatelist = jobcandidate;
      this.candidatedetail = jobcandidate[0];
      this.Recommendedjobs = this.service.changePage(Recommendedjob);
      document.getElementById("elmLoader")?.classList.add("d-none");
    }, 1200);
  }


  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    decimalPlaces: 2,
  };
  // Chart Colors Set
  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(
          newValue
        );
        if (color) {
          color = color.replace(" ", "");
          return color;
        } else return newValue;
      } else {
        var val = value.split(",");
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }

  /**
   * Projects Overview
   */

  setprojectvalue(value: any) {
    if (value == "all") {
      this.OverviewChart.series = [
        {
          name: "Banked Revenue",
          type: "bar",
          data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
        },
        {
          name: "Un-banked Bills",
          type: "area",
          data: [
            89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57,
            42.36, 88.51, 36.57,
          ],
        },
        // {
        //   name: "Active Projects",
        //   type: "bar",
        //   data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
        // },
      ];
    }
    if (value == "1M") {
      this.OverviewChart.series = [
        {
          name: "Number of Projects",
          type: "bar",
          data: [24, 75, 16, 98, 19, 41, 52, 34, 28, 52, 63, 67],
        },
        {
          name: "Revenue",
          type: "area",
          data: [
            99.25, 28.58, 98.74, 12.87, 107.54, 94.03, 11.24, 48.57, 22.57,
            42.36, 88.51, 36.57,
          ],
        },
        {
          name: "Active Projects",
          type: "bar",
          data: [28, 22, 17, 27, 21, 11, 5, 9, 17, 29, 12, 15],
        },
      ];
    }
    if (value == "6M") {
      this.OverviewChart.series = [
        {
          name: "Number of Projects",
          type: "bar",
          data: [34, 75, 66, 78, 29, 41, 32, 44, 58, 52, 43, 77],
        },
        {
          name: "Revenue",
          type: "area",
          data: [
            109.25, 48.58, 38.74, 57.87, 77.54, 84.03, 31.24, 18.57, 92.57,
            42.36, 48.51, 56.57,
          ],
        },
        {
          name: "Active Projects",
          type: "bar",
          data: [12, 22, 17, 27, 1, 51, 5, 9, 7, 29, 12, 35],
        },
      ];
    }
    if (value == "1Y") {
      this.OverviewChart.series = [
        {
          name: "Number of Projects",
          type: "bar",
          data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
        },
        {
          name: "Revenue",
          type: "area",
          data: [
            89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57,
            42.36, 88.51, 36.57,
          ],
        },
        {
          name: "Active Projects",
          type: "bar",
          data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
        },
      ];
    }
  }

  private _OverviewChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.OverviewChart = {
      series: [
        {
          name: "Banked Revenue",
          type: "bar",
          data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
        },
        {
          name: "Revenue Projected",
          type: "area",
          data: [
            89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57,
            42.36, 88.51, 36.57,
          ],
        },
        {
          name: "Un Banked Bills",
          type: "bar",
          data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
        },
      ],
      chart: {
        height: 374,
        type: "line",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "smooth",
        dashArray: [0, 3, 0],
        width: [0, 1, 0],
      },
      fill: {
        opacity: [1, 0.1, 1],
      },
      markers: {
        size: [0, 4, 0],
        strokeWidth: 2,
        hover: {
          size: 4,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 0,
          right: -2,
          bottom: 15,
          left: 10,
        },
      },
      legend: {
        show: true,
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: -5,
        markers: {
          width: 9,
          height: 9,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "30%",
          barHeight: "70%",
        },
      },
      colors: colors,
      tooltip: {
        shared: true,
        y: [
          {
            formatter: function (y: any) {
              if (typeof y !== "undefined") {
                return y.toFixed(0);
              }
              return y;
            },
          },
          {
            formatter: function (y: any) {
              if (typeof y !== "undefined") {
                return "$" + y.toFixed(2) + "k";
              }
              return y;
            },
          },
          {
            formatter: function (y: any) {
              if (typeof y !== "undefined") {
                return y.toFixed(0);
              }
              return y;
            },
          },
        ],
      },
    };
  }

  /**
   *  Status7
   */
  setstatusvalue(value: any) {
    if (value == "all") {
      this.status7.series = [125, 42, 58, 89];
    }
    if (value == "7") {
      this.status7.series = [25, 52, 158, 99];
    }
    if (value == "30") {
      this.status7.series = [35, 22, 98, 99];
    }
    if (value == "90") {
      this.status7.series = [105, 32, 68, 79];
    }
  }

  private _status7(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.status7 = {
      series: [125, 42, 58, 89],
      labels: ["Completed", "In Progress", "Yet to Start", "Cancelled"],
      chart: {
        type: "donut",
        height: 230,
      },
      plotOptions: {
        pie: {
          offsetX: 0,
          offsetY: 0,
          donut: {
            size: "90%",
            labels: {
              show: false,
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      stroke: {
        lineCap: "round",
        width: 0,
      },
      colors: colors,
    };
  }

  /**
   * Fetches the data
   */
  private fetchData() {
    this.statData = projectstatData;
    this.ActiveProjects = ActiveProjects;
    this.MyTask = MyTask;
    this.TeamMembers = TeamMembers;
  }
  /**
   * TOTAL JOBS Chart
   */
  private _basicRadialbarChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.basicRadialbarChart = {
      series: [95],
      chart: {
        type: "radialBar",
        width: 105,
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
          },
          track: {
            margin: 1,
          },
          dataLabels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              offsetY: 8,
            },
          },
        },
      },
      colors: colors,
    };
  }
  //  apply jobs Charts
  private _ApplyjobChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.applyjobChart = {
      series: [97],
      chart: {
        type: "radialBar",
        width: 105,
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
          },
          track: {
            margin: 1,
          },
          dataLabels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              offsetY: 8,
            },
          },
        },
      },
      colors: colors,
    };
  }
  //  new jobs Charts
  private _NewjobChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.newjobChart = {
      series: [80],
      chart: {
        type: "radialBar",
        width: 105,
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
          },
          track: {
            margin: 1,
          },
          dataLabels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              offsetY: 8,
            },
          },
        },
      },
      colors: colors,
    };
  }

  //  interview_chart
  private _InterviewChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.interviewChart = {
      series: [89],
      chart: {
        type: "radialBar",
        width: 105,
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
          },
          track: {
            margin: 1,
          },
          dataLabels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              offsetY: 8,
            },
          },
        },
      },
      colors: colors,
    };
  }

  //  Hired Chart
  private _HiredChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.hiredChart = {
      series: [64],
      chart: {
        type: "radialBar",
        width: 105,
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
          },
          track: {
            margin: 1,
          },
          dataLabels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              offsetY: 8,
            },
          },
        },
      },
      colors: colors,
    };
  }

  //  Rejected Chart
  private _RejectedChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.rejectedChart = {
      series: [20],
      chart: {
        type: "radialBar",
        width: 105,
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
          },
          track: {
            margin: 1,
          },
          dataLabels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              offsetY: 8,
            },
          },
        },
      },
      colors: colors,
    };
  }

  // PAgination
  changePage() {
    this.Recommendedjobs = this.service.changePage(Recommendedjob);
  }

  // Search Data
  performSearch(): void {
    this.searchResults = Recommendedjob.filter((item: any) => {
      return (
        item.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.c_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.position.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.salary.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.experience.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.job_type.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
    this.Recommendedjobs = this.service.changePage(this.searchResults);
  }

  //  Dashed line chart

  setapplicationvalue(value: any) {
    if (value == "All") {
      this.dashedLineChart.series = [
        {
          name: "New Application",
          data: [89, 56, 74, 98, 72, 38, 64, 46, 84, 58, 46, 49],
        },
        {
          name: "Interview",
          data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
        },
        {
          name: " Hired",
          data: [36, 42, 60, 42, 13, 18, 29, 37, 36, 51, 32, 35],
        },
      ];
    }
    if (value == "1M") {
      this.dashedLineChart.series = [
        {
          name: "New Application",
          data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
        },
        {
          name: "Interview",
          data: [36, 42, 60, 42, 13, 18, 29, 37, 36, 51, 32, 35],
        },
        {
          name: " Hired",
          data: [89, 56, 74, 98, 72, 38, 64, 46, 84, 58, 46, 49],
        },
      ];
    }
    if (value == "6M") {
      this.dashedLineChart.series = [
        {
          name: "New Application",
          data: [36, 42, 60, 42, 13, 18, 29, 37, 36, 51, 32, 35],
        },
        {
          name: "Interview",
          data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
        },
        {
          name: " Hired",
          data: [89, 56, 74, 98, 72, 38, 64, 46, 84, 58, 46, 49],
        },
      ];
    }
    if (value == "1Y") {
      this.dashedLineChart.series = [
        {
          name: "New Application",
          data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
        },
        {
          name: "Interview",
          data: [36, 42, 60, 42, 13, 18, 29, 37, 36, 51, 32, 35],
        },
        {
          name: " Hired",
          data: [89, 56, 74, 98, 72, 38, 64, 46, 84, 58, 46, 49],
        },
      ];
    }
  }

  private _dashedLineChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.dashedLineChart = {
      chart: {
        height: 345,
        type: "line",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: colors,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [3, 4, 3],
        curve: "straight",
        dashArray: [0, 8, 5],
      },
      series: [
        {
          name: "New Application",
          data: [89, 56, 74, 98, 72, 38, 64, 46, 84, 58, 46, 49],
        },
        {
          name: "Interview",
          data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
        },
        {
          name: " Hired",
          data: [36, 42, 60, 42, 13, 18, 29, 37, 36, 51, 32, 35],
        },
      ],
      markers: {
        size: 0,

        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        categories: [
          "01 Jan",
          "02 Jan",
          "03 Jan",
          "04 Jan",
          "05 Jan",
          "06 Jan",
          "07 Jan",
          "08 Jan",
          "09 Jan",
          "10 Jan",
          "11 Jan",
          "12 Jan",
        ],
      },
      grid: {
        borderColor: "#f1f1f1",
      },
    };
  }

  /**
   * Sale Location Map
   */
  options = {
    layers: [
      tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlbWVzYnJhbmQiLCJhIjoiY2xmbmc3bTV4MGw1ejNzbnJqOWpubzhnciJ9.DNkdZVKLnQ6I9NOz7EED-w",
        {
          id: "mapbox/light-v9",
          tileSize: 512,
          zoomOffset: 0,
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        }
      ),
    ],
    zoom: 1.1,
    center: latLng(28, 1.5),
  };
  layers = [
    circle([41.9, 12.45], {
      color: "#435fe3",
      opacity: 0.5,
      weight: 10,
      fillColor: "#435fe3",
      fillOpacity: 1,
      radius: 400000,
    }),
    circle([12.05, -61.75], {
      color: "#435fe3",
      opacity: 0.5,
      weight: 10,
      fillColor: "#435fe3",
      fillOpacity: 1,
      radius: 400000,
    }),
    circle([1.3, 103.8], {
      color: "#435fe3",
      opacity: 0.5,
      weight: 10,
      fillColor: "#435fe3",
      fillOpacity: 1,
      radius: 400000,
    }),
  ];

  // open candidate detail
  opendetail(id: any) {
    this.candidatedetail = this.candidatelist[id];
  }

  // Follow - unfollow
  followClick(ev: any) {
    if (this.followbtn == "1") {
      this.followbtn = "2";
      this.followtxt = "Unfollow";
    } else {
      this.followbtn = "1";
      this.followtxt = "Follow";
    }
  }
}
