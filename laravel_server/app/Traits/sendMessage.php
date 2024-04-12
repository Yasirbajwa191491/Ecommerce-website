<?php

namespace App\Traits;

trait SendMessage{
     function send($message,$token,$data=''){
      return response()->json([
        'message'=> $message,
        'token'=>$token,
         'data'=>$data
      ]);
    }
}