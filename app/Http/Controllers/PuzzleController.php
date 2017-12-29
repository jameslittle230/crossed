<?php

namespace App\Http\Controllers;

use App\Puzzle;
use Illuminate\Http\Request;

class PuzzleController extends Controller
{
    public function show($slug)
    {
        $puzzle = Puzzle::getSlug($slug);
        return $puzzle;
    }
}
