import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Code Projects';

  contactData = {
    name: '',
    email: '',
    message: ''
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    // Call .NET API
    this.http.post('http://localhost:5263/api/contact', this.contactData).subscribe({
      next: (response) => {
        this.submitSuccess = true;
        this.isSubmitting = false;
        this.contactData = { name: '', email: '', message: '' }; // reset form
      },
      error: (err) => {
        console.error('Error submitting form:', err);
        this.submitError = true;
        this.isSubmitting = false;
      }
    });
  }
}
