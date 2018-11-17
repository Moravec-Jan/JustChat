import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {AppComponent} from './app.component';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {UsersListComponent} from './users/users-list.component';
import {ConversationsComponent} from './conversations/conversations.component';
import {ConversationService} from "./conversations/conversation.service";
import {UserService} from "./users/user.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {AuthenticatorService} from "./autheticator/authenticator.service";
import {AuthenticatorFactory} from "./autheticator/authenticator.factory";
import {CommonModule} from "@angular/common";
import {SocketService} from "./socket/socket.service";
import {LoginComponent} from './login/login.component';
import {RouterModule, Routes} from "@angular/router";
import {ChatComponent} from './chat/chat.component';
import {CookieService} from 'ngx-cookie-service';


const appRoutes: Routes = [
  {path: '', component: ChatComponent},
  {path: 'login', component: LoginComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    UsersListComponent,
    ConversationsComponent,
    LoginComponent,
    ChatComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatGridListModule,
    MatListModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    CookieService,
    AuthenticatorService,
    {
      provide: APP_INITIALIZER,
      useFactory: AuthenticatorFactory,
      deps: [AuthenticatorService, SocketService, UserService],
      multi: true
    },
    ConversationService,
    UserService,
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
