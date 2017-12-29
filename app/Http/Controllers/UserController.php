<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\User;

class UserController extends Controller
{
    public function redirectToMe()
    {
        // Assumed auth middleware
        $user = Auth::user();
        return redirect()->route('user', ['username' => $user->username]);
    }

    public function show($username)
    {
        $user = User::getUsername($username);

        if($user->id == Auth::id()) {
            return "This is me";
        } else {
            return "You're looking at " . $username;
        }
    }
}
