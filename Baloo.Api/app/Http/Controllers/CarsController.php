<?php

namespace App\Http\Controllers;

use App\Http\Transformers\Car\CarViewModel;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Spatie\Fractalistic\Fractal;
use Illuminate\Http\Request;
use Storage;
use App\Car;

class CarsController extends Controller
{

  /* api/cars/get */
  public function get()
  {
    try {

      $cars = Car::all();

      if($cars)
        $result = fractal($cars, new CarViewModel);

        return ok($result);


    }catch (\Exception $e){
        return $e->getMessage();
    }
  }

  /* api/cars/get/1 */
  public function getById($id)
  {

    try{

      if(!$id)
        return response()->json([],400);

      $car = Car::find($id);

      if( !$car)
        return response()->json([],404);

      $result = fractal($car, new CarViewModel);

      return ok($result);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

  /* api/cars/post */
  public function post( Request $model)
  {
    try{

      //'photo' => 'mimes:jpeg,bmp,png'
      $rules = array('name_id' => 'required','purchasingDate' => 'nullable|date','officialMechanic' => 'nullable|date','imagefile' => 'mimes:jpeg,jpg,bmp,png');
      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $car = new Car($model->all());

      if($model->hasFile('imagefile')){

        $fileName = uniqid().'@'.$model->file('imagefile')->getClientOriginalName();

        Storage::put(
            'cars/'. $fileName,
            file_get_contents($model->file('imagefile')->getRealPath())
        );
        $car->image = $fileName;
      }

      $car->save();
      $result = fractal($car, new CarViewModel);

      return ok($result);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

  /* api/cars/update */
  public function update( Request $model)
  {
    try{

      $rules = array('id'=>'required','name_id' => 'required','imagefile' => 'mimes:jpeg,jpg,bmp,png');
      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $car = Car::find($model->id);

      if(!$car)
        return response()->json([],404);

      //User Deleted The existing Image
      if(!strlen($model->image) && strlen($car->image)){
        if(Storage::has('cars/'.$car->image)){
            Storage::delete('cars/'.$car->image);
        }
        $car->image = null;
      }

      //User Uploaded New Image
      if($model->hasFile('imagefile')){

        $fileName = uniqid().'@'.$model->file('imagefile')->getClientOriginalName();

        Storage::put(
            'cars/'. $fileName,
            file_get_contents($model->file('imagefile')->getRealPath())
        );
        $car->image = $fileName;
      }

      $car->update($model->all());

      $result = fractal($car, new CarViewModel);

      return ok($result);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

  /* api/cars/carSold */
  public function carSold( Request $model)
  {
    try{

      $rules = array('id'=>'required','sellingDate'=>'required','sellingPrice'=>'required');
      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $car = Car::find($model->id);

      if(!$car)
        return response()->json([],404);

      $car->isSold = true;
      $car->sellingDate = $model->input("sellingDate");
      $car->sellingPrice = $model->input("sellingPrice");

      $car->update($model->all());
      $car->delete();

      return ok();

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

  // Get all cars and Recheck each car status
  public function refreshCarsStatus()
  {
    // try
    // {
       $cars = Car::all();

       if(!$cars)
        return response()->json([],200);

      foreach ($cars as $key => $car) {
        $car_ = Car::find($car->id);
        $car_->status = $car_->setStatusAttribute();
        $car_->update();
      }

      return ok();

    // }catch(\Exception $e)
    // {
    //   return $e->getMessage();
    // }
  }

  /* api/cars/delete/1 */
  public function delete($id)
  {

    try{

        $car = Car::find($id);

        if(!$car)
          return response()->json([],404);

        $car->forceDelete();

      return ok();

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }
}
