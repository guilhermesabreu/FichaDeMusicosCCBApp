import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegistroPessoaComponent } from './registroPessoa/registroPessoa.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { PessoaService } from './services/PessoaService/pessoa.service';
import { NavComponent } from './nav/nav.component';

@NgModule({
  declarations: [		
    AppComponent,
    LoginComponent,
    NavComponent,
      RegistroPessoaComponent
   ],
  imports: [
    AppRoutingModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    FormsModule,
    CalendarModule,
    AutoCompleteModule,
    BsDatepickerModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    PessoaService,
    {
       provide: HTTP_INTERCEPTORS,
       useClass: AuthInterceptor,
       multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
