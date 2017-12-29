<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Puzzle extends Model
{
    /**
     * Associate a puzzle with the user that created it
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function path()
    {
        return "/puzzle/".$this->id;
    }
}
