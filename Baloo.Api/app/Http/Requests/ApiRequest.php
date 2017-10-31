<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest as Requests;

abstract class ApiRequests extends Requests{

    public function response(array $error)
    {
      return response()->json(['error' => $error], 400);
    }
}
