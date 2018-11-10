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
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {AuthenticatorService} from "./autheticator/AuthenticatorService";
import {AuthenticatorFactory} from "./autheticator/AuthenticatorFactory";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    UsersListComponent,
    ConversationsComponent,
  ],
  imports: [
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
    CommonModule
  ],
  providers: [
    AuthenticatorService,
    {provide: APP_INITIALIZER, useFactory: AuthenticatorFactory, deps: [AuthenticatorService], multi: true},
    ConversationService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {


}
