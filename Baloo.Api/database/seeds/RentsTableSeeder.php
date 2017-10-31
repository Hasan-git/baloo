<?php

use Illuminate\Database\Seeder;
use App\Rent;

class RentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        if (!Rent::where('notes', '=', "Baloo Rents")->exists()) {

          $rent1 = new Rent();
          $rent1->dateOut = "2017-10-02 12:49:42";
          $rent1->dateIn = "2017-10-02 12:49:42";
          $rent1->days = "10";
          $rent1->costPerDay = "50";
          $rent1->total = "500";
          $rent1->cash = "400";
          $rent1->dueAmount = "100";
          $rent1->deposit = "50";
          $rent1->notes = "Baloo Rents";
          $rent1->kmOut = "50000";
          $rent1->kmIn = "50400";
          $rent1->kmTotal = "400";
          $rent1->employee = "Hasan";
          $rent1->status = "in";
          $rent1->secondDriverName = "Hasan wazni";
          $rent1->secondDriverLicenseId = "55692";

          $rent1->car_id = 1;
          $rent1->client_id = 1;
          $rent1->secondary_client_id = 1;
          $rent1->save();
        }

    }
}
