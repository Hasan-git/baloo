<?php

namespace App\Http\Controllers;

use App\Http\Transformers\Report\CarReportViewModel;
use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use Spatie\Fractalistic\Fractal;
use League\Fractal\Resource\Collection as c;
use Illuminate\Http\Request;
use App\Car;

class ReportsController extends Controller
{
    public function soldCars(){

      $cars = Car::onlyTrashed()->get();

      $result =  fractal($cars, new CarReportViewModel);

      return $result;
    }

    public function carsSituations(){

    }

    public function billing(){

    }

    public function clients(){

    }
}
