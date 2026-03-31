import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; 

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent implements OnInit {

  constructor(private router:Router,private dialog: MatDialog,
   private renderer: Renderer2){
  }
  ngOnInit(): void {
    
  }
  handleMasterAccordionClick(): void {
    const collapseTwo = document.getElementById('collapseTwo');
    const collapseThree = document.getElementById('collapseThree');
    this.renderer.removeClass(collapseTwo, 'show');
    this.renderer.removeClass(collapseThree, 'show');
  }
  handleMeetingAccordionClick(): void {
    const collapseOne = document.getElementById('collapseOne');
    const collapseThree = document.getElementById('collapseThree');
    this.renderer.removeClass(collapseOne, 'show');
    this.renderer.removeClass(collapseThree, 'show');
  }

  handleReportsAccordionClick(): void {
    const collapseOne = document.getElementById('collapseOne');
    const collapseTwo = document.getElementById('collapseTwo');
    this.renderer.removeClass(collapseOne, 'show');
    this.renderer.removeClass(collapseTwo, 'show');
  }
  logout() {
    localStorage.clear();
    this.router.navigate([''])

  }
toggleAccordion(targetId: string) {
  const target = document.getElementById(targetId);
  const button = document.querySelector(`[aria-controls="${targetId}"]`);

  if (!target || !button) return;

  // Close all other accordions
  const allAccordions = document.querySelectorAll('.accordion-collapse');
  const allButtons = document.querySelectorAll('.accordion-button');

  allAccordions.forEach((el) => {
    if (el.id !== targetId) {
      el.classList.remove('show');
    }
  });

  allButtons.forEach((btn) => {
    if ((btn as HTMLElement).getAttribute('aria-controls') !== targetId) {
      btn.classList.add('collapsed');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Toggle clicked one
  const isOpen = target.classList.toggle('show');

  if (isOpen) {
    button.classList.remove('collapsed');
    button.setAttribute('aria-expanded', 'true');
  } else {
    button.classList.add('collapsed');
    button.setAttribute('aria-expanded', 'false');
  }
}


    //change password
       openChangePasswordDialog() {
          // const dialogRef = this.dialog.open(ChangePasswordComponent, {
          //   width: '400px', // Adjust width as needed
          //   maxWidth: '90vw', // Keeps it responsive
          //   disableClose: false, // Prevents closing on outside click
          //   panelClass: 'custom-dialog-center', // Custom class for centering
          // });
        
          // dialogRef.afterClosed().subscribe((message: any) => {
         
          // });
        }
}