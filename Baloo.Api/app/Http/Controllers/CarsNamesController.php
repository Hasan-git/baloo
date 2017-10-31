<?php

namespace App\Http\Controllers;

use App\Http\Transformers\car\CarsNamesViewModel;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Spatie\Fractalistic\Fractal;
use Illuminate\Http\Request;
use App\CarsNames;

class CarsNamesController extends Controller
{

  /* api/cars/get */
  public function get()
  {
    try {

      $results = CarsNames::All();
      $result= fractal($results, new CarsNamesViewModel);

      return ok($result);

    }catch (\Exception $e){
        //return $e->getMessage();
    }
  }

  /* api/cars/get/Kia */
  public function getByName($name)
  {
    try{

      if(!$name)
        return response()->json([],400);

      $carName = CarsNames::where('name','=', $name)->first();

      if(!$carName)
        return response()->json([],404);

      $result = fractal($carName, new CarsNamesViewModel);

      return ok($result);

    }
    catch (\Exception $e) {
        //return $e->getMessage();
    }
  }

  /* api/cars/post */
  public function post( Request $model)
  {
    try{

      $rules = array('name' => 'required|unique:cars_names,name');
      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $carName = new CarsNames($model->all());
      $carName->save();
      $result = fractal($carName, new CarsNamesViewModel);

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

      $rules = array('id'=>'required','name' => 'required');
      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $result = CarsNames::find($model->id);

      if(!$result)
        return response()->json([],404);

      $result->update($model->all());

      $result = fractal($result, new CarsNamesViewModel);

      return ok($result);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

  /* api/cars/delete/1 */
  public function delete($id)
  {

    try{

        $carName = CarsNames::find($id);

        if(!$carName)
          return response()->json([],404);

        $carName->delete();

      return ok();

    }
    catch (\Exception $e) {
        //return $e->getMessage();
    }
  }

}
