<?php
namespace App\Repositories;
use App\Models\User;
use App\Interfaces\UserRepositoryInterface;
class UserRepository implements UserRepositoryInterface{
   public function findSingleUser($id){
    return User::findOrFail($id);
   
} 
public function create($data){
    try {
        return User::create($data);
    } catch (\Throwable $e) {
        return response()->json(['message' => 'Unable to create user.'.$e], 500);
    }

}
}
?>