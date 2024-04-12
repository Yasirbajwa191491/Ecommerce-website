<?php

namespace App\Interfaces;

interface UserRepositoryInterface{
    public function findSingleUser($id);
    public function create($request);
}