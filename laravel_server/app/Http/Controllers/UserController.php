<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Traits\SendMessage;
use Laravel\Sanctum\PersonalAccessToken;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public $UserRepository;
    use SendMessage;
    public function __construct(UserRepositoryInterface $UserRepository){
        $this->UserRepository = $UserRepository;
    }
public function login(Request $request){
    try {
        $validator=Validator::make($request->all(),[
            'password' => 'required|string|min:6',
            'email' => 'required|email',
         ]);
         if ($validator->fails()) {
            $message = $validator->errors()->first();
            return response()->json(['error' => $message], 200);
        }
        $checkUser=User::where('email',$request->email)->first();
        $passwordMatch=Hash::check($request->password,$checkUser->password);
        if ($checkUser && $passwordMatch) {
            $token = $checkUser->createToken('auth_token');

            // Access the underlying PersonalAccessToken model
            $tokenModel = $token->accessToken;

            // Set the expiration time for the token
            $tokenModel->expires_at = Carbon::now()->addHours(96); // Set expiration to 96 hours from now
            $tokenModel->save();
            return $this->send('Login Success', $token->plainTextToken,$checkUser);
        }else{
        return response()->json(['error' => 'invalid login details'], 200);
        }
    } catch (\Throwable $e) {
        return response()->json(['message' => 'Unable to login.'.$e], 500);

    }
}
    public function signup(Request $request){
        try {
            $messages = [
                'password.password' => 'The :attribute must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
                'cpassword' => 'Password and Confirm Password should be match',
            ];
             $validator=Validator::make($request->all(),[
                'name' => 'required|string',
                'username' => 'required|string',
                'password' => 'required|string|min:6',
                'cpassword' => 'required|string|same:password', 
                'email' => 'required|email',
             ],$messages);
             if ($validator->fails()) {
                $message = $validator->errors()->first();
                return response()->json(['error' => $message], 200);
            }
            $checkUser=User::where('email',$request->email)->first();
            if($checkUser){
                return response()->json(['error' => 'User Already Exist'], 200);
            }{
             $user=$this->UserRepository->create($request->all());
             if($user){
                $token = $user->createToken('auth_token');

                // Access the underlying PersonalAccessToken model
                $tokenModel = $token->accessToken;
    
                // Set the expiration time for the token
                $tokenModel->expires_at = Carbon::now()->addHours(96); // Set expiration to 96 hours from now
                $tokenModel->save();
                return $this->send('User Created', $token->plainTextToken,$user);
             }
            }
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Unable to create user.'.$e], 500);

        }
 
    }
    public function checkAuthTokenValidity(Request $request)
    {
        // Retrieve the access token from the request headers or wherever it's stored
        $accessToken = $request->bearerToken();
    
        if (!$accessToken) {
            // Access token not provided
            return response()->json(['error' => 'Access token not provided'], 401);
        }
    
        // Retrieve the access token from the database
        $personalAccessToken = PersonalAccessToken::findToken($accessToken);
    
        if ($personalAccessToken) {
            // Check if the token is expired
            $expirationDateTime = Carbon::parse($personalAccessToken->expires_at);
            if ($expirationDateTime->isFuture()) {
                // Access token is valid
                return response()->json(['message' => 'Access token is valid'], 200);
            } else {
                // Access token is expired
                return response()->json(['error' => 'Access token is expired'], 401);
            }
        } else {
            // Access token not found in the database
            return response()->json(['error' => 'Access token is invalid'], 401);
        }
    }

    public function logout(Request $request)
    {
        try {
            // $user = $request->user(); // Retrieve the authenticated user
            // // Revoke all tokens issued to the user
            // $user->tokens()->delete();
            $token = $request->bearerToken();

            if ($token) {
                // Revoke the token from the Sanctum tokens table
                DB::table('personal_access_tokens')->where('token', $token)->delete();

                return response()->json(['message' => 'Logout success']);
            } else {
                return response()->json(['error' => 'Token not provided'], 401);
            }
    
        } catch (\Throwable $e) {
            Log::error('Logout failed: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to logout. Please try again later.'], 500);
     
        }
    
    }


    }