<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Role;
use Illuminate\Support\Facades\Auth;


class HomeController extends Controller
{

    //private $fractal;

    function __construct()
    {
    }
    public function __construct()
    {
      //$this->middleware('role:admin');
        //$this->fractal = $fractal;Manager $fractal
    }

    public function home()
    {
      return response()->json('Welcome');
    }

    public function index()
    {

      return Auth::user();
      //return auth()->guard('api')->user();

      //return User::all();
    }

    public function getUserRoles($userId)
    {
      return User::find($userId)->roles;

      // $user = User::find($userId);
      //  return $user->hasRole('admin');
    }

    public function attachUserRole($userId,$role)
    {
     $user = User::find($userId);

     $roleId = Role::where('name',$role)->first();

     $user->roles()->attach($roleId);

     return $user;
    }

    public function fractal(){

      $car = Car::find(2);

      if (!$car)
        return response()->json([], 200);

      $books = \Spatie\Fractalistic\Fractal::create()
       ->item($car)
       ->transformWith(CarViewModel::class)
       ->withResourceName('books')
       ->toArray();



      return response()->json($books);
      $books = fractal($car, new CarViewModel);
    }
}
