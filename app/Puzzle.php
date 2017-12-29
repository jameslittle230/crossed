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
        return "/puzzle/".$this->slug;
    }

    /**
     * A dynamic eloquent scope. Lets you do things like
     * App\Puzzle::getSlug('littleguy23');
     *
     * Returns only the instance, not the collection (because it's assumed to
     * be unique)
     */
    public function scopeGetSlug($query, $username)
    {
        return $query->where('slug', $username)->firstOrFail();
    }
}
