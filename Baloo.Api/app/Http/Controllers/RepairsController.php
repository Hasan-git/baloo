<?php

namespace App\Http\Controllers;

use App\Http\Transformers\Repair\RepairViewModel;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Spatie\Fractalistic\Fractal;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Repair;
use App\Car;
use Storage;

class RepairsController extends Controller
{

  /* api/cars/get */
  public function get()
  {
    try {

      $repairs = Repair::All();
      $result= fractal($repairs, new RepairViewModel)->parseIncludes(['client','car']);

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

      $repair = Repair::find($id);

      if(!$repair)
        return response()->json([],404);

      $result = fractal($repair, new RepairViewModel)->parseIncludes(['client','car']);

      return ok($result);

    }
    catch (\Exception $e) {
        //return $e->getMessage();
    }
  }

    /* api/cars/get/car/1 */
  public function getByCar($id)
  {
    try{

      if(!$id)
        return response()->json([],400);

      $car = Car::find($id);

      if(!$car)
        return response()->json([],404);

      $result = fractal($car->activeRepairs, new RepairViewModel)->parseIncludes(['client']);

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

      $rules = array('car_id' => 'required','date'=>'date','cost' => 'numeric','imagefile' => 'mimes:jpeg,jpg,bmp,png');
      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $repair = new Repair($model->all());
      $repair->isFinished = ($model === 'true');

      //check for uploaded image
      if($model->hasFile('imagefile')){

        $fileName = uniqid().'@'.$model->file('imagefile')->getClientOriginalName();

        Storage::put(
            'repairs/'. $fileName,
            file_get_contents($model->file('imagefile')->getRealPath())
        );
        $repair->image = $fileName;
      }

      $repair->save();

      // Set the car to Repair Status
      $car = $repair->car;
      $car->status = $car->setStatusAttribute();
      $car->update();

      $result = fractal($repair, new RepairViewModel)->parseIncludes(['client']);

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

      $rules = array('id'=>'required','car_id' => 'required','cost' => 'numeric','isFinished'=>'boolean','imagefile' => 'mimes:jpeg,jpg,bmp,png');
      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $repair = Repair::find($model->id);

      if(!$repair)
        return response()->json([],404);

      //User Deleted The existing Image
      if(!strlen($model->image) && strlen($repair->image)){
        if(Storage::has('repairs/'.$repair->image)){
            Storage::delete('repairs/'.$repair->image);
        }
        $repair->image = null;
      }

      //User Uploaded New Image
      if($model->hasFile('imagefile')){

        $fileName = uniqid().'@'.$model->file('imagefile')->getClientOriginalName();

        Storage::put(
            'repairs/'. $fileName,
            file_get_contents($model->file('imagefile')->getRealPath())
        );
        $repair->image = $fileName;
      }

      $repair->update($model->all());

      //update car
      $car = $repair->car;
      $car->status = $car->setStatusAttribute();
      $car->update();

      $result = fractal($repair, new RepairViewModel)->parseIncludes(['client']);

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

        $repair = Repair::find($id);

        if(!$repair)
          return response()->json([],404);

        $repair->delete();

      return ok();

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }
}
