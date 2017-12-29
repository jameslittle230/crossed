<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function puzzles()
    {
        return $this->hasMany('App\Puzzle');
    }

    /**
     * A dynamic eloquent scope. Lets you do things like
     * App\User::getUsername('littleguy23');
     *
     * Returns only the instance, not the collection (because it's assumed to
     * be unique)
     */
    public function scopeGetUsername($query, $username)
    {
        return $query->where('username', $username)->firstOrFail();
    }
}
