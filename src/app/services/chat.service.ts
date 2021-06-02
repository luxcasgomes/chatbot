import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(public httpClient: HttpClient) { }

  async autenticate(){
    
    return await this.httpClient.post('http://ec2-3-16-43-85.us-east-2.compute.amazonaws.com:8000/api/authenticate',{
      "email":"app-lucas",
      "password":"abcd1234"
  }).toPromise()
  }

  async conversa(input, next_intent, user_ref, token){
    // console.log(input)
    // console.log(next_intent)
    // console.log(user_ref)
    // console.log(token)
      
    return await this.httpClient.post('http://ec2-3-16-43-85.us-east-2.compute.amazonaws.com:8000/api/conversation',{
      "input": input,
      "next_intent": next_intent,
      "user_ref": user_ref,
      "hook": ""
    },{
      headers: {"x-access-token":token}
    }).toPromise()
  }
  
}
