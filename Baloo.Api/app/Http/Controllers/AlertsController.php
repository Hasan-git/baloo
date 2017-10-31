<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Alert;
use App\Rent;
use App\Car;
use Carbon;

class AlertsController extends Controller
{
    public function get()
    {
      if(!Alert::all()->count() || Alert::whereDate('created_at', '!=' , Carbon::today())->count() ){

        //delete all records
        Alert::truncate();

        $endedRents = Rent::whereDate('dateIn', '=' , Carbon::tomorrow())->get();

          foreach ($endedRents as $var) {

            $carName = $var->car->name->name;
            $carplate = $var->car->plateNumber;
            $clientName = $var->client->name;

            $alert = new Alert();
            $alert->title = 'rent ends';
            $alert->content = "Leasing contract for car $carName ($carplate) and client ".  ucfirst($clientName) ." will end tomorrow ";
            $alert->client_id = $var->client_id;
            $alert->rent_id = $var->id;
            $alert->car_id = $var->car_id;
            $alert->save();
          }

        $startedRents = Rent::whereDate('dateOut', '=' , Carbon::tomorrow())->get();
          foreach ($startedRents as $var) {

              $carName = $var->car->name->name;
              $carplate = $var->car->plateNumber;
              $clientName = $var->client->name;

              $alert = new Alert();
              $alert->title = 'rent starts';
              $alert->content = "Leasing contract for car $carName ($carplate) and client ".  ucfirst($clientName) ." will begin tomorrow ";
              $alert->client_id = $var->client_id;
              $alert->rent_id = $var->id;
              $alert->car_id = $var->car_id;
              $alert->save();
          }

        $carMechanics = Car::whereYear('officialMechanic' ,'>=' , Carbon::tomorrow()->subYears(3))
                            ->whereMonth('officialMechanic','=' , Carbon::tomorrow()->month)
                            ->whereDay('officialMechanic','=' , Carbon::tomorrow()->day)
                            ->get();

          foreach ($carMechanics as $var) {
              $carName = $var->name->name;
              $carplate = $var->plateNumber;

              $alert = new Alert();
              $alert->title = 'official mechanic';
              $alert->content = "Tomorrow is the first date for maintenance of the $carName ($carplate)";
              $alert->car_id = $var->id;
              $alert->save();
          }
      }
      return ok(Alert::All()) ;
    }

    public function updateAlertStatus(Request $model)
    {
      $rules = array('id'=>'required','isCompleted' => 'required');
      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $alert = Alert::find($model->id);

      if(!$alert)
        return response()->json([],404);

      $alert->isCompleted = (int) $model->isCompleted;

      $alert->update();

      return ok();
    }

}
