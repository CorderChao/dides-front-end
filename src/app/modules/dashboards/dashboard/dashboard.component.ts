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
 selectedPeriod = 'month';
  
  // Financial Data
  totalCollections = 0;
  tuitionCollections = 0;
  otherCollections = 0;
  outstandingBalance = 0;
  
  // Chart Configurations
  resultsDistribution: any = {
    series: [],
    chart: {
      type: 'donut',
      height: 320
    },
    labels: ['A', 'B+', 'B', 'C', 'D', 'F'],
    colors: ['#2E7D32', '#5D8C3E', '#8BC34A', '#FFC107', '#FF9800', '#F44336'],
    legend: {
      position: 'bottom'
    }
  };

  enrollmentTrends: any = {
    series: [{
      name: 'Enrollment',
      data: []
    }],
    chart: {
      type: 'area',
      height: 320,
      sparkline: {
        enabled: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: []
    },
    dataLabels: {
      enabled: false
    }
  };

  recentActivities = [];
  
  // CountUp options
  option = {
    startVal: 0,
    useEasing: true,
    duration: 2,
    decimalPlaces: 0,
    prefix: 'TZS '
  };

  constructor(
    //private financeService: FinanceService,
  //  private academicService: AcademicService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadFinancialData();
    this.loadAcademicData();
    this.loadRecentActivities();
  }

  loadFinancialData(): void {
    // this.financeService.getFinancialSummary(this.selectedPeriod).subscribe({
    //   next: (data) => {
    //     this.totalCollections = data.totalCollections;
    //     this.tuitionCollections = data.tuitionCollections;
    //     this.otherCollections = data.otherCollections;
    //     this.outstandingBalance = data.outstandingBalance;
    //   },
    //   error: (err) => console.error('Failed to load financial data', err)
    // });
  }

  loadAcademicData(): void {
    // this.academicService.getResultsDistribution().subscribe({
    //   next: (data) => {
    //     this.resultsDistribution.series = data.series;
    //   },
    //   error: (err) => console.error('Failed to load results data', err)
    // });

    // this.academicService.getEnrollmentTrends().subscribe({
    //   next: (data) => {
    //     this.enrollmentTrends.series[0].data = data.series;
    //     this.enrollmentTrends.xaxis.categories = data.categories;
    //   },
    //   error: (err) => console.error('Failed to load enrollment data', err)
    // });
  }

  loadRecentActivities(): void {
    // this.academicService.getRecentActivities().subscribe({
    //   next: (activities) => {
    //     this.recentActivities = activities;
    //   },
    //   error: (err) => console.error('Failed to load activities', err)
    // });
  }

  updateFinancialData(): void {
    this.loadFinancialData();
  }
}