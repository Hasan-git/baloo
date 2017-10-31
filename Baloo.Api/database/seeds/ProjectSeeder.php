<?php

use Illuminate\Database\Seeder;
use App\Car;
use App\CarsNames;


class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

      if (!CarsNames::where('name', '=', "Kia Rio")->exists()) {
        $CarName = new CarsNames();
        $CarName->id = 1;
        $CarName->name = "Kia Rio";
        $CarName->save();

        $car = new Car();
        $car->name_id = 1;
        $car->type = "sport";
        $car->plateNumber = "220331";
        $car->model = "2016";
        $car->color = "Red";
        $car->notes = "";
        $car->status = "available";
        $car->chassisNumber = "442345SSSA6W4";
        $car->officialMechanic = "2016-10-27";
        $car->km = 8000;
        $car->purchasingDate = "2016-09-27";
        $car->purchasingPrice = 14000;

        $car->name()->save($CarName);
        $car->save();

      }

      if (!CarsNames::where('name', '=', "Kia Picanto")->exists()) {
        $CarName = new CarsNames();
        $CarName->id = 2;
        $CarName->name = "Kia Picanto";
        $CarName->save();

        $car = new Car();
        $car->name_id = 2;
        $car->type = "sport";
        $car->plateNumber = "120334";
        $car->model = "2016";
        $car->color = "Blue";
        $car->notes = "Free revisions for 1 Year";
        $car->status = "available";
        $car->officialMechanic = "2017-10-27";
        $car->chassisNumber = "442345SSSA6W4";
        $car->km = 8000;
        $car->purchasingDate = "2017-09-27";
        $car->purchasingPrice = 14000;
        $car->name()->save($CarName);
        $car->save();
      }

      if (!CarsNames::where('name', '=', "Nissan Sunny")->exists()) {
        $CarName = new CarsNames();
        $CarName->id = 3;
        $CarName->name = "Nissan Sunny";
        $CarName->save();

        $car = new Car();
        $car->name_id = 3;
        $car->type = "sport";
        $car->plateNumber = "986334";
        $car->model = "2016";
        $car->color = "Blue";
        $car->notes = "Free revisions for 1 Year";
        $car->status = "available";
        $car->officialMechanic = "2015-10-27";
        $car->chassisNumber = "442345SSSA6W4";
        $car->km = 8000;
        $car->purchasingDate = "2015-09-27";
        $car->purchasingPrice = 14000;
        $car->name()->save($CarName);
        $car->save();
      }


    }
}
