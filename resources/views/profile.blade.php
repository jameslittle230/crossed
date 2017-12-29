@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <h1>{{ $user->username }}'s profile
                @if($lookingAtSelf)
                    <small>(You)</small>
                @endif
            </h1>

            @if (session('status'))
                <div class="alert alert-success">
                    {{ session('status') }}
                </div>
            @endif

            <div class="panel panel-default">
                <div class="panel-heading">Puzzles</div>

                <div class="panel-body">
                    <ul>
                    @forelse($user->puzzles as $puzzle)
                        <li><a href="{{ $puzzle->path() }}">{{ $puzzle->name }}</a></li>
                    @empty
                        <p>{{ $user->username }} hasn't created any puzzles yet.</p>
                    @endforelse
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
