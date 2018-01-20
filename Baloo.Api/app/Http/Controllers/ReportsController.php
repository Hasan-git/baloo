<?php

namespace App\Http\Controllers;

use App\Http\Transformers\Report\CarReportViewModel;
use App\Http\Transformers\Report\ActiveCarReportViewModel;
use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use Spatie\Fractalistic\Fractal;
use League\Fractal\Resource\Collection as c;
use Illuminate\Http\Request;
use Carbon;
use App\Car;


class ReportsController extends Controller
{
    public function soldCars(){

      $cars = Car::onlyTrashed()->get();

      $result =  fractal($cars, new CarReportViewModel);

      return $result;
    }

    public function activeCars(){

      $cars = Car::get();
      $res=[];
      $data=[];

      foreach ($cars as $key => $car) {

        $loopResult=[];
        //repairs 
        foreach ($car->repairs as $key => $record) {
          array_push($res,
           array(
              'id'=> $record->id,
              'date'=> Carbon::parse($record->date)->format('Y-m-d'),
              'carBrand'=> $car->name->brand,
              'carName'=>$car->name->name,
              'plateNumber'=>$car->plateNumber,
              'plateNumber'=>$car->plateNumber,
              'cost'=> ($record->cost ? ($record->cost * -1) : 0),
              'days'=> ( $record->days ? $record->days : 0),
              'client'=> ( $record->client->name ? $record->client->name : ""),
              'clientRentsDueAmount'=> ($record->client->getTotalDueAmountAttribute()  ),
              'clientRepairsDueAmount'=> ($record->client->getTotalRepairsDueAmountAttribute()  ),
              "type"=>'repair'
              )
           );
        }

        //rents
        foreach ($car->inActiveRents as $key => $record) {
          array_push($res,
           array(
              'id'=> $record->id,
              'date'=> Carbon::parse($record->dateOut)->format('Y-m-d') ,
              'carBrand'=> $car->name->brand,
              'carName'=>$car->name->name,
              'plateNumber'=>$car->plateNumber,
              'cost'=> ($record->total ? $record->total : 0),
              'days'=> ( $record->days ? $record->days : 0),
              'clientId'=> ( $record->client->id),
              'client'=> ( $record->client->name ? $record->client->name : ""),
              'clientRentsDueAmount'=> ($record->client->getTotalDueAmountAttribute()  ),
              'clientRepairsDueAmount'=> ($record->client->getTotalRepairsDueAmountAttribute()  ),
              "type"=>'rent'
              )
           );
        }
      }

      return $data['data'] = $res;
    }

    public function carsSituations(){

    }

    public function billing(){

    }

    public function clients(){

    }
}
