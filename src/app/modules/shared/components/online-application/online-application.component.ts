import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-online-application',
  templateUrl: './online-application.component.html',
  styleUrl: './online-application.component.scss'
})
export class OnlineApplicationComponent {
 applicationForm: FormGroup;
  currentStep = 1;
  totalSteps = 6;

  courses = [
    { id: 1, name: 'Certificate in Community Development' },
    { id: 2, name: 'Technician Certificate in Community Development' },
    { id: 3, name: 'Ordinary Diploma in Community Development' },
    { id: 4, name: 'Basic Technician Certificate in Agriculture Production' },
    { id: 5, name: 'Technician Certificate in Agriculture Production' },
    { id: 6, name: 'Ordinary Diploma in Agriculture Production' }
  ];

  vetaCourses = [
    { id: 1, name: 'Information and communication technology', nature: 'Long course' },
    { id: 2, name: 'Computer Application', nature: 'Short course' }
  ];

  freeCourses = [
    { id: 1, name: 'Poultry and Horticulture' },
    { id: 2, name: 'Aluminum and Welding' },
    { id: 3, name: 'Masonry' },
    { id: 4, name: 'Designing and video Production' }
  ];

  disabilities = [
    { id: 1, name: 'Speech' },
    { id: 2, name: 'Hearing' },
    { id: 3, name: 'Mobility' },
    { id: 4, name: 'Vision' },
    { id: 5, name: 'Albinism' },
    { id: 6, name: 'Others' }
  ];

  maritalStatuses = [
    { id: 1, name: 'Single' },
    { id: 2, name: 'Married' },
    { id: 3, name: 'Divorced' },
    { id: 4, name: 'Widowed' }
  ];

  residenceCategories = [
    { id: 1, name: 'In Campus' },
    { id: 2, name: 'Off Campus' }
  ];

  sponsorshipTypes = [
    { id: 1, name: 'Private' },
    { id: 2, name: 'Government' },
    { id: 3, name: 'Other' }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.applicationForm = this.fb.group({
      personalInfo: this.fb.group({
        lastName: ['', Validators.required],
        firstName: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        placeOfBirth: ['', Validators.required],
        citizenship: ['', Validators.required],
        permanentAddress: ['', Validators.required],
        contactAddress: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', Validators.required],
        maritalStatus: [''],
        hasDisability: [false],
        disabilityType: [[]],
        disabilityDetails: [''],
        sex: ['', Validators.required],
        residenceCategory: ['', Validators.required]
      }),
      
      nextOfKin: this.fb.group({
        name: ['', Validators.required],
        mobile: ['', Validators.required],
        relationship: ['', Validators.required],
        residence: ['', Validators.required]
      }),
      
      courseSelection: this.fb.group({
        selectedCourses: [[]],
        selectedVetaCourses: [[]],
        selectedFreeCourses: [[]]
      }),
      
      educationBackground: this.fb.group({
        primarySchool: this.fb.group({
          fromYear: [''],
          toYear: [''],
          authority: [''],
          schoolName: [''],
          country: ['']
        }),
        
        secondarySchool: this.fb.group({
          fromYear: [''],
          toYear: [''],
          indexNumber: [''],
          authority: [''],
          division: [''],
          schoolName: [''],
          country: ['']
        }),
        
        advancedEducation: this.fb.group({
          fromYear: [''],
          toYear: [''],
          indexNumber: [''],
          authority: [''],
          division: [''],
          schoolName: [''],
          country: ['']
        }),
        
        otherQualifications: this.fb.array([])
      }),
      
      sponsorship: this.fb.group({
        type: ['', Validators.required],
        name: [''],
        address: [''],
        mobile: [''],
        email: ['']
      }),
      
      declaration: this.fb.group({
        agreeToTerms: [false, Validators.requiredTrue]
      })
    });
  }

  get otherQualifications(): FormArray {
    return this.applicationForm.get('educationBackground.otherQualifications') as FormArray;
  }

  addQualification(): void {
    this.otherQualifications.push(this.fb.group({
      institute: [''],
      fromYear: [''],
      toYear: [''],
      award: ['']
    }));
  }

  removeQualification(index: number): void {
    this.otherQualifications.removeAt(index);
  }

  nextStep(): void {
    this.markCurrentStepAsTouched();
    if (!this.isCurrentStepValid()) {
      this.currentStep++;
      window.scrollTo(0, 0);
    }
  }

  prevStep(): void {
    this.currentStep--;
    window.scrollTo(0, 0);
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1: return this.applicationForm.get('personalInfo')?.valid ?? false;
      case 2: return this.applicationForm.get('nextOfKin')?.valid ?? false;
      case 3: 
      const courseSelection = this.applicationForm.get('courseSelection');
      return (courseSelection?.get('selectedCourses')?.value?.length > 0 || 
              courseSelection?.get('selectedVetaCourses')?.value?.length > 0 ||
              courseSelection?.get('selectedFreeCourses')?.value?.length > 0);;
      case 4: const education = this.applicationForm.get('educationBackground');
      // At least primary school info should be filled
      return !!education?.get('primarySchool.schoolName')?.value || 
             !!education?.get('secondarySchool.schoolName')?.value ||
             !!education?.get('advancedEducation.schoolName')?.value ||
             this.otherQualifications.length > 0;;
      case 5: return this.applicationForm.get('sponsorship')?.valid ?? false;
      default: return false;
    }
  }

markCurrentStepAsTouched(): void {
  switch (this.currentStep) {
    case 1: this.applicationForm.get('personalInfo')?.markAllAsTouched(); break;
    case 2: this.applicationForm.get('nextOfKin')?.markAllAsTouched(); break;
    case 3: this.applicationForm.get('courseSelection')?.markAllAsTouched(); break;
    case 4: this.applicationForm.get('educationBackground')?.markAllAsTouched(); break;
    case 5: this.applicationForm.get('sponsorship')?.markAllAsTouched(); break;
  }
}

  onSubmit(): void {
    this.markAllAsTouched();
    if (this.applicationForm.valid) {
      console.log('Form submitted:', this.applicationForm.value);
      alert('Application submitted successfully!');
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }

  markAllAsTouched(): void {
    this.applicationForm.markAllAsTouched();
  }

  onDisabilityChange(event: any, disability: string): void {
    const disabilities = this.applicationForm.get('personalInfo.disabilityType')?.value as string[];
    if (event.target.checked) {
      disabilities.push(disability);
    } else {
      const index = disabilities.indexOf(disability);
      if (index > -1) {
        disabilities.splice(index, 1);
      }
    }
    this.applicationForm.get('personalInfo.disabilityType')?.setValue(disabilities);
  }

  onCourseChange(event: any, courseId: number): void {
    const courses = this.applicationForm.get('courseSelection.selectedCourses')?.value as number[];
    if (event.target.checked) {
      courses.push(courseId);
    } else {
      const index = courses.indexOf(courseId);
      if (index > -1) {
        courses.splice(index, 1);
      }
    }
    this.applicationForm.get('courseSelection.selectedCourses')?.setValue(courses);
  }

  onVetaCourseChange(event: any, courseId: number): void {
    const courses = this.applicationForm.get('courseSelection.selectedVetaCourses')?.value as number[];
    if (event.target.checked) {
      courses.push(courseId);
    } else {
      const index = courses.indexOf(courseId);
      if (index > -1) {
        courses.splice(index, 1);
      }
    }
    this.applicationForm.get('courseSelection.selectedVetaCourses')?.setValue(courses);
  }

  onFreeCourseChange(event: any, courseId: number): void {
    const courses = this.applicationForm.get('courseSelection.selectedFreeCourses')?.value as number[];
    if (event.target.checked) {
      courses.push(courseId);
    } else {
      const index = courses.indexOf(courseId);
      if (index > -1) {
        courses.splice(index, 1);
      }
    }
    this.applicationForm.get('courseSelection.selectedFreeCourses')?.setValue(courses);
  }
}
