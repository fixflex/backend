import {   Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {  autoInjectable } from 'tsyringe'

import { AuthServie } from '../services/auth.service';

// TODO: use passport.js for authentication
 
@autoInjectable()
export class AuthController {

  constructor(private readonly authService: AuthServie) {}
 

  public signup = asyncHandler(async (req: Request, res: Response)  => {
    let response = await this.authService.signup(req.body);
    res.status(201).json(response);
  });

  public login = asyncHandler(async (req: Request, res: Response ) => {
    let { email, password } = req.body;
    
    let {user, token} = await this.authService.login(email, password);
   
    const userData = { _id: user._id, email: user.email };

    res.status(200).json({ data: userData, token });
  });
}
