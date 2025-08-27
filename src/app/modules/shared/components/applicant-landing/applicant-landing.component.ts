import { Component } from "@angular/core";
import {
  NgbCarouselModule,
  NgbModal,
  NgbNavModule,
  NgbToastModule,
} from "@ng-bootstrap/ng-bootstrap";

// Ck Editer

// Sweet Alert

// Email Data Get
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { SharedModule } from "../../shared.module";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ToastService } from "src/app/modules/service/toast.service";
import { CommonService } from "src/app/modules/service/common.service";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { environment } from "src/environments/environment.prod";
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: "app-applicant-landing",
  templateUrl: "./applicant-landing.component.html",
  styleUrl: "./applicant-landing.component.scss",
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgbToastModule,
    ScrollToModule,
    NgbCarouselModule,
    NgbNavModule,
    RouterModule,
    MatTabsModule,
  ],
})
export class ApplicantLandingComponent {

  student: any = {
  firstName: "Anold",
  middleName: "Kenedy",
  lastName: "Chao",
  studentId: "DIDES/2023/001",
  program: "Bachelor of Business Administration",
  year: "2",
  semester: "1",
  profilePicture: "assets/images/default-profile.png"
};

// Results data
results: any[] = [
  {
    semester: "1",
    gpa: "3.8",
    cgpa: "3.8",
    rank: "5",
    status: "Pass",
    details: {
      courses: [
        { code: "BBA101", name: "Introduction to Business", grade: "A", credits: "3" },
        { code: "BBA102", name: "Principles of Management", grade: "A-", credits: "3" },
        { code: "BBA103", name: "Business Mathematics", grade: "B+", credits: "3" },
        { code: "COM101", name: "Communication Skills", grade: "A", credits: "2" }
      ]
    }
  },
  {
    semester: "2",
    gpa: "3.6",
    cgpa: "3.7",
    rank: "7",
    status: "Pass",
    details: {
      courses: [
        { code: "BBA201", name: "Financial Accounting", grade: "B+", credits: "3" },
        { code: "BBA202", name: "Marketing Principles", grade: "A-", credits: "3" },
        { code: "BBA203", name: "Business Statistics", grade: "B", credits: "3" },
        { code: "ICT201", name: "Business Information Systems", grade: "A", credits: "2" }
      ]
    }
  }
];

// Timetable data
timetable: any[] = [
  {
    day: "Monday",
    startTime: "08:00 AM",
    endTime: "10:00 AM",
    course: "Financial Accounting (BBA201)",
    lecturer: "Dr. James Mwambene",
    room: "Block A, Room 101"
  },
  {
    day: "Monday",
    startTime: "10:30 AM",
    endTime: "12:30 PM",
    course: "Marketing Principles (BBA202)",
    lecturer: "Prof. Sarah Johnson",
    room: "Block B, Room 205"
  },
  {
    day: "Tuesday",
    startTime: "09:00 AM",
    endTime: "11:00 AM",
    course: "Business Statistics (BBA203)",
    lecturer: "Dr. Michael Petro",
    room: "Block A, Room 102"
  },
  {
    day: "Wednesday",
    startTime: "02:00 PM",
    endTime: "04:00 PM",
    course: "Business Information Systems (ICT201)",
    lecturer: "Dr. Alice Mwakasege",
    room: "Computer Lab 1"
  },
  {
    day: "Thursday",
    startTime: "08:00 AM",
    endTime: "10:00 AM",
    course: "Entrepreneurship (BBA204)",
    lecturer: "Prof. Robert Kimambo",
    room: "Block C, Room 301"
  }
];

// Announcements data
announcements: any[] = [
  {
    title: "Mid-Semester Break Notice",
    date: new Date("2023-10-15"),
    content: "The mid-semester break will be from October 23rd to October 27th. Classes will resume on October 30th.",
    attachment: null
  },
  {
    title: "Library Closure",
    date: new Date("2023-10-10"),
    content: "The main library will be closed for maintenance on October 18th and 19th. Please plan your studies accordingly.",
    attachment: null
  },
  {
    title: "Entrepreneurship Workshop",
    date: new Date("2023-10-05"),
    content: "There will be a special entrepreneurship workshop on November 3rd from 2 PM to 5 PM in the main auditorium. All business students are encouraged to attend.",
    attachment: "assets/documents/workshop_details.pdf"
  },
  {
    title: "Examination Timetable",
    date: new Date("2023-09-28"),
    content: "The examination timetable for semester 1 has been published. Please check your student portal for details.",
    attachment: "assets/documents/exam_timetable.pdf"
  }
];

  isDropdownOpen = false;
  currentUser: any;
  studentId: any;
  

  resultsColumns: any[] = [
    { header: "Semester", value: "semester" },
    { header: "GPA", value: "gpa" },
    { header: "CGPA", value: "cgpa" },
    { header: "Rank", value: "rank" },
    { header: "Status", value: "status" },
    { header: "Actions", value: "actions", class: "d-flex justify-content-center" }
  ];
  


  timetableColumns: any[] = [
    { header: "Day", value: "day" },
    { header: "Time", value: "time" },
    { header: "Course", value: "course" },
    { header: "Lecturer", value: "lecturer" },
    { header: "Room", value: "room" }
  ];
  

  
  public readonly baseUrl: string = `${environment.BASE_API}:8086/api/v1`;

  constructor(
    private dialog: MatDialog,
    private modalService: NgbModal,
    private commonSvc: CommonService,
    private toastSvc: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("userInfo"));   
    this.studentId = this.currentUser?.uuid;
    this.loadStudentData();
  }

  ngOnInit(): void {
    this.fetchStudentResults();
    this.fetchTimetable();
    this.fetchAnnouncements();
  }

  loadStudentData() {
    // this.commonSvc.getStudentById(this.studentId).subscribe((response) => {
    //   if (response.code === 6000) { 
    //     this.student = response?.data;
    //     // Set default profile picture if none exists
    //     if (!this.student.profilePicture) {
    //       this.student.profilePicture = 'assets/images/default-profile.png';
    //     }
    //   }
    // });
  }

  fetchStudentResults() {
    // this.commonSvc.getStudentResults(this.studentId).subscribe({
    //   next: (response) => {
    //     if (response.code === 6000) {
    //       this.results = response.data;
    //     }
    //   }
    // });
  }

  fetchTimetable() {
    // this.commonSvc.getStudentTimetable(this.studentId).subscribe({
    //   next: (response) => {
    //     if (response.code === 6000) {
    //       this.timetable = response.data;
    //     }
    //   }
    // });
  }

  fetchAnnouncements() {
    // this.commonSvc.getAnnouncements().subscribe({
    //   next: (response) => {
    //     if (response.code === 6000) {
    //       this.announcements = response.data;
    //     }
    //   }
    // });
  }

  viewResultDetails(result: any) {
    const data = {
      title: `Result Details - Semester ${result.semester}`,
      result: result
    };

    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = false;
    config.autoFocus = true;
    config.width = "60%";
    config.position = { top: "75px" };
    config.panelClass = "mat-dialog-box";
    
   // this.dialog.open(ViewResultDetailsComponent, config);
  }

  editProfile() {
    const data = {
      title: "Edit Student Profile",
      label: "Update",
      student: this.student
    };

    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = true;
    config.autoFocus = false;
    config.width = "60%";
    config.position = { top: "90px" };
    config.panelClass = "mat-dialog-box";

    //const dialog = this.dialog.open(EditStudentProfileComponent, config);
    // dialog.afterClosed().subscribe((response) => {
    //   if (response?.code === 6000) {
    //     this.toastSvc.success("Information", "Profile updated successfully", 6000);
    //     this.loadStudentData();
    //   }
    // });
  }

  changePassword(from: string) {
    const data = {
      title: "Change Password",
      label: "Change",
      from: from,
    };

    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = true;
    config.autoFocus = false;
    config.width = "60%";
    config.position = { top: "90px" };
    config.panelClass = "mat-dialog-box";

   // const dialog = this.dialog.open(ChangeDefaultPasswordComponent, config);
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    localStorage.clear();
    this.router.navigate([`/login`]);
  }

  onTabChanged(event: any) {
    // You can add specific logic when tabs change if needed
    console.log('Tab changed to:', event.tab.textLabel);
  }
}