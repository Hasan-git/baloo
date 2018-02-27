<?php

namespace App\Http\Controllers;

use App\Http\Transformers\Rent\RentViewModel;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Spatie\Fractalistic\Fractal;
use Illuminate\Http\Request;
use Storage;
use App\Rent;
use App\Car;
use Carbon;
// use App\Http\Transformers\serializer;


class RentsController extends Controller
{

  /* api/rents/get */
  public function get()
  {
    try {
 
      // $rents = Rent::active()->get();
      $rents = Rent::active()->whereHas('car', function ($query) {
            // just take the active cars
            $query->where('isSold', 0);
        })->get();

      if($rents)
        $result = fractal($rents, new RentViewModel);

        return ok($result);

    }catch (\Exception $e){
        return $e->getMessage();
    }
  }

  /* api/rents/get/1 */
  public function getById($id)
  {
    try{

      if(!$id)
        return response()->json([],400);

      $rent = Rent::find($id);

      if( !$rent)
        return response()->json([],404);

      $result = fractal($rent, new RentViewModel);

      return ok($result);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

  /* api/rents/post */
  public function post( Request $model)
  {
    try{

      $rules = array( 'car_id' => 'bail|required|exists:cars,id',
                      'client_id' => 'exists:clients,id',
                      'days' => 'integer',
                      'costPerDay' => 'integer',
                      'total' => 'integer',
                      'dateOut' => 'bail|required|rentDates|date',
                      'dateIn' => 'bail|required|rentDates|date|after:dateOut',
                      'cash' => 'integer',
                      'dueAmount' => 'integer',
                      'deposit' => 'integer',
                      );

      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $rent = new Rent($model->all());
      $rent->setStatusAttribute();
      $rent->save();

      $car = $rent->car;
      $car->setStatusAttribute();

      $car->update();

      $result = fractal($rent, new RentViewModel);

      return ok($result,$rent);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

  /* api/rents/update */
  public function update( Request $model)
  {
    try{

      $rules = array('id'=>'required',
                      'car_id' => 'bail|required|exists:cars,id',
                      'client_id' => 'exists:clients,id',
                      'dateOut' => 'bail|required|date|rentDates',
                      'dateIn' => 'bail|required|date|rentDates|after:dateOut',
                      'days' => 'integer',
                      'costPerDay' => 'integer',
                      'total' => 'integer',
                      'cash' => 'integer',
                      'dueAmount' => 'integer',
                      'deposit' => 'integer'
                      );

      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $rent = Rent::find($model->id);
      $rent->setStatusAttribute();

      if(!$rent)
        return response()->json([],404);

      $rent->update($model->all());

      $car = $rent->car;
      $car->status = $car->setStatusAttribute();
      $car->update();

     // $rent->update($model->all());

      $result = fractal($rent, new RentViewModel);

      return ok($result);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

  /* api/rents/delete/1 */
  public function delete($id)
  {

    try{

        $rent = Rent::find($id);

        if(!$rent)
          return response()->json([],404);

        $car_id = $rent->car_id;

        $rent->delete();

        $car = car::find($car_id);
        $car->status = $car->setStatusAttribute();
        $car->update();

      return ok();

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

}
